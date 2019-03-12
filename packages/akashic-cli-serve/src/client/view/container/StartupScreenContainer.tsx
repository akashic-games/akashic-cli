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
			argsListWidth={startupScreenUiStore.gameArgumentListWidth}
			argsListMinWidth={150}
			onArgsListResize={operator.ui.setGameArgumentListWidth}
			argumentsTable={argumentsTable}
			selectedArgumentsName={startupScreenUiStore.selectedArgumentsName}
			argumentsEditContent={startupScreenUiStore.gameArgumentEditContent}
			joinsAutomatically={startupScreenUiStore.joinsAutomatically}
			onSelectArguments={operator.ui.selectGameArguments}
			onArgumentsEditContentChanged={operator.ui.setGameArgumentEditContent}
			onChangeJoinsAutomatically={operator.ui.setJoinsAutomatically}
			onClickStartContent={operator.startContent}
		/>;
	}
}
