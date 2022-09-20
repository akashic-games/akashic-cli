import type { GameViewManager } from "./akashic/GameViewManager";
import type { ScriptHelper } from "./akashic/scriptHelper";
import type { Operator } from "./operator/Operator";
import type { Store } from "./store/Store";

export interface AkashicServeWindow extends Window {
	akashicServe: {
		scriptHelper: ScriptHelper;
		gameViewManager: GameViewManager;
		store: Store;
		operator: Operator;
		pluginFuncs: {};
	};
}
