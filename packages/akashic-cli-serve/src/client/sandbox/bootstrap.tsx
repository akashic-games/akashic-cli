import { configure as mobxConfigure } from "mobx";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { GameViewManager } from "../akashic/GameViewManager.js";
import { scriptHelper } from "../akashic/scriptHelper.js";
import { queryParameters as query } from "../common/queryParameters.js";
import { Operator } from "./operator/Operator.js";
import { Store } from "./store/Store.js";
import { App } from "./view/App.js";

mobxConfigure({ enforceActions: "observed" });
const pluginFuncs = {};

const gameViewManager = new GameViewManager({
	width: 0,
	height: 0
});
const store = new Store({ gameViewManager, contentId: (query.id != null) ? query.id : "0" });
const operator = new Operator({ store, gameViewManager });

window.addEventListener("load", async () => {
	try {
		await operator.assertInitialized();

		for (const fontFamily of store.appOptions.fontFamilies) {
			await document.fonts.load(`16px '${fontFamily}'`);
		}

		ReactDOM.render(
			<App store={store} operator={operator} gameViewManager={gameViewManager} />,
			document.getElementById("container")
		);

		await operator.bootstrap();
	} catch (e) {
		console.error(e);
	}
});

window.akashicServe = { gameViewManager, store: store as any, operator: operator as any, pluginFuncs, scriptHelper };
(window as any).__testbed = window.akashicServe; // 互換性のためにのこしている。
