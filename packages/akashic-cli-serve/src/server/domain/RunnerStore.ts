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

export class RunnerStore {
	onRunnerCreate: Trigger<RunnerCreateTestbedEvent>;
	onRunnerRemove: Trigger<RunnerRemoveTestbedEvent>;
	onRunnerPause: Trigger<RunnerPauseTestbedEvent>;
	onRunnerResume: Trigger<RunnerResumeTestbedEvent>;
	private runnerManager: RunnerManager;

	constructor(params: RunnerStoreParameterObject) {
		this.onRunnerCreate = new Trigger<RunnerCreateTestbedEvent>();
		this.onRunnerRemove = new Trigger<RunnerRemoveTestbedEvent>();
		this.onRunnerPause = new Trigger<RunnerPauseTestbedEvent>();
		this.onRunnerResume = new Trigger<RunnerResumeTestbedEvent>();
		this.runnerManager = params.runnerManager;
	}

	async createAndStartRunner(playId: string, isActive: boolean, token: string, amflow: AMFlowClient): Promise<RunnerV1 | RunnerV2> {
		const runnerId = await this.runnerManager.createRunner({
			playId,
			amflow,
			executionMode: isActive ? "active" : "passive",
			playToken: token
		});
		const runner = this.runnerManager.getRunner(runnerId);
		await this.runnerManager.startRunner(runner.runnerId);
		this.onRunnerCreate.fire({ playId, runnerId, isActive });
		return runner;
	}

	async stopRunner(runnerId: string): Promise<void> {
		const playId = this.runnerManager.getRunner(runnerId).playId;
		await this.runnerManager.stopRunner(runnerId);
		this.onRunnerRemove.fire({ playId, runnerId });
	}

	pauseRunner(runnerId: string): void {
		const runner = this.runnerManager.getRunner(runnerId);
		const playId = runner.playId;
		// TODO headless-driver に pause()/resume() を作る
		(runner as any).driver.stopGame();
		this.onRunnerPause.fire({ playId, runnerId });
	}

	resumeRunner(runnerId: string): void {
		const runner = this.runnerManager.getRunner(runnerId);
		const playId = runner.playId;
		(runner as any).driver.startGame();
		this.onRunnerResume.fire({ playId, runnerId });
	}
}
