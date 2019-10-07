import { observable } from "mobx";
import { SandboxConfig } from "../../common/types/SandboxConfig";
import { ContentDesc } from "../../common/types/ContentDesc";
import { ClientContentLocator } from "../common/ClientContentLocator";

export class ContentEntity {
	readonly locator: ClientContentLocator;
	@observable sandboxConfig: SandboxConfig;
	@observable argumentsTable: { [name: string]: string };

	constructor(desc: ContentDesc) {
		this.locator = ClientContentLocator.instantiate(desc.contentLocatorData);
		this.sandboxConfig = desc.sandboxConfig || {};
		this.argumentsTable = {};
		const args = this.sandboxConfig.arguments || {};
		Object.keys(args).forEach(key => {
			this.argumentsTable[key] = JSON.stringify(args[key], null, 2);
		});
	}
}
