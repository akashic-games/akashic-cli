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

export type ContentsGetApiResponseData = ContentDesc[];

export interface SandboxConfigApiResponseData extends SandboxConfig {
}

// <<<<<<< add_target_service_option
// export interface OptionsApiResponseData {
// 	autoStart: boolean;
// 	verbose: boolean;
// 	targetService: boolean;
// }
// =======
export type OptionsApiResponseData = AppOptions;
// >>>>>>> master

export type PlayGetAllApiResponse = ApiResponse<PlayApiResponseData[]>;
export type PlayPostApiResponse = ApiResponse<PlayApiResponseData>;
export type PlayDeleteApiResponse = ApiResponse<PlayDeleteApiResponseData>;
export type PlayPatchApiResponse = ApiResponse<PlayPatchApiResponseData>;
export type PlayTokenPostApiResponse = ApiResponse<PlayTokenPostApiResponseData>;
export type RunnerPostApiResponse = ApiResponse<RunnerPostApiResponseData>;
export type RunnerDeleteApiResponse = ApiResponse<RunnerDeleteApiResponseData>;
export type RunnerPatchApiResponse = ApiResponse<RunnerPatchApiResponseData>;
export type ContentsGetApiResponse = ApiResponse<ContentsGetApiResponseData>;
export type SandboxConfigApiResponse = ApiResponse<SandboxConfigApiResponseData>;
export type OptionsApiResponse = ApiResponse<OptionsApiResponseData>;
