import { Trigger } from "@akashic/trigger";
import { AMFlowClient, RunnerManager, RunnerV1, RunnerV2, RunnerV3 } from "@akashic/headless-driver";
import {
	RunnerCreateTestbedEvent,
	RunnerRemoveTestbedEvent,
	RunnerPauseTestbedEvent,
	RunnerResumeTestbedEvent
} from "../../common/types/TestbedEvent";
import { serverGlobalConfig } from "../common/ServerGlobalConfig";
import * as sandboxConfigs from "./SandboxConfigs";

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
}

export class RunnerStore {
	onRunnerCreate: Trigger<RunnerCreateTestbedEvent>;
	onRunnerRemove: Trigger<RunnerRemoveTestbedEvent>;
	onRunnerPause: Trigger<RunnerPauseTestbedEvent>;
	onRunnerResume: Trigger<RunnerResumeTestbedEvent>;
	private runnerManager: RunnerManager;
	private gameExternalFactory: () => any;
	private playIdTable: { [runnerId: string]: string };

	constructor(params: RunnerStoreParameterObject) {
		this.onRunnerCreate = new Trigger<RunnerCreateTestbedEvent>();
		this.onRunnerRemove = new Trigger<RunnerRemoveTestbedEvent>();
		this.onRunnerPause = new Trigger<RunnerPauseTestbedEvent>();
		this.onRunnerResume = new Trigger<RunnerResumeTestbedEvent>();
		this.runnerManager = params.runnerManager;
		this.gameExternalFactory = params.gameExternalFactory;
		this.playIdTable = {};
	}

	async createAndStartRunner(params: CreateAndStartRunnerParameterObject): Promise<RunnerV1 | RunnerV2 | RunnerV3> {
		const sandboxConfig = sandboxConfigs.get(params.contentId);
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
		const startRunnerPromise = this.runnerManager.startRunner(runner.runnerId);

		// TODO headless-driver に game.external を与える機能を加え、それを利用する。
		//
		// 以下は無理やり game.external を与える暫定実装。startRunner() を await すると
		// 間に合わない (エントリポイントどころか最初のシーンの loaded すら終わってしまう) ので、
		// ここ (runner.driver が生成されている唯一のタイミング) でハンドラをかけている。
		if (runner.engineVersion === "1") {
			(runner as any).driver.gameCreatedTrigger.handle((game: any) => {
				game.external = { ...this.gameExternalFactory(), ...game.external };
				return true;
			});
		} else {
			(runner as any).driver.gameCreatedTrigger.addOnce((game: any) => {
				game.external = { ...this.gameExternalFactory(), ...game.external };
			});
		}

		const game = await startRunnerPromise;
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
