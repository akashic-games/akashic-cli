// Akashic Engine の使う部分に無理やり型をつける
// TODO engineFiles 内の型をなんとかして使う？
declare module ae {
	const enum EntityStateFlags {
		Hidden = 1
	}

	interface PointLike {
		x: number;
		y: number;
	}

	interface MatrixLike {
		_matrix: number[];
		_modified: boolean;
		multiplyNew(mat: MatrixLike): MatrixLike;
		multiplyPoint(p: PointLike): PointLike;
	}

	interface CameraLike {
		getMatrix(): MatrixLike;
	}

	interface ELike {
		id: number;
		children?: ELike[];
		x: number;
		y: number;
		width: number;
		height: number;
		opacity: number;
		angle: number;
		scaleX: number;
		scaleY: number;
		anchorX?: number;
		anchorY?: number;
		local?: boolean;
		touchable: boolean;
		state: number;
		parent?: ELike;
		_matrix?: MatrixLike;
		_touchable: boolean;
		_hasTouchableChildren: boolean;
		_targetCameras?: CameraLike[];

		// FilledRect
		cssColor?: string;
		// Label
		text?: string;
		// Sprite (not used yet)
		surface?: any;
		srcWidth?: number;
		srcHeight?: number;
		srcX?: number;
		srcY?: number;

		getMatrix(): MatrixLike;
	}

	interface PointSourceLike {
		target: ELike;
	}

	interface SceneLike {
		children: ELike[];
		findPointSourceByPoint(p: PointLike, force: boolean, camera: CameraLike): PointSourceLike;
	}

	interface RendererLike {
		begin(): void;
		end(): void;
		save(): void;
		restore(): void;
		transform(mat: number[]): void;
		fillRect(x: number, y: number, width: number, height: number, cssColor: string): void;
	}
}

declare module agv {
	class AkashicGameView {
		constructor(...args: any[]);
		addContent(content: any): void;
		removeContent(content: any): void;
		setViewSize(width: number, height: number): void;
		getViewSize(): {width: number; height: number};
		registerExternalPlugin(plugin: ExternalPlugin): void;
	}

	class GameContent {
		onExternalPluginRegister: TriggerLike; // NOTE: 拡張
		constructor(...args: any[]);
		pause(): void;
		resume(): void;
		setExecutionMode(mode: ExecutionMode): void;
		addContentLoadListener(contentLoadListener: any): void;
		addErrorListener(errorListener: ErrorListener): void;
		removeErrorListener(errorListener: ErrorListener): void;
		getGameVars(propertyName: string, listener: (vars: any) => void): void;
		getGame(): agv.GameLike;
		getGameDriver(): agv.GameDriverLike;
		setMasterVolume(vol: number): void;
		getMasterVolume(): number;
	}

	interface PlaylogConfig {
		playId: string;
		executionMode: ExecutionMode;
		replayTargetTimeFunc: () => number;
		playlogServerUrl?: string;
		playToken?: string;
	}

	interface GameViewSharedObject {}

	interface GameLoaderCustomizer {
		platformCustomizer?: (platform: any, opts?: any) => void;
		createCustomAudioPlugins?: () => any[];
		createCustomAmflowClient?: () => any;
		overwriteEngineConfig?: string;
	}

	interface GameConfig {
		contentUrl: string;
		player: {
			id: string;
			name?: string;
		};
		playConfig: PlaylogConfig;
		gameLoaderCustomizer: GameLoaderCustomizer;
		argument?: any;
	}

	interface ErrorListener {
		onError: (e: Error) => void;
	}

	interface ExternalPlugin {
		name: string;
		onload: (game: agv.GameLike, dataBus: any, gameContent: GameContent) => void;
	}

	interface TriggerLike {
		add: (...args: any[]) => void;
		addOnce: (...args: any[]) => void;
		remove: (...args: any[]) => void;
		fire: (arg: any) => void;
	}

	interface GameExternalPluginsLike {
		coe?: any;
		send?: any;
		nico?: any;
		coeLimited?: any;
	}

	enum ExecutionMode {
		Active, Passive, Replay
	}

	interface GameLike {
		external: GameExternalPluginsLike;

		// to dump
		db: { [id: number]: ae.ELike };
		renderers: ae.RendererLike[];
		_localDb: { [id: number]: ae.ELike };
		focusingCamera?: ae.CameraLike;
		vars: any;
		_modified?: boolean; // AEv3 でのみ存在
		scene(): ae.SceneLike;
		render(camera?: ae.CameraLike): void;
		tick(advanceAge: boolean, omittedTickCount?: number): boolean;
	}

	interface GameDriverLike {
		_gameLoop: {
			_clock: {
				_profiler: {
					_calculateProfilerValueTrigger: agv.TriggerLike;
				};
			};
		};
	}
}
