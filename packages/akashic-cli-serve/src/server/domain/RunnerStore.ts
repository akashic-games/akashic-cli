import { createRequire } from "module";
import * as path from "path";
import type { AMFlowClient, RunnerManager, RunnerV1, RunnerV2, RunnerV3 } from "@akashic/headless-driver";
import { Trigger } from "@akashic/trigger";
import type {
	RunnerCreateTestbedEvent,
	RunnerRemoveTestbedEvent,
	RunnerPauseTestbedEvent,
	RunnerResumeTestbedEvent,
	RunnerPutStartPointTestbedEvent
} from "../../common/types/TestbedEvent.js";
import { serverGlobalConfig } from "../common/ServerGlobalConfig.js";
import * as sandboxConfigs from "./SandboxConfigs.js";

const require = createRequire(import.meta.url);

export interface RunnerStoreParameterObject {
	runnerManager: RunnerManager;
	gameExternalFactory: () => any;
}

export interface CreateAndStartRunnerParameterObject {
	playId: string;
	isActive: boolean;
	token: string;
	amflow: AMFlowClient;
	contentId: string;
	isPaused: boolean;
}

export class RunnerStore {
	onRunnerCreate: Trigger<RunnerCreateTestbedEvent>;
	onRunnerRemove: Trigger<RunnerRemoveTestbedEvent>;
	onRunnerPause: Trigger<RunnerPauseTestbedEvent>;
	onRunnerResume: Trigger<RunnerResumeTestbedEvent>;
	onRunnerPutStartPoint: Trigger<RunnerPutStartPointTestbedEvent>;
	private runnerManager: RunnerManager;
	private gameExternalFactory: () => any;
	private playIdTable: { [runnerId: string]: string };

	constructor(params: RunnerStoreParameterObject) {
		this.onRunnerCreate = new Trigger<RunnerCreateTestbedEvent>();
		this.onRunnerRemove = new Trigger<RunnerRemoveTestbedEvent>();
		this.onRunnerPause = new Trigger<RunnerPauseTestbedEvent>();
		this.onRunnerResume = new Trigger<RunnerResumeTestbedEvent>();
		this.onRunnerPutStartPoint = new Trigger<RunnerPutStartPointTestbedEvent>();
		this.runnerManager = params.runnerManager;
		this.gameExternalFactory = params.gameExternalFactory;
		this.playIdTable = {};
	}

	async createAndStartRunner(params: CreateAndStartRunnerParameterObject): Promise<RunnerV1 | RunnerV2 | RunnerV3> {
		const sandboxConfig = sandboxConfigs.get(params.contentId);
		const externalAssets = (sandboxConfig ? sandboxConfig.externalAssets : undefined) === undefined ? [] : sandboxConfig.externalAssets;
		const allowedUrls = this.createAllowedUrls(params.contentId, externalAssets);

		const externalValue = { ...this.gameExternalFactory() ?? {} };
		const serverExternal = sandboxConfig?.server?.external;
		if (serverExternal) {
			for (const pluginName of Object.keys(serverExternal)) {
				const externalSource = require(path.resolve(serverExternal[pluginName]));
				externalValue[pluginName] = externalSource();
			}
		}

		const runnerId = await this.runnerManager.createRunner({
			playId: params.playId,
			amflow: params.amflow,
			executionMode: params.isActive ? "active" : "passive",
			playToken: params.token,
			allowedUrls,
			externalValue: externalValue,
			trusted: !serverGlobalConfig.untrusted
		});
		if (params.isActive) {
			params.amflow.onPutStartPoint.add((startPoint) => {
				this.onRunnerPutStartPoint.fire({ startPoint, playId: params.playId });
			});
		}

		const runner = this.runnerManager.getRunner(runnerId)!;
		await this.runnerManager.startRunner(runner.runnerId, { paused: params.isPaused });
		this.playIdTable[runnerId] = params.playId;
		this.onRunnerCreate.fire({ playId: params.playId, runnerId, isActive: params.isActive });
		if (params.isPaused)
			this.onRunnerPause.fire({ playId: params.playId, runnerId });
		return runner;
	}

	async stopRunner(runnerId: string): Promise<void> {
		const runner = this.runnerManager.getRunner(runnerId);
		if (runner) {
			// コンテンツがエラーの場合、runnerを取得できないので取得できる場合のみ実行
			await this.runnerManager.stopRunner(runnerId);
		}
		const playId = this.playIdTable[runnerId];
		this.onRunnerRemove.fire({ playId, runnerId });
		delete this.playIdTable[runnerId];
	}

	async pauseRunner(runnerId: string): Promise<void> {
		const runner = this.runnerManager.getRunner(runnerId);
		if (runner) {
			await this.runnerManager.pauseRunner(runner.runnerId);
			this.onRunnerPause.fire({ playId: runner.playId, runnerId: runnerId });
		}
	}

	async resumeRunner(runnerId: string): Promise<void> {
		const runner = this.runnerManager.getRunner(runnerId);
		if (runner) {
			await this.runnerManager.resumeRunner(runner.runnerId);
			this.onRunnerResume.fire({ playId: runner.playId, runnerId: runnerId });
		}
	}

	async stepRunner(runnerId: string): Promise<void> {
		const runner = this.runnerManager.getRunner(runnerId);
		if (runner) {
			await this.runnerManager.stepRunner(runner.runnerId);
		}
	}

	private createAllowedUrls(contentId: string, externalAssets: (string | RegExp)[] | null): (string | RegExp)[] | null {
		let allowedUrls: (string | RegExp)[] =
			[`${serverGlobalConfig.protocol}://${serverGlobalConfig.hostname}:${serverGlobalConfig.port}/contents/${contentId}/`];
		if (serverGlobalConfig.allowExternal) {
			// null は全てのアクセスを許可するため、nullが指定された場合は他の値を参照せず null を返す
			if (externalAssets === null) return null;

			allowedUrls = allowedUrls.concat(externalAssets);
			if (process.env.AKASHIC_SERVE_ALLOW_ORIGIN) {
				if (process.env.AKASHIC_SERVE_ALLOW_ORIGIN === "null") return null;
				allowedUrls.push(process.env.AKASHIC_SERVE_ALLOW_ORIGIN);
			}
		}
		return allowedUrls;
	}
}
