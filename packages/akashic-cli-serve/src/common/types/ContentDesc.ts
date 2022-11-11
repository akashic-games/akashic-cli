import type { SandboxConfiguration } from "@akashic/sandbox-configuration";
import type { ContentLocatorData } from "./ContentLocatorData";
import type { GameConfiguration } from "./GameConfiguration";

export interface ContentDesc {
	contentLocatorData: ContentLocatorData;
	sandboxConfig?: SandboxConfiguration;
	gameJson?: GameConfiguration;
	gameLocationKey?: string;
}
