import * as React from "react";
import {observer} from "mobx-react";
import {GameViewManager} from "../akashic/GameViewManager";
import {Store} from "../store/Store";
import {Operator} from "../operator/Operator";
import {ToolBarContainer} from "./container/ToolbarContainer";
import {DevtoolContainer} from "./container/DevtoolContainer";
import "./global.css";
import * as styles from "./App.css";
import {StartupScreenContainer} from "./container/StartupScreenContainer";
import {NotificationContainer} from "./container/NotificationContainer";

export interface AppProps {
	store: Store;
	operator: Operator;
	gameViewManager: GameViewManager;
}

@observer
export class App extends React.Component<AppProps, {}> {
	render() {
		const { store, operator } = this.props;
		if (!store.currentLocalInstance) {
			return <div id="whole" className={styles["whole-dialog"]}>
				<StartupScreenContainer
					operator={operator}
					startupScreenUiStore={store.startupScreenUiStore}
					argumentsTable={store.currentPlay.content.argumentsTable}
				/>
			</div>;
		}
		const sandboxConfig = store.currentLocalInstance.content.sandboxConfig || {};
		return <div id="whole" className={styles["whole"]}>
			<ToolBarContainer
				play={store.currentPlay}
				localInstance={store.currentLocalInstance}
				operator={operator}
				toolBarUiStore={store.toolBarUiStore}
			/>
			<div className={styles["main"] + " " + styles["centering"] } ref={this._onRef}>
			{
				store.toolBarUiStore.showsBgImage ?
					<img src={sandboxConfig.backgroundImage} className={styles["bg-image"]}/> :
					null
			}
			</div>
			{
				store.toolBarUiStore.showsDevtools ?
					<div className={styles["devtools"]}>
						<DevtoolContainer
							play={store.currentPlay}
							operator={operator}
							devtoolUiStore={store.devtoolUiStore}
							sandboxConfig={sandboxConfig}
						/>
					</div> :
					null
			}
			<NotificationContainer
				operator={operator}
				notificationUiStore={store.notificationUiStore}
			/>
		</div>;
	}

	private _onRef = (elem: HTMLDivElement): void => {
		if (elem) {
			elem.appendChild(this.props.gameViewManager.getRootElement());
		}
	}
}
