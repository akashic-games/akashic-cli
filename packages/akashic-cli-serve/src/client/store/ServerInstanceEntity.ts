import {observable} from "mobx";
import * as ApiClient from "../api/ApiClient";
import {PlayEntity} from "./PlayEntity";
import {GameInstanceEntity} from "./GameInstanceEntity";

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
		await ApiClient.deleteRunner(this.runnerId);
	}

	async pause(): Promise<void> {
		await ApiClient.pauseRunner(this.runnerId);
	}

	async resume(): Promise<void> {
		await ApiClient.resumeRunner(this.runnerId);
	}
}
