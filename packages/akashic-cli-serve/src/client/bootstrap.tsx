import * as React from "react";
import * as ReactDOM from "react-dom";
import { configure as mobxConfigure } from "mobx";
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
	contentUrl: window.location.origin + "/config/content.raw.json",
	clientContentUrl: "/config/content.json"  // ここで渡したパスはPlayのclientContentUrlとしてサーバーに記録され全クライアントでそのパスが使われるので、絶対パスではなくルートパスを渡す。
});
var p = operator.bootstrap()
	.catch(e => console.error(e));

window.addEventListener("load", async () => {
	await p;
	ReactDOM.render(
		<App store={store} operator={operator} gameViewManager={gameViewManager} />,
		document.getElementById("container")
	);
});

(window as any).__testbed = { gameViewManager, store, operator };
