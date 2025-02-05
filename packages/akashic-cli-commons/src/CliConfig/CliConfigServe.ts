import type { ServiceType } from "../ServiceType.js";
import type { CliConfigFontDeclaration } from "./common.js";

export interface CliConfigServe {
	hostname?: string;
	port?: number;
	autoStart?: boolean;
	verbose?: boolean;
	targetService?: ServiceType;
	debugPlaylog?: string;
	debugUntrusted?: boolean;
	debugTrustedIframe?: boolean;
	debugProxyAudio?: boolean;
	debugPauseActive?: boolean;
	debugDisableFeatCheck?: boolean;
	allowExternal?: boolean;
	targetDirs?: string[];
	openBrowser?: boolean;
	preserveDisconnected?: boolean;
	watch?: boolean;
	experimentalOpen?: number;
	sslCert?: string;
	sslKey?: string;
	corsAllowOrigin?: string;
	fonts?: CliConfigFontDeclaration[];
}
