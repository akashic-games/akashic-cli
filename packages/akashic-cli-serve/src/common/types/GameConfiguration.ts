export interface GameConfiguration {
	width: number;
	height: number;
	fps: number;
	main: string;
	operationPlugins?: any;
	assets?: any;
	environment?: {
		"sandbox-runtime"?: string;
	};
	globalScripts?: string[];
	moduleMainScripts?: {[key: string]: string};
}
