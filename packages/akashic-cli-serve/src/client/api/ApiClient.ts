import {
	PlayDeleteApiResponse,
	PlayGetAllApiResponse,
	PlayPostApiResponse,
	PlayPatchApiResponse,
	PlayTokenPostApiResponse,
	RunnerDeleteApiResponse,
	RunnerPostApiResponse,
	RunnerPatchApiResponse,
	SandboxConfigApiResponse,
	OptionsApiResponse
} from "../../common/types/ApiResponse";
import {GameConfiguration} from "../../common/types/GameConfiguration";
import * as ApiRequest from "./ApiRequest";

export const getPlays = async(): Promise<PlayGetAllApiResponse> => {
	return await ApiRequest.get<PlayGetAllApiResponse>("/api/plays");
};

export const createPlay = async(contentUrl: string, clientContentUrl?: string): Promise<PlayPostApiResponse> => {
	return await ApiRequest.post<PlayPostApiResponse>("/api/plays", {contentUrl, clientContentUrl});
};

export const suspendPlay = async(playId: string): Promise<PlayDeleteApiResponse> => {
	return await ApiRequest.del<PlayDeleteApiResponse>(`/api/plays/${playId}`);
};

export const pausePlayDuration = async(playId: string): Promise<PlayPatchApiResponse> => {
	return await ApiRequest.patch<PlayPatchApiResponse>(`/api/plays/${playId}`, {status: "paused"});
};

export const resumePlayDuration = async(playId: string): Promise<PlayPatchApiResponse> => {
	return await ApiRequest.patch<PlayPatchApiResponse>(`/api/plays/${playId}`, {status: "running"});
};

export const createPlayToken = async(
	playId: string,
	playerId: string,
	isActive: boolean,
	name?: string,
	envInfo?: any
): Promise<PlayTokenPostApiResponse> => {
	return await ApiRequest.post<PlayTokenPostApiResponse>(
		`/api/plays/${playId}/token`,
		{playerId, isActive: isActive.toString(), name, envInfo}
	);
};

export const broadcast = async(playId: string, message: any): Promise<void> => {
	return await ApiRequest.post<void>(`/api/plays/${playId}/broadcast`, message);
};

export const createRunner = async(playId: string, isActive: boolean, token: string): Promise<RunnerPostApiResponse> => {
	return await ApiRequest.post<RunnerPostApiResponse>(
		"/api/runners",
		{playId, isActive: isActive.toString(), token}
	);
};

export const deleteRunner = async(runnerId: string): Promise<RunnerDeleteApiResponse> => {
	return await ApiRequest.del<RunnerDeleteApiResponse>(`/api/runners/${runnerId}`);
};

export const pauseRunner = async(runnerId: string): Promise<RunnerPatchApiResponse> => {
	return await ApiRequest.patch<RunnerPatchApiResponse>(`/api/runners/${runnerId}`, {status: "paused"});
};

export const resumeRunner = async(runnerId: string): Promise<RunnerPatchApiResponse> => {
	return await ApiRequest.patch<RunnerPatchApiResponse>(`/api/runners/${runnerId}`, {status: "running"});
};

export const getGameConfiguration = async(contentId: number): Promise<GameConfiguration> => {
	return await ApiRequest.get<GameConfiguration>(`/content/${contentId}/game.json`);
};

export const getSandboxConfig = async(contentId: number): Promise<SandboxConfigApiResponse> => {
	return await ApiRequest.get<SandboxConfigApiResponse>(`/api/${contentId}/sandbox-config`);
};

export const getOptions = async(): Promise<OptionsApiResponse> => {
	return await ApiRequest.get<OptionsApiResponse>("/config/options");
};
