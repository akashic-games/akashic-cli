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
	audioPlayerIdCounter: number = 0;

	loadAudioAsset(param: { id: string, assetPath: string }, handler: (err?: any) => void): void {
		console.info("AUDIOLOG: loadAudioAsset", param);
		setTimeout(() => handler(), 0);
	}
	unloadAudioAsset(assetId: string): void {
		console.info("AUDIOLOG: unloadAudioAsset", assetId);
	}
	createAudioPlayer(assetId: string): string {
		const ret = "lap" + this.audioPlayerIdCounter++;
		console.info("AUDIOLOG: createAudioPlayer", assetId, ret);
		return ret;
	}
	destroyAudioPlayer(audioPlayerId: string): void {
		console.info("AUDIOLOG: destroyAudioPlayer", audioPlayerId);
	}
	playAudioPlayer(audioPlayerId: string): void {
		console.info("AUDIOLOG: playAudioPlayer", audioPlayerId);
	}
	stopAudioPlayer(audioPlayerId: string): void {
		console.info("AUDIOLOG: stopAudioPlayer", audioPlayerId);
	}
	changeAudioVolume(audioPlayerId: string, volume: number): void {
		console.info("AUDIOLOG: changeAudioVolume", audioPlayerId, volume);
	}
	changeAudioPlaybackRate(audioPlayerId: string, rate: number): void {
		console.info("AUDIOLOG: changeAudioPlaybackRate", audioPlayerId, rate);
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
			untrustedFrameUrl: "/internal/untrusted_loader/loader_local.html",
			trustedChildOrigin: /.*/
		});
	}

	getRootElement(): HTMLElement {
		return this.rootElement;
	}

	createGameContent(param: CreateGameContentParameterObject): agv.GameContent {
		const gameConfig = {
			contentUrl: param.contentLocator.asDebuggableRootRelativeUrl(),
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
}
