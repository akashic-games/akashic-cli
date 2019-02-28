declare module agv {
	class AkashicGameView {
		constructor(...args: any[]);
		addContent(content: any): void;
		removeContent(content: any): void;
		setViewSize(width: number, height: number): void;
		registerExternalPlugin(plugin: ExternalPlugin): void;
	}
	class GameContent {
		constructor(...args: any[]);
		pause(): void;
		resume(): void;
		setExecutionMode(mode: ExecutionMode): void;
		addContentLoadListener(contentLoadListener: any): void;
		addErrorListener(errorListener: ErrorListener): void;
		removeErrorListener(errorListener: ErrorListener): void;
		getGameVars(propertyName: string, listener: (vars: any) => void): void;
		getGame(): GameLike;
		onExternalPluginRegister: TriggerLike; // NOTE: 拡張
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
	interface GameExternalPluginsLike {
		coe?: any;
	}
	interface GameLike {
		external: GameExternalPluginsLike;
	}
	enum ExecutionMode {
		Active, Passive, Replay
	}
}
