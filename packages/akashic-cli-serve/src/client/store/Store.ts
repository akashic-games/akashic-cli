import {observable, action} from "mobx";
import * as queryString from "query-string";
import {Player} from "../../common/types/Player";
import {SandboxConfig} from "../../common/types/SandboxConfig";
import {PlayEntity} from "./PlayEntity";
import {PlayStore} from "./PlayStore";
import {LocalInstanceEntity} from "./LocalInstanceEntity";
import {DevtoolUiStore} from "./DevtoolUiStore";
import {ToolBarUiStore} from "./ToolBarUiStore";
import {storage} from "./storage";
import {StartupScreenUiStore} from "./StartupScreenUiStore";
import {ExternalPluginUiStore} from "./ExternalPluginUiStore";

export class Store {
	@observable playStore: PlayStore;
	@observable toolBarUiStore: ToolBarUiStore;
	@observable devtoolUiStore: DevtoolUiStore;
	@observable startupScreenUiStore: StartupScreenUiStore;
	@observable externalPluginUiStore: ExternalPluginUiStore;
	@observable player: Player | null;
	@observable contentId: number; // 多分storage辺りに置く方がよさそうだが一旦動かすこと優先でここに置いておく

	@observable currentPlay: PlayEntity | null;
	@observable currentLocalInstance: LocalInstanceEntity | null;

	@observable sandboxConfig: SandboxConfig;
	@observable argumentsTable: { [name: string]: string };

	constructor() {
		this.contentId = 0;
		const query = queryString.parse(window.location.search);
		if (query.id) {
			this.contentId = parseInt(query.id, 10);
		}
		this.playStore = new PlayStore();
		this.toolBarUiStore = new ToolBarUiStore();
		this.devtoolUiStore = new DevtoolUiStore();
		this.startupScreenUiStore = new StartupScreenUiStore();
		this.externalPluginUiStore = new ExternalPluginUiStore();
		this.player = { id: storage.data.playerId, name: storage.data.playerName };
		this.currentPlay = null;
		this.currentLocalInstance = null;
		this.sandboxConfig = null;
		this.argumentsTable = null;
	}

	@action
	setCurrentLocalInstance(instance: LocalInstanceEntity): void {
		this.currentLocalInstance = instance;
	}

	@action
	setCurrentPlay(play: PlayEntity): void {
		this.currentPlay = play;
	}

	@action
	setSandboxConfig(cfg: SandboxConfig): void {
		this.sandboxConfig = cfg;

		// mobx の reaction として書くべき？
		if (cfg.arguments) {
			const args = cfg.arguments;
			this.argumentsTable = Object.keys(args).reduce((acc, key) => {
				acc[key.replace(/^\</, "\\<")] = JSON.stringify(args[key], null, 2);
				return acc;
			}, {} as { [name: string]: string });
		}
	}
}
