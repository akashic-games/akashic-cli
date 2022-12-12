import type { NormalizedSandboxConfiguration } from "@akashic/sandbox-configuration";
import type { ContentLocatorData } from "./ContentLocatorData";
import type { GameConfiguration } from "./GameConfiguration";

export interface ContentDesc {
	contentLocatorData: ContentLocatorData;
	sandboxConfig?: NormalizedSandboxConfiguration;
	gameJson?: GameConfiguration;
	gameLocationKey?: string;
}
