declare module ae {
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
		width: number;
		height: number;
		parent?: ELike;
		_matrix?: MatrixLike;
		getMatrix(): MatrixLike;
	}

	interface RendererLike {
		begin(): void;
		end(): void;
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
		getViewSize(): {width: number, height: number};
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
		getGame(): ae.GameLike;
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
		onload: (game: GameLike, dataBus: any, gameContent: GameContent) => void;
	}

	interface TriggerLike {
		add: (...args: any[]) => void;
		addOnce: (...args: any[]) => void;
		remove: (...args: any[]) => void;
		fire: (arg: any) => void;
	}

	interface SceneLike {
	}

	interface GameExternalPluginsLike {
		coe?: any;
		send?: any;
		nico?: any;
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
		scene(): any;
		render(camera?: ae.CameraLike): void;
	}
}
