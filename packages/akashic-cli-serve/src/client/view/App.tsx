import * as React from "react";
import {observer} from "mobx-react";
import {GameViewManager} from "../akashic/GameViewManager";
import {Store} from "../store/Store";
import {Operator} from "../operator/Operator";
import {ToolBarContainer} from "./container/ToolbarContainer";
import {DevtoolContainer} from "./container/DevtoolContainer";
import "./global.css";
import * as styles from "./App.css";

export interface AppProps {
	store: Store;
	operator: Operator;
	gameViewManager: GameViewManager;
}

@observer
export class App extends React.Component<AppProps, {}> {
	render() {
		const { store, operator } = this.props;
		if (!store.currentPlay)
			return null;
		return <div id="whole" className={styles["whole"]}>
			<ToolBarContainer
				play={store.currentPlay}
				localInstance={store.currentLocalInstance}
				operator={operator}
				toolBarUiStore={store.toolBarUiStore}
			/>
			<div className={styles["main"] + " " + styles["centering"]} ref={this._onRef} />
			{
				store.toolBarUiStore.showsDevtools ?
					<div className={styles["devtools"]}>
						<DevtoolContainer
							play={store.currentPlay}
							operator={operator}
							devtoolUiStore={store.devtoolUiStore}
							sandboxConfig={store.sandboxConfig}
						/>
					</div> :
					null
			}
		</div>;
	}

	private _onRef = (elem: HTMLDivElement): void => {
		if (elem) {
			elem.appendChild(this.props.gameViewManager.getRootElement());
		}
	}
}
