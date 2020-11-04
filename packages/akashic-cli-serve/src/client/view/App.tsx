import * as React from "react";
import { observer } from "mobx-react";
import { GameViewManager } from "../akashic/GameViewManager";
import { Store } from "../store/Store";
import { Operator } from "../operator/Operator";
import { FlexScrollY } from "./atom/FlexScrollY";
import { ToolBarContainer } from "./container/ToolbarContainer";
import { DevtoolContainer } from "./container/DevtoolContainer";
import { StartupScreenContainer } from "./container/StartupScreenContainer";
import { NotificationContainer } from "./container/NotificationContainer";
import { GameScreenContainer } from "./container/GameScreenContainer";
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
			<FlexScrollY>
				<div id="agvcontainer" className={styles["main"] + " " + styles["centering"] }>
					<GameScreenContainer
						sandboxConfig={sandboxConfig}
						toolBarUiStore={store.toolBarUiStore}
						localInstance={store.currentLocalInstance}
						gameViewManager={this.props.gameViewManager}
						devtoolUiStore={store.devtoolUiStore}
						gameScreenUiStore={store.gameScreenUiStore}
						operator={this.props.operator}
					/>
				</div>
			</FlexScrollY>
			{
				store.toolBarUiStore.showsDevtools ?
					<div className={styles["devtools"]}>
						<DevtoolContainer
							play={store.currentPlay}
							operator={operator}
							devtoolUiStore={store.devtoolUiStore}
							sandboxConfig={sandboxConfig}
							targetService={store.targetService}
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
}
