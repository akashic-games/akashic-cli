import { observer } from "mobx-react";
import * as React from "react";
import type { GameViewManager } from "../akashic/GameViewManager";
import type { ScreenSize } from "../common/types/ScreenSize";
import type { Operator } from "../operator/Operator";
import type { Store } from "../store/Store";
import * as styles from "./App.css";
import { FlexScrollY } from "./atom/FlexScrollY";
import { GameViewFitter } from "./atom/GameViewFitter";
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

	const setGameViewSize = React.useCallback((size: ScreenSize) => {
		store.setGameViewSize(size);
	}, [store]);

	React.useEffect(() => {
		if (!store.toolBarUiStore.fitsToScreen && store.currentLocalInstance?.intrinsicSize) {
			store.setGameViewSize(store.currentLocalInstance.intrinsicSize);
		}
	}, [store.toolBarUiStore.fitsToScreen, store.currentLocalInstance?.intrinsicSize]);

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
			play={store.currentPlay}
			localInstance={store.currentLocalInstance}
			operator={operator}
			toolBarUiStore={store.toolBarUiStore}
			targetService={store.targetService}
		/>
		{
			store.toolBarUiStore.fitsToScreen ?
				<GameViewFitter intrinsicSize={store.currentLocalInstance.intrinsicSize} setSize={setGameViewSize}>
					{ agvContainer }
				</GameViewFitter> :
				<FlexScrollY>{ agvContainer }</FlexScrollY>
		}
		{
			store.toolBarUiStore.showsDevtools ?
				<div className={styles.devtools}>
					<DevtoolContainer
						play={store.currentPlay}
						localInstance={store.currentLocalInstance}
						operator={operator}
						toolBarUiStore={store.toolBarUiStore}
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
});

