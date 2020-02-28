import { ContentLocatorData } from "./ContentLocatorData";
import { SandboxConfig } from "./SandboxConfig";
import { GameConfiguration } from "./GameConfiguration";

export interface ContentDesc {
	contentLocatorData: ContentLocatorData;
	sandboxConfig?: SandboxConfig;
	gameJson: GameConfiguration;
}
