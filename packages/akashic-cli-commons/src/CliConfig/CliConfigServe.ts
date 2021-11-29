import { ServiceType } from "../ServiceType";

export interface CliConfigServe {
	hostname?: string;
	port?: number;
	autoStart?: boolean;
	verbose?: boolean;
	targetService?: ServiceType;
	debugPlaylog?: string;
	debugUntrusted?: boolean;
	debugProxyAudio?: boolean;
	allowExternal?: boolean;
	targetDirs?: string[];
	openBrowser?: boolean;
	preserveDisconnected?: boolean;
	watch?: boolean;
	experimentalOpen?: number;
	sslCert?: string;
	sslKey?: string;
	accessibleOrigin?: string;
}
