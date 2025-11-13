import type { GameConfiguration, NicoliveEnvironment, PreferredSessionParameters } from "@akashic/game-configuration";
import type { NormalizedSandboxConfiguration } from "@akashic/sandbox-configuration";
import { action, observable } from "mobx";
import type { ContentDesc } from "../../common/types/ContentDesc";
import { apiClient } from "../api/apiClientInstance";
import { ClientContentLocator } from "../common/ClientContentLocator";
import { DevtoolUiStore } from "./DevtoolUiStore";

export class ContentEntity {
	readonly locator: ClientContentLocator;
	gameJson: GameConfiguration | undefined; // 現状では view に反映しないので observable はつけない
	preferredSessionParameters: PreferredSessionParameters; // 現状では view に反映しないので observable はつけない
	gameLocationKey: string | undefined; // 仕様未定のため --experimental-open オプション以外で使用してはいけない
	@observable sandboxConfig: NormalizedSandboxConfiguration;
	@observable argumentsTable: { [name: string]: string };
	private _initializationWaiter: Promise<void>;

	constructor(desc: ContentDesc) {
		this.locator = ClientContentLocator.instantiate(desc.contentLocatorData);
		this.sandboxConfig = desc.sandboxConfig ?? null!;
		this.argumentsTable = {};
		const args = this.sandboxConfig?.arguments ?? {};
		this.gameJson = desc.gameJson;
		this.gameLocationKey = desc.gameLocationKey;
		this.preferredSessionParameters = {};
		this.calculatePreferredSessionParameters();
		Object.keys(args).forEach(key => {
			this.argumentsTable[key] = JSON.stringify(args[key], null, 2);
		});
		this._initializationWaiter = this._initialize();
	}

	assertInitialized(): Promise<void> {
		return this._initializationWaiter;
	}

	@action
	setSandboxConfig(config: NormalizedSandboxConfiguration): void {
		this.sandboxConfig = config;
	}

	async updateSandboxConfig(): Promise<void> {
		const res = await apiClient.getContent(this.locator.contentId!);
		this.setSandboxConfig(res.data.sandboxConfig!);
	}

	@action
	calculatePreferredSessionParameters(): void {
		const nicoliveConfig = this._getNicoLiveConfig();
		this.preferredSessionParameters = nicoliveConfig && nicoliveConfig.preferredSessionParameters || {};

		this.preferredSessionParameters.totalTimeLimit =
			!this.preferredSessionParameters || !this.preferredSessionParameters.totalTimeLimit
				? DevtoolUiStore.DEFAULT_TOTAL_TIME_LIMIT
				: this.preferredSessionParameters.totalTimeLimit;
	}

	private _getNicoLiveConfig(): NicoliveEnvironment | null {
		const environment = this.gameJson?.environment;
		if (environment === undefined) {
			return null;
		}
		// niconico は非推奨なので、nicolive の方を優先的に利用する
		return environment.nicolive ?? (environment.niconico ?? null);
	}

	private async _initialize(): Promise<void> {
		if (this.sandboxConfig != null) return;
		await this.updateSandboxConfig();
	}
}
