import type { Event } from "@akashic/playlog";
import type {
	CoeStartSessionParameterObject, CoeExitSessionParameterObject, CoeApplicationIdentifier, CoeExternalMessage
} from "../../common/types/plugin";
import type { LocalInstanceEntity } from "../../store/LocalInstanceEntity";

export interface GameState {
	score?: number;
	playThreshold?: number;
	clearThreshold?: number;
}

export interface CreateCoeLocalInstanceParameterObject {
	local: boolean;
	playId: string;
	contentUrl?: string;
	argument?: any;
	initialEvents?: Event[];
}

export interface CoePluginParameterObject {
	instanceArgument?: any;
	onLocalInstanceCreate: (params: CreateCoeLocalInstanceParameterObject) => Promise<LocalInstanceEntity>;
	onLocalInstanceDelete: (playId: string) => Promise<void>;
}

export interface LocalSessionState {
	sessionId: string;
	localInstance: LocalInstanceEntity;
	messageHandler: ((message: CoeExternalMessage) => void) | undefined;
}

const DEFAULT_INSTANCE_ARGUMENT = {
	coe: {
		permission: {
			advance: true,
			advanceRequest: true,
			aggregation: true
		},
		roles: ["broadcaster"],
		debugMode: false
	}
};

export class CoePlugin implements agv.ExternalPlugin {
	readonly name: string = "coe";
	private _localSessionTable: { [sessionId: string]: LocalSessionState } = {};
	private _argument: any;
	private _createLocalInstance: (params: CreateCoeLocalInstanceParameterObject) => Promise<LocalInstanceEntity>;
	private _deleteLocalInstance: (playId: string) => Promise<void>;

	constructor(param: CoePluginParameterObject) {
		this._createLocalInstance = param.onLocalInstanceCreate;
		this._deleteLocalInstance = param.onLocalInstanceDelete;
		this._argument = param.instanceArgument;
	}

	onload(game: agv.GameLike, _dataBus: unknown, _gameContent: agv.GameContent): void {
		const startLocalSession = async (contentUrl: string, parameters: CoeStartSessionParameterObject): Promise<void> => {
			try {
				const { sessionId, messageHandler, localEvents } = parameters;
				const localInstance = await this._createLocalInstance({
					contentUrl,
					playId: sessionId,
					local: true,
					argument: this._argument ?? DEFAULT_INSTANCE_ARGUMENT,
					initialEvents: localEvents
				});
				this._localSessionTable[parameters.sessionId] = { sessionId, localInstance, messageHandler };
			} catch (e) {
				// TODO: エラーハンドリング
				console.error(e);
			}
		};

		const startSession = async (parameters: CoeStartSessionParameterObject): Promise<void> => {
			try {
				if (!parameters.application == null) {
					throw new Error("Cannot start session");
				}
				if (!parameters.local) {
					throw new Error("Not implemented");
				}
				const contentUrl = resolveContentUrl(parameters.application!, parameters.cascadeApplications);
				await startLocalSession(contentUrl, parameters);
			} catch (e) {
				// TODO: エラーハンドリング
				console.error(e);
			}
		};

		const exitSession = async (sessionId: string, parameters: CoeExitSessionParameterObject): Promise<void> => {
			try {
				if (parameters == null || !this._localSessionTable.hasOwnProperty(sessionId)) {
					return;
				}
				const sessionState = this._localSessionTable[sessionId];
				delete this._localSessionTable[sessionId];
				if (parameters.needsResult) {
					const instance = sessionState.localInstance;
					if (instance == null) {
						throw new Error("Invalid operation");
					}
					const gameState = await instance.gameContent.getGameVars<GameState>("gameState");
					sessionState.messageHandler!({
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
		};

		const sendLocalEvents = async (_sessionId: string, _events: Event[]): Promise<void> => {
			// TODO
		};

		game.external.coe = {
			startSession,
			exitSession,
			sendLocalEvents
		};
	}
}

function resolveContentUrl(application: CoeApplicationIdentifier, cascadeApplications?: CoeApplicationIdentifier[]): string {
	if (cascadeApplications && cascadeApplications[0] && cascadeApplications[0].url) {
		const url = cascadeApplications[0].url;
		if (url.indexOf("?") === 0) {
			return `${resolveContentUrl(application)}${url}`;
		}
		return resolveContentUrl(application);
	} else {
		if (application.url == null) {
			// TODO
			throw new Error("Could not resolve content url");
		}
		return application.url;
	}
}
