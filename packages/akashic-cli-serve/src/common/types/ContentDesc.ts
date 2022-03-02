import type { ContentLocatorData } from "./ContentLocatorData";
import type { GameConfiguration } from "./GameConfiguration";
import type { SandboxConfig } from "./SandboxConfig";

export interface ContentDesc {
	contentLocatorData: ContentLocatorData;
	sandboxConfig?: SandboxConfig;
	gameJson?: GameConfiguration;
	gameLocationKey?: string;
}
