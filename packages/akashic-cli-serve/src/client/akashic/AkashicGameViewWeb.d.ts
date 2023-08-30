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

	// g.game.random の型。v1 では定義が違う (配列だった) ため、全メソッドがオプショナルである点に注意。
	interface RandomGeneratorLike {
		get?(min: number, max: number): number;
		generate?(): number;
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
		findPointSourceByPoint(p: PointLike, force: boolean, camera?: CameraLike): PointSourceLike;
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
		readonly id: number;
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
		setContentArea(area: ContentArea): void;
		sendEvents(events: any[]): void;
	}

	interface ContentArea {
		x: number;
		y: number;
		width: number;
		height: number;
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
		initialEvents?: any[];
	}

	interface ErrorListener {
		onError: (e: Error) => void;
	}

	interface ExternalPlugin {
		name: string;
		onload: (game: agv.GameLike, dataBus: unknown, gameContent: GameContent) => void;
	}

	interface TriggerLike {
		add: (...args: any[]) => void;
		addOnce: (...args: any[]) => void;
		remove: (...args: any[]) => void;
		fire: (arg: any) => void;
		handle: (...args: any[]) => void; // deprecatedだが、v1コンテンツとの互換性のために定義
	}

	interface GameExternalPluginsLike {
		coe?: any;
		send?: any;
		nico?: any;
		coeLimited?: any;
		instanceStorage?: any;
	}

	enum ExecutionMode {
		Active, Passive, Replay
	}

	interface GameLike {
		external: GameExternalPluginsLike;

		// to dump
		db: { [id: number]: ae.ELike };
		_idx: number;
		renderers: ae.RendererLike[];
		_localDb: { [id: number]: ae.ELike };
		focusingCamera?: ae.CameraLike;
		vars: any;
		_modified?: boolean; // AEv3 でのみ存在

		age: number;
		random: ae.RandomGeneratorLike;

		scene(): ae.SceneLike;
		render(camera?: ae.CameraLike): void;
		tick(advanceAge: boolean, omittedTickCount?: number, events?: playlog.EventLike[]): boolean;
	}

	interface EventBuffer {
		onEvent(pev: playlog.EventLike): void;
	}

	interface GameDriverLike {
		_gameLoop: {
			_clock: {
				_profiler: {
					_calculateProfilerValueTrigger: agv.TriggerLike;
				};
			};
			// Akashic Engine v2 系以前では存在しないため optional
			// startPoint は @akashic/amflow の StartPoint だがここでは import できないため any
			reset?(startPoint: any): void;
		};
		_eventBuffer: EventBuffer;
	}
}

// 本来は @akashic/playlog の型を参照すべきだが、参照出来ないため定義している
declare module playlog {
	const enum EventCodeLike {
		Join = 0,
		Leave = 1,
		Timestamp = 2,
		PlayerInfo = 3,
		Message = 32,
		PointDown = 33,
		PointMove = 34,
		PointUp = 35,
		Operation = 64
	}
	interface EventLike extends Array<any> {
		[index: number]: any;
		0: EventCodeLike;
		1: number;
		2: string | null;
	}
}

declare module agvplugin {
	class CoeLimitedPlugin implements agv.ExternalPlugin {
		name: string;
		onload(game: agv.GameLike, dataBus: unknown, gameContent: agv.GameContent): void;
		registerAllowedContent(name: string, application: { url: string }): void;
	}

	class AgvSupplementPlugin implements agv.ExternalPlugin {
		name: string;
		onload(game: agv.GameLike, dataBus: unknown, gameContent: agv.GameContent): void;
	}

	class InstanceStoragePlugin implements agv.ExternalPlugin {
		name: string;
		constructor(...args: any[]);
		onload(game: agv.GameLike): void;
	}
}
