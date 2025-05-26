import { createRequire } from "module";
import * as path from "path";
import type { AMFlowClient, RunnerManager, RunnerV1, RunnerV2, RunnerV3 } from "@akashic/headless-driver";
import { Trigger } from "@akashic/trigger";
import type { NamagameCommentEventComment } from "../../common/types/NamagameCommentPlugin.js";
import type {
	RunnerCreateTestbedEvent,
	RunnerRemoveTestbedEvent,
	RunnerPauseTestbedEvent,
	RunnerResumeTestbedEvent,
	RunnerPutStartPointTestbedEvent,
	NamagameCommentPluginStartStopTestbedEvent
} from "../../common/types/TestbedEvent.js";
import { serverGlobalConfig } from "../common/ServerGlobalConfig.js";
import * as gameConfigs from "./GameConfigs.js";
import { NamagameCommentPluginHost } from "./nicoliveComment/NamagameCommentPluginHost.js";
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

/**
 * ランナー関連情報。headless-driver の Runner で管理できないデータを保持する。
 */
export interface RunnerEntity {
	playId: string;
	namagameCommentPluginHost: NamagameCommentPluginHost | null;
}

export class RunnerStore {
	onRunnerCreate: Trigger<RunnerCreateTestbedEvent>;
	onRunnerRemove: Trigger<RunnerRemoveTestbedEvent>;
	onRunnerPause: Trigger<RunnerPauseTestbedEvent>;
	onRunnerResume: Trigger<RunnerResumeTestbedEvent>;
	onRunnerPutStartPoint: Trigger<RunnerPutStartPointTestbedEvent>;
	onNamagameCommentPluginStartStop: Trigger<NamagameCommentPluginStartStopTestbedEvent>;
	private runnerManager: RunnerManager;
	private gameExternalFactory: () => any;
	private runnerEntities: { [runnerId: string]: RunnerEntity };

	constructor(params: RunnerStoreParameterObject) {
		this.onRunnerCreate = new Trigger();
		this.onRunnerRemove = new Trigger();
		this.onRunnerPause = new Trigger();
		this.onRunnerResume = new Trigger();
		this.onRunnerPutStartPoint = new Trigger();
		this.onNamagameCommentPluginStartStop = new Trigger();
		this.runnerManager = params.runnerManager;
		this.gameExternalFactory = params.gameExternalFactory;
		this.runnerEntities = {};
	}

	async createAndStartRunner(params: CreateAndStartRunnerParameterObject): Promise<RunnerV1 | RunnerV2 | RunnerV3> {
		const sandboxConfig = sandboxConfigs.get(params.contentId);
		const gameConfig = gameConfigs.get(params.contentId);
		const externalAssets = (sandboxConfig ? sandboxConfig.externalAssets : undefined) === undefined ? [] : sandboxConfig.externalAssets;
		const allowedUrls = this.createAllowedUrls(params.contentId, externalAssets);

		let externalValue: { [name: string]: unknown } = {};
		let namagameCommentPluginHost: NamagameCommentPluginHost | null = null;
		if (gameConfig.environment?.external?.namagameComment) {
			const { playId } = params;
			namagameCommentPluginHost = new NamagameCommentPluginHost(sandboxConfig.external?.namagameComment ?? {}, params.amflow);
			namagameCommentPluginHost.onStartStop.add(started => this.onNamagameCommentPluginStartStop.fire({ playId, started }));
			externalValue.namagameComment = namagameCommentPluginHost.plugin;
		}

		externalValue = { ...externalValue, ...this.gameExternalFactory() };
		const serverExternal = sandboxConfig?.server?.external;
		if (serverExternal) {
			for (const pluginName of Object.keys(serverExternal)) {
				// eslint-disable-next-line @typescript-eslint/no-var-requires
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
		this.runnerEntities[runnerId] = {
			playId: params.playId,
			namagameCommentPluginHost,
		};
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
		const playId = this.runnerEntities[runnerId]!.playId;
		this.onRunnerRemove.fire({ playId, runnerId });
		delete this.runnerEntities[runnerId];
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

	sendCommentsByTemplate(runnerId: string, name: string): boolean {
		const commentPluginHost = this.runnerEntities[runnerId]?.namagameCommentPluginHost;
		return commentPluginHost?.planToSendByTemplate(name) ?? false;
	}

	sendComment(runnerId: string, comment: NamagameCommentEventComment): boolean {
		const commentPluginHost = this.runnerEntities[runnerId]?.namagameCommentPluginHost;
		return commentPluginHost?.planToSend(comment) ?? false;
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
