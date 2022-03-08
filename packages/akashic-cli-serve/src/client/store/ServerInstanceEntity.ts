import {observable} from "mobx";
import { apiClient } from "../api/apiClientInstance";
import type {GameInstanceEntity} from "./GameInstanceEntity";
import type {PlayEntity} from "./PlayEntity";

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
		await apiClient.deleteRunner(this.runnerId);
	}

	async pause(): Promise<void> {
		await apiClient.pauseRunner(this.runnerId);
	}

	async resume(): Promise<void> {
		await apiClient.resumeRunner(this.runnerId);
	}

	async step(): Promise<void> {
		await apiClient.stepRunner(this.runnerId);
	}
}
