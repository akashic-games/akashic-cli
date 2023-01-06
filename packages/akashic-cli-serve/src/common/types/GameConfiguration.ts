export interface GameConfiguration {
	width: number;
	height: number;
	fps: number;
	main: string;
	operationPlugins?: any;
	assets?: any;
	environment?: {
		"sandbox-runtime"?: string;
		nicolive?: NicoLiveConfig;
		// niconico は非推奨だが、互換性を保つために nicolive と並列に定義
		niconico?: NicoLiveConfig;
		external: any;
	};
	globalScripts?: string[];
	moduleMainScripts?: {[key: string]: string};
}

export interface NicoLiveConfig {
	supportedModes?: Array<"single" | "ranking" | "multi">;
	preferredSessionParameters?: PreferredSessionParameters;
}

export interface PreferredSessionParameters {
	totalTimeLimit?: number;
}
