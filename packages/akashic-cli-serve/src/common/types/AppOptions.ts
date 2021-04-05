import { ServiceType } from "@akashic/akashic-cli-commons/lib/ServiceType";

export interface AppOptions {
	autoStart: boolean;
	verbose: boolean;
	proxyAudio: boolean;
	targetService: ServiceType;
	preserveDisconnected: boolean;
}
