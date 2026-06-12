import type { GameViewManager } from "./akashic/GameViewManager.js";
import type { ScriptHelper } from "./akashic/scriptHelper.js";
import type { Operator } from "./operator/Operator.js";
import type { Store } from "./store/Store.js";

declare global {
	interface Window {
		akashicServe: {
			scriptHelper: ScriptHelper;
			gameViewManager: GameViewManager;
			store: Store;
			operator: Operator;
			pluginFuncs: Record<string, () => Function>;
		};
	}
}
