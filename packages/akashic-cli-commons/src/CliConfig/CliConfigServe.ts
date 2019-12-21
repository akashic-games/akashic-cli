export interface CliConfigServe {
	hostname: string;
	port: number;
	autoStart: boolean;
	verbose: boolean;
	targetService: string;
	debugPlaylog: string;
	debugUntrusted: boolean;
	debugProxyAudio: boolean;
	allowExternal: boolean;
	targetDirs: string[];
}
