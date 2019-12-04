import { Trigger } from "@akashic/trigger";
import { AMFlowClient, RunnerManager, RunnerV1, RunnerV2 } from "@akashic/headless-driver";
import {
	RunnerCreateTestbedEvent,
	RunnerRemoveTestbedEvent,
	RunnerPauseTestbedEvent,
	RunnerResumeTestbedEvent
} from "../../common/types/TestbedEvent";

export interface RunnerStoreParameterObject {
	runnerManager: RunnerManager;
}

export interface CreateAndStartRunnerParameterObject {
	playId: string;
	isActive: boolean;
	token: string;
	amflow: AMFlowClient;
	allowedUrls: (string | RegExp)[] | null;
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

	async createAndStartRunner(params: CreateAndStartRunnerParameterObject): Promise<RunnerV1 | RunnerV2> {
		const runnerId = await this.runnerManager.createRunner({
			playId: params.playId,
			amflow: params.amflow,
			executionMode: params.isActive ? "active" : "passive",
			playToken: params.token,
			allowedUrls: params.allowedUrls
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
}
