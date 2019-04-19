import {observable} from "mobx";
import * as ApiClient from "../api/ApiClient";
import {PlayEntity} from "./PlayEntity";
import {GameInstanceEntity} from "./GameInstanceEntity";

export interface ServerInstanceEntityParameterObject {
	runnerId: string;
	play: PlayEntity;
	passedArgument: string;
}

export class ServerInstanceEntity implements GameInstanceEntity {
	@observable readonly runnerId: string;
	@observable readonly play: PlayEntity;
	@observable readonly passedArgument: string;

	constructor(param: ServerInstanceEntityParameterObject) {
		this.runnerId = param.runnerId;
		this.play = param.play;
		this.passedArgument = param.passedArgument;
	}

	async stop(): Promise<void> {
		await ApiClient.deleteRunner(this.runnerId);
	}

	async pause(): Promise<void> {
		await ApiClient.pauseRunner(this.runnerId);
	}

	async resume(): Promise<void> {
		await ApiClient.resumeRunner(this.runnerId);
	}
}
