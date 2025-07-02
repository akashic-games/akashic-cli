import type * as pl from "@akashic/playlog";
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
	_drawable: any;
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
	initialEvents?: pl.Event[];
	proxyAudio?: boolean;
	runInIframe?: boolean;

	/**
	 * Webブラウザの開発者ツールのソースコード欄に現れる (debuggable) スクリプトを "使わない" か。
	 * 実装の制限から、同時に実行されるコンテンツでは一つしか debuggable にできない。
	 * (TestbedScriptAsset.ts が使う this.id がコンテンツ間で衝突しうる)
	 * TODO: この制限をなくして、このオプションごと廃止する。
	 */
	useNonDebuggableScript?: boolean;
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
	private contents: { [key: string]: ServeGameContent };

	constructor(params: GameViewManagerParameterObject) {
		this.rootElement = document.createElement("div");
		this.gameView = new agv.AkashicGameView({
			container: this.rootElement,
			width: params.width || 0,
			height: params.height || 0,
			sharedObject: params.sharedObject,
			untrustedFrameUrl: params.untrustedFrameUrl || getDefaultUntrustedFrameUrl(),
			trustedChildOrigin: params.trustedChildOrigin || /.*/
		});
		this.contents = Object.create(null);
	}

	getRootElement(): HTMLElement {
		return this.rootElement;
	}

	createGameContent(param: CreateGameContentParameterObject): ServeGameContent {
		const loc = param.contentLocator;
		const contentUrl =
			param.useNonDebuggableScript ?
				loc.asAbsoluteUrl() :
				(loc.asDebuggableRootRelativeUrl() || loc.asAbsoluteUrl());
		const gameConfig = {
			contentUrl,
			player: param.player,
			playConfig: param.playConfig,
			gameLoaderCustomizer: param.gameLoaderCustomizer,
			argument: param.argument,
			initialEvents: param.initialEvents,
			audioPdiHandlers: param.proxyAudio ? new LogAudioPdiHandler() : null,
			runInIframe: param.runInIframe
		};
		const agvGameContent = new agv.GameContent(gameConfig);
		const ret = new ServeGameContent(agvGameContent);
		this.contents[ret.id] = ret;
		// TODO: 複数コンテンツのホスティングに対応されれば削除
		if (!param.useNonDebuggableScript) {
			// 簡易実装。gameConfig を書き換えるのは new agv.GameContent() に渡す前にすべき
			gameConfig.gameLoaderCustomizer.platformCustomizer = createPlatformCustomizer(ret);
		}
		return ret;
	}

	startGameContent(content: ServeGameContent): Promise<void> {
		const agvGameContent = content.agvGameContent;
		return new Promise<void>((resolve, reject) => {
			// GameContentの読み込み時にのみ使用するエラーハンドリング
			const initializeErrorListener: agv.ErrorListener = {
				onError: (e) => {
					return reject(e);
				}
			};
			agvGameContent.addErrorListener({
				onError: (e) => {
					console.error(e);
				}
			});
			agvGameContent.addErrorListener(initializeErrorListener);
			agvGameContent.addContentLoadListener({
				onLoad: () => {
					// 読み込みが完了したらエラー処理用のハンドリングを削除
					agvGameContent.removeErrorListener(initializeErrorListener);
					content.setup();
					resolve();
				}
			});
			this.gameView.addContent(agvGameContent);
		});
	}

	removeGameContent(content: ServeGameContent): void {
		delete this.contents[content.id];
		this.gameView.removeContent(content.agvGameContent);
	}

	setViewSize(width: number, height: number): void {
		this.gameView.setViewSize(width, height);
		Object.keys(this.contents).forEach(id => {
			this.contents[id].setContentArea({ x: 0, y: 0, width, height });
		});
	}

	getViewSize(): {width: number; height: number} {
		return this.gameView.getViewSize();
	}

	registerExternalPlugin(plugin: agv.ExternalPlugin): void {
		this.gameView.registerExternalPlugin(plugin);
	}
}

function createPlatformCustomizer(content: ServeGameContent): (platform: Platform, options: any) => void {
	return (platform: Platform, options: any): void => {
		const scriptAssetClass = options.g.ScriptAsset || NullScriptAssetV3;
		// eslint-disable-next-line @typescript-eslint/naming-convention
		const TestbedScriptAsset = generateTestbedScriptAsset(scriptAssetClass);
		platform._resourceFactory.createScriptAsset = (id: string, assetPath: string, exports?: string[]) => {
			return new TestbedScriptAsset(
				id,
				assetPath,
				exports,
				() => options.g.ExceptionFactory.createAssetLoadError("can not load script: " + assetPath)
			);
		};
		// 一部のエッジケースでSafariのみ描画されないという問題が発生するので、ゲーム開発者が開発中に気づけるようにg.Renderer#drawImage()でエラーを投げる処理を差し込む
		function createMeddlingWrappedSurfaceFactory <T extends ((...args: any[]) => Surface)> (func: T) {
			return function (this: Surface) {
				const surface: Surface = func.apply(this, [...arguments]);
				// Safariで範囲外描画時に問題が発生するのはCanvas要素なので、surfaceがCanvasでなければ範囲外描画の警告は行わない
				if (!(surface._drawable instanceof HTMLCanvasElement)) {
					return surface;
				}
				const originalRenderer = surface.renderer;
				let renderer: Renderer | null = null;
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
							const type = "drawOutOfCanvas";
							const message = "drawImage(): out of bounds."
								+ `The source rectangle bleeds out the source surface (${surface.width}x${surface.height}). `
								+ "This is not a bug but warned by akashic serve"
								+ "to prevent platform-specific rendering trouble.";
							content.onWarn.fire({ type, message });
						}
						if (width <= 0 || height <= 0) {
							const type = "drawDestinationEmpty";
							const message = "drawImage(): nothing to draw."
								+ "Either width or height is less than or equal to zero."
								+ "This is not a bug but warned by akashic serve"
								+ "to prevent platform-specific rendering trouble.";
							content.onWarn.fire({ type, message });
						}
						originalDrawImage.apply(this, [
							surface, offsetX, offsetY, width, height, _destOffsetX, _destOffsetY
						]);
					};
					return renderer;
				};
				return surface;
			};
		}
		platform.getPrimarySurface = createMeddlingWrappedSurfaceFactory(platform.getPrimarySurface);
		platform._resourceFactory.createSurface = createMeddlingWrappedSurfaceFactory(platform._resourceFactory.createSurface);
	};
}

function getDefaultUntrustedFrameUrl(): string {
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
