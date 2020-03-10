import { action, observable } from "mobx";
import { SandboxConfig } from "../../common/types/SandboxConfig";
import { ContentDesc } from "../../common/types/ContentDesc";
import { ClientContentLocator } from "../common/ClientContentLocator";
import { GameConfiguration } from "../../common/types/GameConfiguration";
import { DevtoolUiStore } from "./DevtoolUiStore";
import * as ApiClient from "../api/ApiClient";

export class ContentEntity {
	readonly locator: ClientContentLocator;
	readonly defaultTotalTimeLimit = 85;
	gameJson: GameConfiguration; // 現状では view に反映しないので observable はつけない
	@observable sandboxConfig: SandboxConfig;
	@observable argumentsTable: { [name: string]: string };
	@observable preferredTotalTimeLimit: number;

	constructor(desc: ContentDesc) {
		this.locator = ClientContentLocator.instantiate(desc.contentLocatorData);
		this.sandboxConfig = desc.sandboxConfig || {};
		this.argumentsTable = {};
		const args = this.sandboxConfig.arguments || {};
		this.gameJson = desc.gameJson;
		this.setTotalTimeLimit();
		Object.keys(args).forEach(key => {
			this.argumentsTable[key] = JSON.stringify(args[key], null, 2);
		});
	}

	@action
	setSandboxConfig(config: SandboxConfig): void {
		this.sandboxConfig = config;
	}

	async updateSandboxConfig(): Promise<void> {
		const res = await ApiClient.getContent(this.locator.contentId);
		this.setSandboxConfig(res.data.sandboxConfig || {});
	}

	@action
	setTotalTimeLimit(): void {
		const niconicoConfig = this.gameJson && this.gameJson.environment && this.gameJson.environment.niconico;
		this.preferredTotalTimeLimit =
			!niconicoConfig || !niconicoConfig.preferredSessionParameters || !niconicoConfig.preferredSessionParameters.totalTimeLimit
				? DevtoolUiStore.DEFAULT_TOTAL_TIME_LIMIT
				: niconicoConfig.preferredSessionParameters.totalTimeLimit;
	}
}
