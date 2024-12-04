import type { GameConfiguration } from "@akashic/game-configuration";
import type {
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
	StartPointHeaderListResponse,
	PlaySendNicoliveCommentResponse
} from "../../common/types/ApiResponse";
import type { ContentLocatorData } from "../../common/types/ContentLocatorData";
import type { NicoliveComment } from "../../common/types/NicoliveCommentPlugin";
import type { PlayAudioState } from "../../common/types/PlayAudioState";
import type { Player } from "../../common/types/Player";
import * as ApiRequest from "./ApiRequest";

export class ApiClient {
	private _baseUrl: string;

	constructor(baseUrl?: string) {
		this._baseUrl = baseUrl ?? "";
	}

	async getPlays(): Promise<PlayGetAllApiResponse> {
		return ApiRequest.get<PlayGetAllApiResponse>(`${this._baseUrl}/api/plays`);
	};

	async createPlay(
		contentLocator: ContentLocatorData,
		initialJoinPlayer?: Player,
		inheritsJoinedFromLatest: boolean = false,
		inheritsAudioFromLatest: boolean = false
	): Promise<PlayPostApiResponse> {
		return ApiRequest.post<PlayPostApiResponse>(`${this._baseUrl}/api/plays`, {
			contentLocator,
			initialJoinPlayerId: initialJoinPlayer?.id,
			initialJoinPlayerName: initialJoinPlayer?.name,
			inheritsJoinedFromLatest,
			inheritsAudioFromLatest
		});
	};

	async suspendPlay(playId: string): Promise<PlayDeleteApiResponse> {
		return ApiRequest.del<PlayDeleteApiResponse>(`${this._baseUrl}/api/plays/${playId}`);
	};

	async pausePlayDuration(playId: string): Promise<PlayPatchApiResponse> {
		return ApiRequest.patch<PlayPatchApiResponse>(`${this._baseUrl}/api/plays/${playId}`, {status: "paused"});
	};

	async resumePlayDuration(playId: string): Promise<PlayPatchApiResponse> {
		return ApiRequest.patch<PlayPatchApiResponse>(`${this._baseUrl}/api/plays/${playId}`, {status: "running"});
	};

	async stepPlayDuration(playId: string): Promise<PlayPatchApiResponse> {
		return ApiRequest.patch<PlayPatchApiResponse>(
			`${this._baseUrl}/api/plays/${playId}`,
			{status: "paused", step: true}
		);
	};

	async changePlayAudioState(playId: string, audioState: PlayAudioState): Promise<void> {
		return ApiRequest.patch<void>(`${this._baseUrl}/api/plays/${playId}/audio`, { audioState });
	};

	async createPlayToken(
		playId: string,
		playerId: string,
		isActive: boolean,
		name?: string,
		envInfo?: any
	): Promise<PlayTokenPostApiResponse> {
		return ApiRequest.post<PlayTokenPostApiResponse>(
			`${this._baseUrl}/api/plays/${playId}/token`,
			{playerId, isActive: isActive.toString(), name, envInfo}
		);
	};

	async broadcast(playId: string, message: any): Promise<void> {
		return ApiRequest.post<void>(`${this._baseUrl}/api/plays/${playId}/broadcast`, message);
	};

	async registerPlayerId(playerId?: string): Promise<PlayerPostApiResponse> {
		return ApiRequest.post<PlayerPostApiResponse>(
			`${this._baseUrl}/api/playerids`,
			{ playerId }
		);
	};

	async createRunner(playId: string, isActive: boolean, token: string, isPaused: boolean = false): Promise<RunnerPostApiResponse> {
		return ApiRequest.post<RunnerPostApiResponse>(
			`${this._baseUrl}/api/runners`,
			{playId, isActive: isActive.toString(), token, isPaused: isPaused.toString() }
		);
	};

	async deleteRunner(runnerId: string): Promise<RunnerDeleteApiResponse> {
		return ApiRequest.del<RunnerDeleteApiResponse>(`${this._baseUrl}/api/runners/${runnerId}`);
	};

	async pauseRunner(runnerId: string): Promise<RunnerPatchApiResponse> {
		return ApiRequest.patch<RunnerPatchApiResponse>(
			`${this._baseUrl}/api/runners/${runnerId}`,
			{status: "paused"}
		);
	};

	async resumeRunner(runnerId: string): Promise<RunnerPatchApiResponse> {
		return ApiRequest.patch<RunnerPatchApiResponse>(
			`${this._baseUrl}/api/runners/${runnerId}`,
			{status: "running"}
		);
	};

	async stepRunner(runnerId: string): Promise<RunnerPatchApiResponse> {
		return ApiRequest.patch<RunnerPatchApiResponse>(
			`${this._baseUrl}/api/runners/${runnerId}`,
			{status: "paused", step: true}
		);
	};

	async requestToSendNicoliveCommentByTemplate(playId: string, templateName: string): Promise<PlaySendNicoliveCommentResponse> {
		return ApiRequest.post<PlaySendNicoliveCommentResponse>(
			`${this._baseUrl}/api/plays/${playId}/comment-template`,
			{name: templateName}
		);
	};

	async requestToSendNicoliveComment(playId: string, comment: NicoliveComment): Promise<PlaySendNicoliveCommentResponse> {
		return ApiRequest.post<PlaySendNicoliveCommentResponse>(
			`${this._baseUrl}/api/plays/${playId}/comment`,
			{ ...comment, isAnonymous: comment.isAnonymous?.toString(), isOperatorComment: comment.isOperatorComment?.toString() }
		);
	};

	async getContents (): Promise<ContentGetAllApiResponse> {
		return ApiRequest.get<ContentGetAllApiResponse>(`${this._baseUrl}/contents/`);
	};

	async getContent (contentId: string): Promise<ContentGetApiResponse> {
		return ApiRequest.get<ContentGetApiResponse>(`${this._baseUrl}/contents/${contentId}`);
	};

	async getGameConfiguration(contentId: number): Promise<GameConfiguration> {
		return ApiRequest.get<GameConfiguration>(`${this._baseUrl}/contents/${contentId}/content/game.json`);
	};

	// TODO 使わないなら削除。コンテンツ更新時の再取得に利用するなら残す
	async getSandboxConfig(contentId: number): Promise<SandboxConfigApiResponse> {
		return ApiRequest.get<SandboxConfigApiResponse>(`${this._baseUrl}/contents/${contentId}/sandbox-config`);
	};

	async getOptions(): Promise<OptionsApiResponse> {
		return ApiRequest.get<OptionsApiResponse>(`${this._baseUrl}/api/options`);
	};

	async getStartPointHeaderList(playId: string): Promise<StartPointHeaderListResponse> {
		return ApiRequest.get<StartPointHeaderListResponse>(`${this._baseUrl}/api/plays/${playId}/start-point-header-list`);
	};
}
