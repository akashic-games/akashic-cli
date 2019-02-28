import {generateTestbedScriptAsset} from "./TestbedScriptAsset";
import {Trigger} from "@akashic/trigger";

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

export class GameViewManager {
	private rootElement: HTMLElement;
	private gameView: agv.AkashicGameView;

	constructor(params: GameViewManagerParameterObject) {
		this.rootElement = document.createElement("div");
		this.gameView = new agv.AkashicGameView({
			container: this.rootElement,
			width: params.width || 0,
			height: params.height || 0,
			sharedObject: params.sharedObject
		});
	}

	getRootElement(): HTMLElement {
		return this.rootElement;
	}

	createGameContent(gameConfig: agv.GameConfig): agv.GameContent {
		const customGameConfig = {
			...gameConfig
		};
		// TODO: 複数コンテンツのホスティングに対応されれば削除
		if (gameConfig.gameLoaderCustomizer.createCustomAmflowClient) {
			customGameConfig.gameLoaderCustomizer.platformCustomizer = this.customizePlatform;
		}
		const gameContent = new agv.GameContent(customGameConfig);
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
