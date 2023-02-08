import type { ServiceType } from "@akashic/akashic-cli-commons/lib/ServiceType";

export interface AppOptions {
	autoStart: boolean;
	verbose: boolean;
	proxyAudio: boolean;
	pauseActive: boolean;
	targetService: ServiceType;
	preserveDisconnected: boolean;
	experimentalOpen: number | null;
}
