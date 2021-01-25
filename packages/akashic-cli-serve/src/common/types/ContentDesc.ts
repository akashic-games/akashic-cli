import { ContentLocatorData } from "./ContentLocatorData";
import { GameConfiguration } from "./GameConfiguration";
import { SandboxConfig } from "./SandboxConfig";

export interface ContentDesc {
	contentLocatorData: ContentLocatorData;
	sandboxConfig?: SandboxConfig;
	gameJson?: GameConfiguration;
}
