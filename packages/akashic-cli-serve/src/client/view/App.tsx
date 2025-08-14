import { observer } from "mobx-react";
import * as React from "react";
import type { GameViewManager } from "../akashic/GameViewManager";
import type { Operator } from "../operator/Operator";
import type { Store } from "../store/Store";
import styles from "./App.module.css";
import { FlexScrollY } from "./atom/FlexScrollY";
import { GameViewFitter } from "./atom/GameViewFitter";
import { DisconnectModal } from "./atom/ModalView";
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

export const App = observer(function App(props: AppProps): React.ReactElement<AppProps> {
	const { store, operator, gameViewManager } = props;

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

	const sandboxConfig = store.currentLocalInstance.content.sandboxConfig;
	const agvContainer = (
		<div id="agvcontainer" className={styles.main + " " + styles.centering}>
			<GameScreenContainer
				sandboxConfig={sandboxConfig}
				store={store}
				localInstance={store.currentLocalInstance}
				gameViewManager={gameViewManager}
				operator={operator}
			/>
		</div>
	);

	return <div id="whole" className={styles.whole}>
		<ToolBarContainer
			play={store.currentPlay!}
			localInstance={store.currentLocalInstance}
			operator={operator}
			toolBarUiStore={store.toolBarUiStore}
			targetService={store.targetService}
		/>
		{
			store.toolBarUiStore.fitsToScreen ?
				<GameViewFitter intrinsicSize={store.currentLocalInstance.intrinsicSize} setSize={operator.setGameViewSize}>
					{ agvContainer }
				</GameViewFitter> :
				<FlexScrollY>{ agvContainer }</FlexScrollY>
		}
		{
			store.toolBarUiStore.showsDevtools ?
				<div className={styles.devtools}>
					<DevtoolContainer
						play={store.currentPlay!}
						localInstance={store.currentLocalInstance}
						operator={operator}
						toolBarUiStore={store.toolBarUiStore}
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
		<DisconnectModal
			isOpen={store.isSocketDisconnect}
			message="Connection has been lost. Restart serve and reload browser."
		/>
	</div>;
});

