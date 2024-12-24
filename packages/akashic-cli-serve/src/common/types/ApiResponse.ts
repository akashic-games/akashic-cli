import type * as amf from "@akashic/amflow";
import type { NormalizedSandboxConfiguration } from "@akashic/sandbox-configuration";
import type { AppOptions } from "./AppOptions";
import type { ContentDesc } from "./ContentDesc";
import type { PlayInfo } from "./PlayInfo";
import type { StartPointHeader } from "./StartPointHeader";

export interface ApiResponse<T> {
	meta: {
		status: number;
		errorCode?: string;
		errorMessage?: string;
	};
	data: T;
}

export interface PlayApiResponseData extends PlayInfo {
	// nothing
}

export interface PlayDeleteApiResponseData {
	playId: string;
}

export interface PlayPatchApiResponseData {
	playId: string;
	status: "running" | "paused";
	step?: boolean;
}

export interface PlayTokenPostApiResponseData {
	playId: string;
	playToken: string;
}

export interface PlayerIdPostApiResponseData {
	playerId: string;
	isDuplicated: boolean;
	hashedPlayerId: string;
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
	status: "running" | "paused" | "step";
	step?: boolean;
}

export type ContentGetApiResponseData = ContentDesc;

export interface SandboxConfigApiResponseData extends NormalizedSandboxConfiguration {
}

export type OptionsApiResponseData = AppOptions;

export type StartPointHeaderListResponseData = {
	startPointHeaderList: StartPointHeader[];
};

export type StartPointResponseData = {
	startPoint: amf.StartPoint;
};

export type PlayGetAllApiResponse = ApiResponse<PlayApiResponseData[]>;
export type PlayPostApiResponse = ApiResponse<PlayApiResponseData>;
export type PlayDeleteApiResponse = ApiResponse<PlayDeleteApiResponseData>;
export type PlayPatchApiResponse = ApiResponse<PlayPatchApiResponseData>;
export type PlayTokenPostApiResponse = ApiResponse<PlayTokenPostApiResponseData>;
export type PlayerPostApiResponse = ApiResponse<PlayerIdPostApiResponseData>;
export type PlaySendNicoliveCommentResponse = ApiResponse<void>;
export type RunnerPostApiResponse = ApiResponse<RunnerPostApiResponseData>;
export type RunnerDeleteApiResponse = ApiResponse<RunnerDeleteApiResponseData>;
export type RunnerPatchApiResponse = ApiResponse<RunnerPatchApiResponseData>;
export type ContentGetAllApiResponse = ApiResponse<ContentGetApiResponseData[]>;
export type ContentGetApiResponse = ApiResponse<ContentGetApiResponseData>;
export type SandboxConfigApiResponse = ApiResponse<SandboxConfigApiResponseData>;
export type OptionsApiResponse = ApiResponse<OptionsApiResponseData>;
export type StartPointHeaderListResponse = ApiResponse<StartPointHeaderListResponseData>;
