import {Trigger} from "@akashic/trigger";
import {ClientContentLocator} from "../common/ClientContentLocator";
import {generateTestbedScriptAsset} from "./TestbedScriptAsset";

export interface Platform {
	_resourceFactory: {
		createScriptAsset: (id: string, path: string) => any;  // 戻り値は `g.ScriptAsset` (コンパイル時に g がないので any で妥協)
	};
}

export interface GameViewManagerParameterObject {
	width?: number;
	height?: number;
	sharedObject?: agv.GameViewSharedObject;
	untrustedFrameUrl?: string;
	trustedChildOrigin?: RegExp;
}
export interface CreateGameContentParameterObject {
	contentLocator: ClientContentLocator;
	player: {
		id: string;
		name?: string;
	};
	playConfig: agv.PlaylogConfig;
	gameLoaderCustomizer: agv.GameLoaderCustomizer;
	argument?: any;
	proxyAudio?: boolean;
}

// --debug-proxy-audio用の暫定実装。デバッグ用なのでログに出すのみ。
// 将来的にはこれを使って、音を鳴らしつつ再生状況を devtools に表示するようにもしてもいいかもしれない。
export class LogAudioPdiHandler {
	loadAudioAsset(param: { id: string, assetPath: string }, handler: (err?: any) => void): void {
		console.log("AUDIOLOG: loadAudioAsset", param);
		setTimeout(() => handler(), 0);
	}
	unloadAudioAsset(assetId: string): void {
		console.log("AUDIOLOG: unloadAudioAsset", assetId);
	}
	createAudioPlayer(param: unknown): void {
		console.log("AUDIOLOG: createAudioPlayer", param);
	}
	destroyAudioPlayer(audioPlayerId: string): void {
		console.log("AUDIOLOG: destroyAudioPlayer", audioPlayerId);
	}
	playAudioPlayer(audioPlayerId: string): void {
		console.log("AUDIOLOG: playAudioPlayer", audioPlayerId);
	}
	stopAudioPlayer(audioPlayerId: string): void {
		console.log("AUDIOLOG: stopAudioPlayer", audioPlayerId);
	}
	changeAudioVolume(audioPlayerId: string, volume: number): void {
		console.log("AUDIOLOG: changeAudioVolume", audioPlayerId, volume);
	}
	changeAudioPlaybackRate(audioPlayerId: string, rate: number): void {
		console.log("AUDIOLOG: changeAudioPlaybackRate", audioPlayerId, rate);
	}
}

export class GameViewManager {
	private rootElement: HTMLElement;
	private gameView: agv.AkashicGameView;

	constructor(params: GameViewManagerParameterObject) {
		this.rootElement = document.createElement("div");
		this.gameView = new agv.AkashicGameView({
			container: this.rootElement,
			width: params.width || 0,
			height: params.height || 0,
			sharedObject: params.sharedObject,
			untrustedFrameUrl: params.untrustedFrameUrl || this.getDefaultUntrustedFrameUrl(),
			trustedChildOrigin: params.trustedChildOrigin || /.*/
		});
	}

	getRootElement(): HTMLElement {
		return this.rootElement;
	}

	createGameContent(param: CreateGameContentParameterObject): agv.GameContent {
		const loc = param.contentLocator;
		const gameConfig = {
			contentUrl: loc.asDebuggableRootRelativeUrl() || loc.asAbsoluteUrl(),
			player: param.player,
			playConfig: param.playConfig,
			gameLoaderCustomizer: param.gameLoaderCustomizer,
			argument: param.argument,
			audioPdiHandlers: param.proxyAudio ? new LogAudioPdiHandler() : null
		};
		// TODO: 複数コンテンツのホスティングに対応されれば削除
		if (param.gameLoaderCustomizer.createCustomAmflowClient) {
			gameConfig.gameLoaderCustomizer.platformCustomizer = this.customizePlatform;
		}
		const gameContent = new agv.GameContent(gameConfig);
		gameContent.onExternalPluginRegister = new Trigger();
		return gameContent;
	}

	startGameContent(content: agv.GameContent): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			// agvにGameContenをt読み込み時にのみ使用するエラーハンドリング
			const initializeErrorListener: agv.ErrorListener = {
				onError: (e) => {
					return reject(e);
				}
			};
			content.addErrorListener(initializeErrorListener);
			content.addContentLoadListener({
				onLoad: () => {
					// 読み込みが完了したら、この処理用のエラーハンドリングは削除して代わりにゲーム動作中のエラーハンドリングを追加する
					content.removeErrorListener(initializeErrorListener);
					content.addErrorListener({
						onError: (e) => {
							console.error(e);
						}
					});
					resolve();
				}
			});
			this.gameView.addContent(content);
		});
	}

	removeGameContent(content: agv.GameContent): void {
		this.gameView.removeContent(content);
	}

	setViewSize(width: number, height: number): void {
		this.gameView.setViewSize(width, height);
	}

	getViewSize(): {width: number, height: number} {
		return this.gameView.getViewSize();
	}

	registerExternalPlugin(plugin: agv.ExternalPlugin): void {
		this.gameView.registerExternalPlugin(plugin);
	}

	getGameVars<T>(content: agv.GameContent, propertyName: string): Promise<T> {
		return new Promise(resolve => {
			content.getGameVars(propertyName, value => {
				resolve(value);
			});
		});
	}

	private customizePlatform(platform: Platform, options: any): void {
		const TestbedScriptAsset = generateTestbedScriptAsset(options.g.ScriptAsset);
		platform._resourceFactory.createScriptAsset = (id: string, assetPath: string) => {
			return new TestbedScriptAsset(
				id,
				assetPath,
				() => options.g.ExceptionFactory.createAssetLoadError("can not load script: " + assetPath)
			);
		};
	}

	private getDefaultUntrustedFrameUrl(): string {
		// untrustedFrameUrl の制約上、別ホストでアクセスさせる必要があるのでそれを求める
		const { hostname, protocol, port } = window.location;
		const altHost = (hostname === "localhost") ? "127.0.0.1" : "localhost";
		const altOrigin = `${protocol}//${altHost}:${port}`;

		if (hostname !== "localhost" && hostname !== "127.0.0.1") {
			// 上述の制約上、今の --debug-untrusted はローカルマシンでしか動作しないのてその旨警告しておく
			console.warn("Hosted on neither localhost nor 127.0.0.1. --debug-untrusted will not work.");
		}

		return `${altOrigin}/internal/untrusted_loader/loader_local.html`;
	}
}
