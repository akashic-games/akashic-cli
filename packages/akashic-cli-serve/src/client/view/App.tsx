import { observer } from "mobx-react";
import * as React from "react";
import { GameViewManager } from "../akashic/GameViewManager";
import { Operator } from "../operator/Operator";
import { Store } from "../store/Store";
import * as styles from "./App.css";
import { FlexScrollY } from "./atom/FlexScrollY";
import { DevtoolContainer } from "./container/DevtoolContainer";
import { GameScreenContainer } from "./container/GameScreenContainer";
import { NotificationContainer } from "./container/NotificationContainer";
import { StartupScreenContainer } from "./container/StartupScreenContainer";
import { ToolBarContainer } from "./container/ToolbarContainer";
import "./global.css";

export interface AppProps {
	store: Store;
	operator: Operator;
	gameViewManager: GameViewManager;
}

@observer
export class App extends React.Component<AppProps, {}> {
	render(): JSX.Element {
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
		return <div id="whole" className={styles.whole}>
			<ToolBarContainer
				play={store.currentPlay}
				localInstance={store.currentLocalInstance}
				operator={operator}
				toolBarUiStore={store.toolBarUiStore}
				targetService={store.targetService}
			/>
			<FlexScrollY>
				<div id="agvcontainer" className={styles.main + " " + styles.centering }>
					<GameScreenContainer
						sandboxConfig={sandboxConfig}
						toolBarUiStore={store.toolBarUiStore}
						localInstance={store.currentLocalInstance}
						gameViewManager={this.props.gameViewManager}
						devtoolUiStore={store.devtoolUiStore}
						profilerStore={store.profilerStore}
						operator={this.props.operator}
					/>
				</div>
			</FlexScrollY>
			{
				store.toolBarUiStore.showsDevtools ?
					<div className={styles.devtools}>
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
