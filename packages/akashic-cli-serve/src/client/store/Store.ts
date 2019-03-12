import {observable, action} from "mobx";
import {Player} from "../../common/types/Player";
import {SandboxConfig} from "../../common/types/SandboxConfig";
import {PlayEntity} from "./PlayEntity";
import {PlayStore} from "./PlayStore";
import {LocalInstanceEntity} from "./LocalInstanceEntity";
import {DevtoolUiStore} from "./DevtoolUiStore";
import {ToolBarUiStore} from "./ToolBarUiStore";
import {storage} from "./storage";
import {StartupScreenUiStore} from "./StartupScreenUiStore";

export class Store {
	@observable playStore: PlayStore;
	@observable toolBarUiStore: ToolBarUiStore;
	@observable devtoolUiStore: DevtoolUiStore;
	@observable startupScreenUiStore: StartupScreenUiStore;
	@observable player: Player | null;

	@observable currentPlay: PlayEntity | null;
	@observable currentLocalInstance: LocalInstanceEntity | null;

	@observable sandboxConfig: SandboxConfig;
	@observable argumentsTable: { [name: string]: string };

	constructor() {
		this.playStore = new PlayStore();
		this.toolBarUiStore = new ToolBarUiStore();
		this.devtoolUiStore = new DevtoolUiStore();
		this.startupScreenUiStore = new StartupScreenUiStore();
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
