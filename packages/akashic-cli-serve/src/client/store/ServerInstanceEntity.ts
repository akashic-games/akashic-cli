import {observable} from "mobx";
import { apiClientLocalHost } from "../api/ApiClient";
import {GameInstanceEntity} from "./GameInstanceEntity";
import {PlayEntity} from "./PlayEntity";

export interface ServerInstanceEntityParameterObject {
	runnerId: string;
	play: PlayEntity;
}

export class ServerInstanceEntity implements GameInstanceEntity {
	@observable runnerId: string;
	@observable play: PlayEntity;

	constructor(param: ServerInstanceEntityParameterObject) {
		this.runnerId = param.runnerId;
		this.play = param.play;
	}

	async stop(): Promise<void> {
		await apiClientLocalHost.deleteRunner(this.runnerId);
	}

	async pause(): Promise<void> {
		await apiClientLocalHost.pauseRunner(this.runnerId);
	}

	async resume(): Promise<void> {
		await apiClientLocalHost.resumeRunner(this.runnerId);
	}

	async step(): Promise<void> {
		await apiClientLocalHost.stepRunner(this.runnerId);
	}
}
