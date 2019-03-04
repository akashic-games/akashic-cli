import { Event } from "@akashic/playlog";
import {
	CoeStartSessionParameterObject, CoeExitSessionParameterObject, CoeApplicationIdentifier, CoeExternalMessage
} from "../common/interface/plugin";
import { GameViewManager } from "../akashic/GameViewManager";
import { LocalInstanceEntity } from "./LocalInstanceEntity";

export interface GameState {
	score?: number;
	playThrethold?: number;
	clearThrethold?: number;
}

export interface CreateCoeLocalInstanceParameterObject {
	local: boolean;
	playId: string;
	contentUrl?: string;
	argument?: any;
	initialEvents?: Event[];
	coeHandler?: {
		onLocalInstanceCreate: (params: CreateCoeLocalInstanceParameterObject) => Promise<LocalInstanceEntity>;
		onLocalInstanceDelete: (playId: string) => Promise<void>;
	};
}


export interface CoePluginEntityParameterObject {
	gameViewManager: GameViewManager;
	onLocalInstanceCreate: (params: CreateCoeLocalInstanceParameterObject) => Promise<LocalInstanceEntity>;
	onLocalInstanceDelete: (playId: string) => Promise<void>;
}

export class CoePluginEntity {
	private _gameViewManager: GameViewManager;
	private _localInstance: LocalInstanceEntity;
	private _coePluginMessageHandler: (parameters: CoeExternalMessage) => void;
	private _createLocalInstance: (params: CreateCoeLocalInstanceParameterObject) => Promise<LocalInstanceEntity>;
	private _deleteLocalInstance: (playId: string) => Promise<void>;

	constructor(param: CoePluginEntityParameterObject) {
		this._gameViewManager = param.gameViewManager;
		this._createLocalInstance = param.onLocalInstanceCreate;
		this._deleteLocalInstance = param.onLocalInstanceDelete;
	}

	async bootstrap(game: agv.GameLike, _gameContent: agv.GameContent): Promise<void> {
		game.external.coe = {
			startSession: this.startSession,
			exitSession: this.exitSession,
			sendLocalEvents: this.sendLocalEvents
		};
	}

	startSession = async (parameters: CoeStartSessionParameterObject): Promise<void> => {
		try {
			if (parameters && parameters.messageHandler) {
				this._coePluginMessageHandler = parameters.messageHandler;
			}

			if (parameters.application == null) {
				throw new Error("Cannot start session");
			}

			const contentUrl = this._resolveContentUrl(parameters.application, parameters.cascadeApplications);

			if (parameters.local) {
				this._startLocalSession(contentUrl, parameters);
				return;
			}

			if (typeof parameters.delayRange === "number") {
				window.setTimeout(() => {
					this._startSession(contentUrl, parameters);
				}, Math.floor(Math.random() * parameters.delayRange));
				return;
			}

			await this._startSession(contentUrl, parameters);
		} catch (e) {
			// TODO: エラーハンドリング
			console.error(e);
		}
	}

	exitSession = async (sessionId: string, parameters: CoeExitSessionParameterObject): Promise<void> => {
		try {
			console.log("exitSession", sessionId, parameters);
			if (parameters == null) {
				return;
			}
			if (parameters.needsResult) {
				const instance = this._localInstance;
				if (instance == null) {
					throw new Error("Invalid operation");
				}
				const gameState = await this._gameViewManager.getGameVars<GameState>(instance.gameContent, "gameState");
				this._coePluginMessageHandler({
					type: "end",
					result: gameState ? gameState.score : null,
					sessionId
				});
			}
			await this._deleteLocalInstance(sessionId);
		} catch (e) {
			// TODO: エラーハンドリング
			console.error(e);
		}
	}

	sendLocalEvents = async (_sessionId: string, _events: Event[]): Promise<void> => {
		// TODO
	}

	private async _startSession(_contentUrl: string, _parameters: any): Promise<void> {
		// TODO
	}

	private async _startLocalSession(contentUrl: string, parameters: CoeStartSessionParameterObject): Promise<void> {
		try {
			this._localInstance = await this._createLocalInstance({
				contentUrl,
				playId: parameters.sessionId,
				local: true,
				argument: {
					coe: {
						permission: {
							advance: true,
							advanceRequest: true,
							aggregation: true
						},
						roles: ["broadcaster"],
						debugMode: false
					}
				},
				initialEvents: parameters.localEvents
			});
		} catch (e) {
			// TODO: エラーハンドリング
			console.error(e);
		}
	}

	private _resolveContentUrl(application: CoeApplicationIdentifier, cascadeApplications?: CoeApplicationIdentifier[]): string {
		if (cascadeApplications && cascadeApplications[0] && cascadeApplications[0].url) {
			const url = cascadeApplications[0].url;
			if (url.indexOf("?") === 0) {
				return `${this._resolveContentUrl(application)}${url}`;
			}
			return this._resolveContentUrl(application);
		} else {
			if (application.url == null) {
				// TODO
				throw new Error("Could not resolve content url");
			}
			return application.url;
		}
	}
}

