import * as React from "react";
import * as ReactDOM from "react-dom";
import { configure as mobxConfigure } from "mobx";
import { ClientContentLocator } from "./common/ClientContentLocator";
import { Store } from "./store/Store";
import { Operator } from "./operator/Operator";
import { GameViewManager } from "./akashic/GameViewManager";
import { App } from "./view/App";

mobxConfigure({ enforceActions: "observed" });

const gameViewManager = new GameViewManager({ width: 0, height: 0 });
const store = new Store();
const operator = new Operator({
	store,
	gameViewManager,
	contentLocator: store.contentLocator
});

window.addEventListener("load", async () => {
	try {
		await operator.bootstrap();
	} catch (e) {
		console.error(e);
	}
	ReactDOM.render(
		<App store={store} operator={operator} gameViewManager={gameViewManager} />,
		document.getElementById("container")
	);
});

(window as any).__testbed = { gameViewManager, store, operator };
