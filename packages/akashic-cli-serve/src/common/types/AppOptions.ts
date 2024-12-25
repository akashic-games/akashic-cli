import type { ServiceType } from "@akashic/akashic-cli-commons/lib/ServiceType.js";

export interface AppOptions {
	autoStart: boolean;
	verbose: boolean;
	proxyAudio: boolean;
	pauseActive: boolean;
	targetService: ServiceType;
	preserveDisconnected: boolean;
	runInIframe: boolean;
	experimentalOpen: number | null;
	disableFeatCheck: boolean;
}
