import { Trigger } from "@akashic/trigger";
import { AMFlowClient, RunnerManager, RunnerV1, RunnerV2, RunnerV3 } from "@akashic/headless-driver";
import {
	RunnerCreateTestbedEvent,
	RunnerRemoveTestbedEvent,
	RunnerPauseTestbedEvent,
	RunnerResumeTestbedEvent
} from "../../common/types/TestbedEvent";
import { loadSandboxConfigJs } from "./SandboxConfigs";
import { serverGlobalConfig } from "../common/ServerGlobalConfig";

export interface RunnerStoreParameterObject {
	runnerManager: RunnerManager;
}

export interface CreateAndStartRunnerParameterObject {
	playId: string;
	isActive: boolean;
	token: string;
	amflow: AMFlowClient;
	targetDirs: string[];
	contentId: string;
}

export class RunnerStore {
	onRunnerCreate: Trigger<RunnerCreateTestbedEvent>;
	onRunnerRemove: Trigger<RunnerRemoveTestbedEvent>;
	onRunnerPause: Trigger<RunnerPauseTestbedEvent>;
	onRunnerResume: Trigger<RunnerResumeTestbedEvent>;
	private runnerManager: RunnerManager;
	private playIdTable: { [runnerId: string]: string };

	constructor(params: RunnerStoreParameterObject) {
		this.onRunnerCreate = new Trigger<RunnerCreateTestbedEvent>();
		this.onRunnerRemove = new Trigger<RunnerRemoveTestbedEvent>();
		this.onRunnerPause = new Trigger<RunnerPauseTestbedEvent>();
		this.onRunnerResume = new Trigger<RunnerResumeTestbedEvent>();
		this.runnerManager = params.runnerManager;
		this.playIdTable = {};
	}

	async createAndStartRunner(params: CreateAndStartRunnerParameterObject): Promise<RunnerV1 | RunnerV2 | RunnerV3> {
		// TODO: allowedUrls を作成するための sandbox.config.js の load や引数の targetDirs 等は SandboxConfig の反映タイミング修正で不要となる可能性がある。
		// TODO: targetDirsを渡さなくても、contentIdから解決できるようにする。
		const sandboxConfigDir = params.targetDirs[parseInt(params.contentId, 10)];
		const sandboxConfig = loadSandboxConfigJs(sandboxConfigDir);
		const externalAssets = (sandboxConfig ? sandboxConfig.externalAssets : undefined) === undefined ? [] : sandboxConfig.externalAssets;
		const allowedUrls = this.createAllowedUrls(params.contentId, externalAssets);

		const runnerId = await this.runnerManager.createRunner({
			playId: params.playId,
			amflow: params.amflow,
			executionMode: params.isActive ? "active" : "passive",
			playToken: params.token,
			allowedUrls
		});
		const runner = this.runnerManager.getRunner(runnerId);
		await this.runnerManager.startRunner(runner.runnerId);
		this.onRunnerCreate.fire({ playId: params.playId, runnerId, isActive: params.isActive });
		this.playIdTable[runnerId] = params.playId;
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

	pauseRunner(runnerId: string): void {
		const runner = this.runnerManager.getRunner(runnerId);
		if (runner) {
			// TODO headless-driver に pause()/resume() を作る
			(runner as any).driver.stopGame();
		}
		const playId = this.playIdTable[runnerId];
		this.onRunnerPause.fire({ playId, runnerId });
	}

	resumeRunner(runnerId: string): void {
		const runner = this.runnerManager.getRunner(runnerId);
		if (runner) {
			(runner as any).driver.startGame();
		}
		const playId = this.playIdTable[runnerId];
		this.onRunnerResume.fire({ playId, runnerId });
	}

	private createAllowedUrls(contentId: string, externalAssets: (string | RegExp)[] | null): (string | RegExp)[] | null {
		let allowedUrls: (string | RegExp)[] = [`http://${serverGlobalConfig.hostname}:${serverGlobalConfig.port}/contents/${contentId}/`];
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
