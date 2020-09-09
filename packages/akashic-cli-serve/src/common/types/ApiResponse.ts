import {PlayDurationState} from "./PlayDurationState";
import {SandboxConfig} from "./SandboxConfig";
import {ClientInstanceDescription, RunnerDescription} from "./TestbedEvent";
import {Player} from "./Player";
import {ContentLocatorData} from "./ContentLocatorData";
import {ContentDesc} from "./ContentDesc";
import {AppOptions} from "./AppOptions";

export interface ApiResponse<T> {
	meta: {
		status: number;
		errorCode?: string;
		errorMessage?: string;
	};
	data: T;
}

export interface PlayApiResponseData {
	playId: string;
	contentLocatorData: ContentLocatorData;
	joinedPlayers: Player[];
	runners: RunnerDescription[];
	clientInstances: ClientInstanceDescription[];
	durationState: PlayDurationState;
}

export interface PlayDeleteApiResponseData {
	playId: string;
}

export interface PlayPatchApiResponseData {
	playId: string;
	status: "running" | "paused";
}

export interface PlayTokenPostApiResponseData {
	playId: string;
	playToken: string;
}

export interface PlayerPostApiResponseData {
	player: Player;
	isDuplicationId: boolean;
}

export interface RunnerPostApiResponseData {
	playId: string;
	runnerId: string;
}

export interface RunnerDeleteApiResponseData {
	runnerId: string;
}

export interface RunnerPatchApiResponseData {
	runnerId: string;
	status: "running" | "paused";
}

export type ContentGetApiResponseData = ContentDesc;

export interface SandboxConfigApiResponseData extends SandboxConfig {
}

export type OptionsApiResponseData = AppOptions;

export type PlayGetAllApiResponse = ApiResponse<PlayApiResponseData[]>;
export type PlayPostApiResponse = ApiResponse<PlayApiResponseData>;
export type PlayDeleteApiResponse = ApiResponse<PlayDeleteApiResponseData>;
export type PlayPatchApiResponse = ApiResponse<PlayPatchApiResponseData>;
export type PlayTokenPostApiResponse = ApiResponse<PlayTokenPostApiResponseData>;
export type PlayerPostApiResponse = ApiResponse<PlayerPostApiResponseData>;
export type RunnerPostApiResponse = ApiResponse<RunnerPostApiResponseData>;
export type RunnerDeleteApiResponse = ApiResponse<RunnerDeleteApiResponseData>;
export type RunnerPatchApiResponse = ApiResponse<RunnerPatchApiResponseData>;
export type ContentGetAllApiResponse = ApiResponse<ContentGetApiResponseData[]>;
export type ContentGetApiResponse = ApiResponse<ContentGetApiResponseData>;
export type SandboxConfigApiResponse = ApiResponse<SandboxConfigApiResponseData>;
export type OptionsApiResponse = ApiResponse<OptionsApiResponseData>;
