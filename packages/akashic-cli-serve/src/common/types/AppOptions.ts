import { ServiceType } from "@akashic/akashic-cli-commons";

export interface AppOptions {
	autoStart: boolean;
	verbose: boolean;
	proxyAudio: boolean;
	targetService: ServiceType;
	preserveDisconnected: boolean;
}
