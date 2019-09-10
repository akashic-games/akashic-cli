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
import {ContentDisplayOption} from "./organism/ContentDisplayOption";
import {ContentDisplayOptionContainer} from "./container/ContentDisplayOptionContainer";
import {ContentDisplayDialogContainer} from "./container/ContentDisplayDialogContainer";

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
				{
					(store.currentPlay && !store.appOptions.autoStart) ?
						<StartupScreenContainer
							operator={operator}
							startupScreenUiStore={store.startupScreenUiStore}
							argumentsTable={store.currentPlay.content.argumentsTable}
						/> :
						null
				}
				<div id="agvcontainer" style={{ visibility: "visible" }} ref={this._onRef} />
			</div>;
		}

		const sandboxConfig = store.currentLocalInstance.content.sandboxConfig || {};
		return <div id="whole" className={styles["whole"]}>
			<ToolBarContainer
				play={store.currentPlay}
				localInstance={store.currentLocalInstance}
				operator={operator}
				toolBarUiStore={store.toolBarUiStore}
				targetService={store.targetService}
			/>
			{
				store.toolBarUiStore.showsContentDisplayDialog ?
					<div className={styles["display-dialog"]}>
						<ContentDisplayDialogContainer
							toolBarUiStore={store.toolBarUiStore}
							operator={operator}
						/>
					</div> :
					null
			}
			<div id="agvcontainer" className={styles["main"] + " " + styles["centering"] } ref={this._onRef}>
				<ContentDisplayOptionContainer
					sandboxConfig={sandboxConfig}
					toolBarUiStore={store.toolBarUiStore}
					localInstance={store.currentLocalInstance}
				/>
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
		if (!elem) {
			return;
		}
		if (elem.firstChild) {
			elem.firstChild.appendChild(this.props.gameViewManager.getRootElement());
		} else {
			elem.appendChild(this.props.gameViewManager.getRootElement());
		}
	}
}
