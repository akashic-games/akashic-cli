import { Trigger } from "@akashic/trigger";
import type { ClientContentLocator } from "../common/ClientContentLocator";
import { NullScriptAssetV3 } from "./AssetV3";
import { ServeGameContent } from "./ServeGameContent";
import { generateTestbedScriptAsset } from "./TestbedScriptAsset";

interface Renderer {
	drawImage(
		surface: Surface,
		offsetX: number,
		offsetY: number,
		width: number,
		height: number,
		destOffsetX: number,
		destOffsetY: number
	): void;
}

interface Surface {
	width: number;
	height: number;
	renderer(): Renderer;
}

interface Platform {
	getPrimarySurface: () => Surface;
	_resourceFactory: {
		createScriptAsset: (id: string, path: string) => any;  // 戻り値は `g.ScriptAsset` (コンパイル時に g がないので any で妥協)
		createSurface: (width: number, height: number) => Surface;
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
	loadAudioAsset(param: { id: string; assetPath: string }, handler: (err?: any) => void): void {
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

	createGameContent(param: CreateGameContentParameterObject): ServeGameContent {
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
		const agvGameContent = new agv.GameContent(gameConfig);
		agvGameContent.onExternalPluginRegister = new Trigger();
		return new ServeGameContent(agvGameContent);
	}

	startGameContent(content: ServeGameContent): Promise<void> {
		const agvGameContent = content.agvGameContent;
		return new Promise<void>((resolve, reject) => {
			// agvにGameContenをt読み込み時にのみ使用するエラーハンドリング
			const initializeErrorListener: agv.ErrorListener = {
				onError: (e) => {
					return reject(e);
				}
			};
			agvGameContent.addErrorListener(initializeErrorListener);
			agvGameContent.addContentLoadListener({
				onLoad: () => {
					// 読み込みが完了したら、この処理用のエラーハンドリングは削除して代わりにゲーム動作中のエラーハンドリングを追加する
					agvGameContent.removeErrorListener(initializeErrorListener);
					agvGameContent.addErrorListener({
						onError: (e) => {
							console.error(e);
						}
					});
					content.setup();
					resolve();
				}
			});
			this.gameView.addContent(agvGameContent);
		});
	}

	removeGameContent(content: ServeGameContent): void {
		this.gameView.removeContent(content.agvGameContent);
	}

	setViewSize(width: number, height: number): void {
		this.gameView.setViewSize(width, height);
	}

	getViewSize(): {width: number; height: number} {
		return this.gameView.getViewSize();
	}

	registerExternalPlugin(plugin: agv.ExternalPlugin): void {
		this.gameView.registerExternalPlugin(plugin);
	}

	getGameVars<T>(content: ServeGameContent, propertyName: string): Promise<T> {
		return new Promise(resolve => {
			content.agvGameContent.getGameVars(propertyName, value => {
				resolve(value);
			});
		});
	}

	private customizePlatform(platform: Platform, options: any): void {
		const scriptAssetClass = options.g.ScriptAsset || NullScriptAssetV3;
		// eslint-disable-next-line @typescript-eslint/naming-convention
		const TestbedScriptAsset = generateTestbedScriptAsset(scriptAssetClass);
		platform._resourceFactory.createScriptAsset = (id: string, assetPath: string) => {
			return new TestbedScriptAsset(
				id,
				assetPath,
				() => options.g.ExceptionFactory.createAssetLoadError("can not load script: " + assetPath)
			);
		};
		// 一部のエッジケースでSafariのみ描画されないという問題が発生するので、ゲーム開発者が開発中に気づけるようにg.Renderer#drawImage()でエラーを投げる処理を差し込む
		function createMeddlingWrappedSurfaceFactory <T extends ((...args: any[]) => Surface)> (func: T) {
			return function() {
				const surface = func.apply(this, arguments);
				const originalRenderer = surface.renderer;
				let renderer: Renderer = null;
				surface.renderer = function () {
					// surface.renderer() はコンテンツから描画のたびに呼び出されるが戻り値は現実的に固定なので、ここでの surface.renderer() の上書きは一度しか適用しない
					if (renderer) {
						return renderer;
					}
					renderer = originalRenderer.apply(this);
					const originalDrawImage = renderer.drawImage;
					renderer.drawImage = function (
						surface: Surface,
						offsetX: number,
						offsetY: number,
						width: number,
						height: number,
						_destOffsetX: number,
						_destOffsetY: number
					) {
						if (offsetX < 0 || offsetX + width > surface.width || offsetY < 0 || offsetY + height > surface.height) {
							// ref. https://github.com/akashic-games/akashic-engine/issues/349
							throw new Error(`drawImage(): out of bounds.`
								+ `The source rectangle bleeds out the source surface (${surface.width}x${surface.height}). `
								+ `This is not a bug but intentionally prohibited by akashic serve`
								+ `to prevent platform-specific rendering trouble.`
							);
						}
						if (width <= 0 || height <= 0) {
							throw new Error(`drawImage(): nothing to draw.`
								+ `Either width or height is less than or equal to zero.`
								+ `This is not a bug but intentionally prohibited by akashic serve`
								+ `to prevent platform-specific rendering trouble.`
							);
						}
						originalDrawImage.apply(this, arguments);
					}
					return renderer;
				}
				return surface;
			};
		}
		platform.getPrimarySurface = createMeddlingWrappedSurfaceFactory(platform.getPrimarySurface);
		platform._resourceFactory.createSurface = createMeddlingWrappedSurfaceFactory(platform._resourceFactory.createSurface);
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
