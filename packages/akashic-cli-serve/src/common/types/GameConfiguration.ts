export interface GameConfiguration {
	width: number;
	height: number;
	fps: number;
	main: string;
	operationPlugins?: any;
	assets?: any;
	environment?: {
		"sandbox-runtime"?: string;
		niconico?: NiconicoConfig;
		external: any;
	};
	globalScripts?: string[];
	moduleMainScripts?: {[key: string]: string};
}

export interface NiconicoConfig {
	supportedModes?: Array<"single" | "ranking" | "multi">;
	preferredSessionParameters?: {
		totalTimeLimit?: number;
	};
}
