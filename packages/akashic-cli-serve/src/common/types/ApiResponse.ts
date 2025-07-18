import type * as amf from "@akashic/amflow";
import type { NormalizedSandboxConfiguration } from "@akashic/sandbox-configuration";
import type { AppOptions } from "./AppOptions.js";
import type { ContentDesc } from "./ContentDesc.js";
import type { PlayInfo } from "./PlayInfo.js";
import type { StartPointHeader } from "./StartPointHeader.js";

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
export type PlaySendNamagameCommentResponse = ApiResponse<void>;
export type RunnerPostApiResponse = ApiResponse<RunnerPostApiResponseData>;
export type RunnerDeleteApiResponse = ApiResponse<RunnerDeleteApiResponseData>;
export type RunnerPatchApiResponse = ApiResponse<RunnerPatchApiResponseData>;
export type ContentGetAllApiResponse = ApiResponse<ContentGetApiResponseData[]>;
export type ContentGetApiResponse = ApiResponse<ContentGetApiResponseData>;
export type SandboxConfigApiResponse = ApiResponse<SandboxConfigApiResponseData>;
export type OptionsApiResponse = ApiResponse<OptionsApiResponseData>;
export type StartPointHeaderListResponse = ApiResponse<StartPointHeaderListResponseData>;
