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

export interface CoeSessionData {
	sessionId: string;
	instance: LocalInstanceEntity;
	messageHandler: (parameters: CoeExternalMessage) => void;
}

export interface CreateCoeLocalInstanceParameterObject {
	local: boolean;
	playId: string;
	parent?: LocalInstanceEntity;
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
	targetInstance: LocalInstanceEntity;
	onLocalInstanceCreate: (params: CreateCoeLocalInstanceParameterObject) => Promise<LocalInstanceEntity>;
	onLocalInstanceDelete: (playId: string) => Promise<void>;
}


export class CoePluginEntity {
	private _gameViewManager: GameViewManager;
	private _targetInstance: LocalInstanceEntity;
	private _childrenTable: { [sessionId: string]: CoeSessionData };
	private _createLocalInstance: (params: CreateCoeLocalInstanceParameterObject) => Promise<LocalInstanceEntity>;
	private _deleteLocalInstance: (playId: string) => Promise<void>;

	constructor(param: CoePluginEntityParameterObject) {
		this._gameViewManager = param.gameViewManager;
		this._targetInstance = param.targetInstance;
		this._childrenTable = {};
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
			if (parameters.application == null) {
				throw new Error("Cannot start session");
			}

			// NOTE: 引数の決め方に仕様はない。組み込みサービスが決める。ここでは親セッションの値を引き継いでおく
			const argument = this._targetInstance.argument;
			const contentUrl = this._resolveContentUrl(parameters.application, parameters.cascadeApplications);

			if (parameters.local) {
				this._startLocalSession(contentUrl, parameters, argument);
				return;
			}

			if (typeof parameters.delayRange === "number") {
				window.setTimeout(() => {
					this._startSession(contentUrl, parameters, argument);
				}, Math.floor(Math.random() * parameters.delayRange));
				return;
			}

			await this._startSession(contentUrl, parameters, argument);
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
			if (!this._childrenTable.hasOwnProperty(sessionId)) {
				throw new Error("Invalid operation");
			}

			if (parameters.needsResult) {
				const child = this._childrenTable[sessionId];
				const gameState = await this._gameViewManager.getGameVars<GameState>(child.instance.gameContent, "gameState");
				child.messageHandler({
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

	private async _startSession(contentUrl: string, parameters: any, argument: any): Promise<void> {
		try {
			const sessionId = parameters.sessionId;
			const instance = await this._createLocalInstance({
				contentUrl,
				playId: sessionId,
				local: false,
				parent: this._targetInstance,
				argument,
				initialEvents: parameters.localEvents
			});
			this._childrenTable[sessionId] = { sessionId, instance, messageHandler: parameters.messageHandler };
		} catch (e) {
			// TODO: エラーハンドリング
			console.error(e);
		}
	}

	private async _startLocalSession(contentUrl: string, parameters: CoeStartSessionParameterObject, argument: any): Promise<void> {
		try {
			const sessionId = parameters.sessionId;
			const instance = await this._createLocalInstance({
				contentUrl,
				playId: sessionId,
				local: true,
				parent: this._targetInstance,
				argument,
				initialEvents: parameters.localEvents
			});
			this._childrenTable[sessionId] = { sessionId, instance, messageHandler: parameters.messageHandler };
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

