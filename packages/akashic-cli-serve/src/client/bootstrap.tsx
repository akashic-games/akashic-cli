import * as React from "react";
import * as ReactDOM from "react-dom";
import { configure as mobxConfigure } from "mobx";
import { Store } from "./store/Store";
import { Operator } from "./frame/operator/Operator";
import { GameViewManager } from "./akashic/GameViewManager";
import { App } from "./frame/App";

mobxConfigure({ enforceActions: "observed" });

const gameViewManager = new GameViewManager({
	width: 0,
	height: 0
});
const store = new Store();
const operator = new Operator({ store, gameViewManager });

window.addEventListener("load", async () => {
	try {
		await operator.assertInitialized();
		ReactDOM.render(
			<App store={store} operator={operator} gameViewManager={gameViewManager} />,
			document.getElementById("container")
		);
		operator.bootstrap();
	} catch (e) {
		console.error(e);
	}
});

(window as any).__testbed = { gameViewManager, store, operator };
