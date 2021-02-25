import * as React from "react";
import * as ReactDOM from "react-dom";
import { configure as mobxConfigure } from "mobx";
import { RootFrameStore } from "./store/RootFrameStore";
import { RootOperator } from "./root/operator/RootOperator";
import { RootApp } from "./root/RootApp";

mobxConfigure({ enforceActions: "observed" });

const store = new RootFrameStore();
const operator = new RootOperator({ store });

window.addEventListener("load", async () => {
	try {
		await operator.assertInitialized();
		await operator.bootstrap();
		ReactDOM.render(
			<RootApp store={store} operator={operator} />,
			document.getElementById("container")
		);
	} catch (e) {
		console.error(e);
	}
});

(window as any).__testbed = { store, operator };
