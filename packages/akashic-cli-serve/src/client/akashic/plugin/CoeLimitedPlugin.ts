import * as pl from "@akashic/playlog";

export interface PlayerInfoResolverResultMessage {
	result: {
		name: string;
		userData: {
			accepted: boolean;
			premium: boolean;
		};
	};
}

export interface StartLocalSessionPameterObject {
	sessionId: string;
	applicationName: string;
	localEvents: pl.Event[];
	messageHandler: (message: PlayerInfoResolverResultMessage) => void;
}

const ALLOWED_APPLICATION_NAME = "player-info-resolver";

export interface CoeLimitedPluginParameterObject {
	startPlayerInfoResolver: (limitSeconds: number | undefined, cb: (result: PlayerInfoResolverResultMessage) => void) => void;
	endPlayerInfoResolver: () => void;
}

export class CoeLimitedPlugin implements agv.ExternalPlugin {
	readonly name: string = "coeLimited";
	private startPlayerInfoResolver: (limitSeconds: number | undefined, cb: (result: PlayerInfoResolverResultMessage) => void) => void;
	private endPlayerInfoResolver: () => void;

	constructor(param: CoeLimitedPluginParameterObject) {
		this.startPlayerInfoResolver = param.startPlayerInfoResolver;
		this.endPlayerInfoResolver = param.endPlayerInfoResolver;
	}

	onload(game: agv.GameLike, _dataBus: unknown, _gameContent: agv.GameContent): void {
		game.external.coeLimited = {
			startLocalSession: (param: StartLocalSessionPameterObject): void => {
				if (param.applicationName !== ALLOWED_APPLICATION_NAME)
					return;
				// FIXME playlog で isolatedModules を考慮したのち削除。
				// @ts-expect-error src/clent/ は isolatedModules: true なので const enum の MessageEventIndex がエラーになるが、
				// 実際は playlog が preserveConstEnums でビルドされているため問題にならない。
				const localEventData = param.localEvents[0][pl.MessageEventIndex.Data];
				const limitSeconds = localEventData?.parameters?.limitSeconds;
				this.startPlayerInfoResolver(limitSeconds, param.messageHandler);
			},
			exitLocalSession: (_sessionId: string): void => {
				this.endPlayerInfoResolver();
			}
		};
	};
}
