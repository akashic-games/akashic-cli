import { observer } from "mobx-react";
import * as React from "react";
import type { GameViewManager } from "../../akashic/GameViewManager";
import { FlexScrollY } from "../../view/atom/FlexScrollY";
import { GameViewFitter } from "../../view/atom/GameViewFitter";
import type { Operator } from "../operator/Operator";
import type { Store } from "../store/Store";
import styles from "./App.module.css";
import { DevtoolContainer } from "./container/DevtoolContainer";
import { GameScreenContainer } from "./container/GameScreenContainer";
import { NotificationContainer } from "./container/NotificationContainer";
import { ToolBarContainer } from "./container/ToolbarContainer";

export interface AppSandboxProps {
	store: Store;
	operator: Operator;
	gameViewManager: GameViewManager;
}

export const App = observer((props: AppSandboxProps) => {
	const { store, operator, gameViewManager } = props;

	if (!store.currentLocalInstance) {
		return (
			<div id="whole" className={styles["whole-dialog"]}>
				<div>Loading....</div>
			</div>
		);
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
			operator={operator.ui}
			notificationUiStore={store.notificationUiStore}
		/>
	</div>;
});
