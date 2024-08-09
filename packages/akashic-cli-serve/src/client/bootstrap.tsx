import { configure as mobxConfigure } from "mobx";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { GameViewManager } from "./akashic/GameViewManager";
import { scriptHelper } from "./akashic/scriptHelper";
import { Operator } from "./operator/Operator";
import { storage } from "./store/storage";
import { Store } from "./store/Store";
import { App } from "./view/App";
import "./AkashicServeWindow";

mobxConfigure({ enforceActions: "observed" });

const gameViewManager = new GameViewManager({
	width: 0,
	height: 0
});
const store = new Store({ gameViewManager });
const operator = new Operator({ store, gameViewManager });
const pluginFuncs = {};

window.addEventListener("load", async () => {
	try {
		await operator.assertInitialized();
		ReactDOM.render(
			<App store={store} operator={operator} gameViewManager={gameViewManager} />,
			document.getElementById("container")
		);
		await operator.bootstrap();

		if (!window.opener && store.appOptions.experimentalOpen) {
			for (let i = 0; i < store.appOptions.experimentalOpen; i++) {
				operator.play.openNewClientInstance();
			}
			// 保存数,順序を保つため、指定数 window を開いたら localStorage に対象のデータが残っていてもクリアする。
			localStorage.removeItem("win_" + store.contentStore.defaultContent().gameLocationKey);
		}
	} catch (e) {
		console.error(e);
	}
});

window.addEventListener("unload", () => {
	if (!storage.experimentalIsChildWindow || !store.appOptions.experimentalOpen) return;

	const maxSaveCount = store.appOptions.experimentalOpen;
	if (maxSaveCount) {
		const name = "win_" + store.contentStore.defaultContent().gameLocationKey;
		const savedDataStr = localStorage.getItem(name);
		const saveData = savedDataStr ? JSON.parse(savedDataStr) : [];
		if (saveData.length >= maxSaveCount) return;

		const windowData = {
			width: window.innerWidth,
			height: window.innerHeight,
			x: window.screenX,
			y: window.screenY
		};
		saveData.push(windowData);
		localStorage.setItem(name, JSON.stringify(saveData));
	}
});

window.akashicServe = { gameViewManager, store, operator, pluginFuncs, scriptHelper };
(window as any).__testbed = window.akashicServe; // 互換性のためにのこしている。
