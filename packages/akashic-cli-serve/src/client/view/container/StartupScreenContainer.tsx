import * as React from "react";
import { observer } from "mobx-react";
import { Operator } from "../../operator/Operator";
import { StartupScreen } from "../organism/StartupScreen";
import { StartupScreenUiStore } from "../../store/StartupScreenUiStore";

export interface StartupScreenContainerProps {
	operator: Operator;
	startupScreenUiStore: StartupScreenUiStore;
	argumentsTable: { [name: string]: string };
}

@observer
export class StartupScreenContainer extends React.Component<StartupScreenContainerProps, {}> {
	render(): React.ReactNode {
		const { operator, startupScreenUiStore, argumentsTable } = this.props;
		return <StartupScreen
			showsEventList={startupScreenUiStore.showsGameArgumentList}
			eventListWidth={startupScreenUiStore.gameArgumentListWidth}
			eventListMinWidth={150}
			onEventListResize={operator.ui.setGameArgumentListWidth}
			onToggleList={operator.ui.toggleShowGameArgumentList}
			argumentsTable={argumentsTable}
			eventEditContent={startupScreenUiStore.gameArgumentEditContent}
			joinsAutomatically={startupScreenUiStore.joinsAutomatically}
			onClickCopyEvent={operator.ui.copyRegisteredGameArgumentToEditor}
			onEventEditContentChanged={operator.ui.setGameArgumentEditContent}
			onChangeJoinsAutomatically={operator.ui.setJoinsAutomatically}
			onClickStartContent={operator.startContent}
		/>;
	}
}
