import { observable } from "mobx";
import { SandboxConfig } from "../../common/types/SandboxConfig";
import { ContentDesc } from "../../common/types/ContentDesc";
import { ClientContentLocator } from "../common/ClientContentLocator";

export class ContentEntity {
	readonly locator: ClientContentLocator;
	@observable sandboxConfig: SandboxConfig;
	@observable argumentsTable: { [name: string]: string };

	constructor(desc: ContentDesc) {
		const args = desc.sandboxConfig.arguments;
		this.locator = new ClientContentLocator(desc.contentLocatorData);
		this.sandboxConfig = desc.sandboxConfig;
		this.argumentsTable = {};
		Object.keys(args).forEach(key => {
			this.argumentsTable[key] = JSON.stringify(args[key], null, 2);
		});
	}
}
