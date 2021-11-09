import {
	PlayDeleteApiResponse,
	PlayGetAllApiResponse,
	PlayPostApiResponse,
	PlayPatchApiResponse,
	PlayTokenPostApiResponse,
	RunnerDeleteApiResponse,
	RunnerPostApiResponse,
	RunnerPatchApiResponse,
	ContentGetAllApiResponse,
	ContentGetApiResponse,
	SandboxConfigApiResponse,
	OptionsApiResponse,
	PlayerPostApiResponse,
	StartPointHeaderListResponse
} from "../../common/types/ApiResponse";
import {ContentLocatorData} from "../../common/types/ContentLocatorData";
import {GameConfiguration} from "../../common/types/GameConfiguration";
import { PlayAudioState } from "../../common/types/PlayAudioState";
import * as ApiRequest from "./ApiRequest";

export class ApiClient {
	private _baseUrl: string;
	private _headers: {[key: string]: string};

	constructor(baseUrl?: string, headers?: {[key: string]: string}) {
		this._baseUrl = baseUrl ?? "";
		this._headers = headers ?? undefined;
	}

	async getPlays(): Promise<PlayGetAllApiResponse> {
		return await ApiRequest.get<PlayGetAllApiResponse>(`${this._baseUrl}/api/plays`, this._headers);
	};
	
	async createPlay(contentLocator: ContentLocatorData, audioState?: PlayAudioState): Promise<PlayPostApiResponse> {
		return await ApiRequest.post<PlayPostApiResponse>(`${this._baseUrl}/api/plays`, { contentLocator, audioState }, this._headers);
	};
	
	async suspendPlay(playId: string): Promise<PlayDeleteApiResponse> {
		return await ApiRequest.del<PlayDeleteApiResponse>(`${this._baseUrl}/api/plays/${playId}`, this._headers);
	};
	
	async pausePlayDuration(playId: string): Promise<PlayPatchApiResponse> {
		return await ApiRequest.patch<PlayPatchApiResponse>(`${this._baseUrl}/api/plays/${playId}`, {status: "paused"}, this._headers);
	};
	
	async resumePlayDuration(playId: string): Promise<PlayPatchApiResponse> {
		return await ApiRequest.patch<PlayPatchApiResponse>(`${this._baseUrl}/api/plays/${playId}`, {status: "running"}, this._headers);
	};
	
	async stepPlayDuration(playId: string): Promise<PlayPatchApiResponse> {
		return await ApiRequest.patch<PlayPatchApiResponse>(
			`${this._baseUrl}/api/plays/${playId}`,
			{status: "paused", step: true},
			this._headers
		);
	};
	
	async changePlayAudioState(playId: string, audioState: PlayAudioState): Promise<void> {
		return await ApiRequest.patch<void>(`${this._baseUrl}/api/plays/${playId}/audio`, { audioState }, this._headers);
	};
	
	async createPlayToken(
		playId: string,
		playerId: string,
		isActive: boolean,
		name?: string,
		envInfo?: any
	): Promise<PlayTokenPostApiResponse> {
		return await ApiRequest.post<PlayTokenPostApiResponse>(
			`${this._baseUrl}/api/plays/${playId}/token`,
			{playerId, isActive: isActive.toString(), name, envInfo},
			this._headers
		);
	};
	
	async broadcast(playId: string, message: any): Promise<void> {
		return await ApiRequest.post<void>(`${this._baseUrl}/api/plays/${playId}/broadcast`, message, this._headers);
	};
	
	async registerPlayerId(playerId?: string): Promise<PlayerPostApiResponse> {
		return await ApiRequest.post<PlayerPostApiResponse>(
			`${this._baseUrl}/api/playerids`,
			{ playerId },
			this._headers
		);
	};
	
	async createRunner(playId: string, isActive: boolean, token: string): Promise<RunnerPostApiResponse> {
		return await ApiRequest.post<RunnerPostApiResponse>(
			`${this._baseUrl}/api/runners`,
			{playId, isActive: isActive.toString(), token},
			this._headers
		);
	};
	
	async deleteRunner(runnerId: string): Promise<RunnerDeleteApiResponse> {
		return await ApiRequest.del<RunnerDeleteApiResponse>(`${this._baseUrl}/api/runners/${runnerId}`, this._headers);
	};
	
	async pauseRunner(runnerId: string): Promise<RunnerPatchApiResponse> {
		return await ApiRequest.patch<RunnerPatchApiResponse>(
			`${this._baseUrl}/api/runners/${runnerId}`,
			{status: "paused"},
			this._headers
		);
	};
	
	async resumeRunner(runnerId: string): Promise<RunnerPatchApiResponse> {
		return await ApiRequest.patch<RunnerPatchApiResponse>(
			`${this._baseUrl}/api/runners/${runnerId}`,
			{status: "running"},
			this._headers
		);
	};
	
	async stepRunner(runnerId: string): Promise<RunnerPatchApiResponse> {
		return await ApiRequest.patch<RunnerPatchApiResponse>(
			`${this._baseUrl}/api/runners/${runnerId}`,
			{status: "paused", step: true},
			this._headers
		);
	};
	
	async getContents (): Promise<ContentGetAllApiResponse> {
		return await ApiRequest.get<ContentGetAllApiResponse>(`${this._baseUrl}/contents/`, this._headers);
	};
	
	async getContent (contentId: string): Promise<ContentGetApiResponse> {
		return await ApiRequest.get<ContentGetApiResponse>(`${this._baseUrl}/contents/${contentId}`, this._headers);
	};
	
	async getGameConfiguration(contentId: number): Promise<GameConfiguration> {
		return await ApiRequest.get<GameConfiguration>(`${this._baseUrl}/contents/${contentId}/content/game.json`, this._headers);
	};
	
	// TODO 使わないなら削除。コンテンツ更新時の再取得に利用するなら残す
	async getSandboxConfig(contentId: number): Promise<SandboxConfigApiResponse> {
		return await ApiRequest.get<SandboxConfigApiResponse>(`${this._baseUrl}/contents/${contentId}/sandbox-config`, this._headers);
	};
	
	async getOptions(): Promise<OptionsApiResponse> {
		return await ApiRequest.get<OptionsApiResponse>(`${this._baseUrl}/api/options`, this._headers);
	};
	
	async getStartPointHeaderList(playId: string): Promise<StartPointHeaderListResponse> {
		return await ApiRequest.get<StartPointHeaderListResponse>(
			`${this._baseUrl}/api/plays/${playId}/start-point-header-list`,
			this._headers
		);
	};
}

export const apiClientLocalHost = new ApiClient();
