declare module agv {
	class AkashicGameView {
		constructor(...args: any[]);
		addContent(content: any): void;
		removeContent(content: any): void;
		setViewSize(width: number, height: number): void;
	}
	class GameContent {
		constructor(...args: any[]);
		pause(): void;
		resume(): void;
		setExecutionMode(mode: ExecutionMode): void;
		addContentLoadListener(contentLoadListener: any): void;
		addErrorListener(errorListener: ErrorListener): void;
		removeErrorListener(errorListener: ErrorListener): void;
	}
	interface PlaylogConfig {
		playId: string;
		executionMode: ExecutionMode;
		replayTargetTimeFunc: () => number;
		playlogServerUrl: string;
		playToken: string;
	}
	interface GameViewSharedObject {}
	interface GameConfig {
		contentUrl: string;
		player: {
			id: string;
			name?: string;
		};
		playConfig: PlaylogConfig;
		gameLoaderCustomizer: {
			platformCustomizer?: (platform: any, opts?: any) => void;
			createCustomAudioPlugins?: () => any[];
			createCustomAmflowClient?: () => any;
			overwriteEngineConfig?: string;
		};
	}
	interface ErrorListener {
		onError: (e: Error) => void;
	}
	enum ExecutionMode {
		Active, Passive, Replay
	}
}
