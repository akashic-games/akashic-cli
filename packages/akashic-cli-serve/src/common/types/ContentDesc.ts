import type { GameConfiguration } from "@akashic/game-configuration";
import type { NormalizedSandboxConfiguration } from "@akashic/sandbox-configuration";
import type { ContentLocatorData } from "./ContentLocatorData.js";

export interface ContentDesc {
	contentLocatorData: ContentLocatorData;
	sandboxConfig?: NormalizedSandboxConfiguration;
	gameJson?: GameConfiguration;
	gameLocationKey?: string;
}
