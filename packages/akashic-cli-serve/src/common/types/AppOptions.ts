import {ServiceType} from "./ServiceType";

export interface AppOptions {
	autoStart: boolean;
	verbose: boolean;
	proxyAudio: boolean;
	targetService: ServiceType;
}
