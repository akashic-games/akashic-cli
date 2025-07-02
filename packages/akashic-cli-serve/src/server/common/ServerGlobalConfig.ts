import type { ServiceType } from "@akashic/akashic-cli-commons/lib/ServiceType.js";

export interface ServerGlobalConfig {
	hostname: string;
	port: number;
	useGivenHostname: boolean; // サーバー起動時にhostnameオプションが指定されたかどうか
	useGivenPort: boolean; // サーバー起動時にportオプションが指定されたかどうか
	autoStart: boolean;
	verbose: boolean;
	untrusted: boolean; // 簡易対応。究極的にはコンテンツごとに指定されるべき値
	runInIframe: boolean;
	proxyAudio: boolean;
	pauseActive: boolean;
	targetService: ServiceType;
	allowExternal: boolean;
	preserveDisconnected: boolean;
	experimentalOpen: number | null;
	protocol: string;
	disableFeatCheck: boolean;
	fontFamilies: string[];
}

export const DEFAULT_HOSTNAME = "localhost";
export const DEFAULT_PORT = 3300;

export const serverGlobalConfig: ServerGlobalConfig = {
	hostname: DEFAULT_HOSTNAME,
	port: DEFAULT_PORT,
	useGivenHostname: false,
	useGivenPort: false,
	autoStart: true,
	verbose: false,
	untrusted: false,
	runInIframe: false,
	proxyAudio: false,
	pauseActive: false,
	targetService: "none",
	allowExternal: false,
	preserveDisconnected: false,
	experimentalOpen: null,
	protocol: "http",
	disableFeatCheck: false,
	fontFamilies: [],
};
