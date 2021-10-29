import { observer } from "mobx-react";
import * as React from "react";
import { Operator } from "../../operator/Operator";
import { StartupScreenUiStore } from "../../store/StartupScreenUiStore";
import { StartupScreen } from "../organism/StartupScreen";

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
			listWidth={startupScreenUiStore.instanceArgumentListWidth}
			listMinWidth={150}
			onListResize={operator.ui.setInstanceArgumentListWidth}
			argumentsTable={argumentsTable}
			selectedArgumentName={startupScreenUiStore.selectedArgumentName}
			argumentEditContent={startupScreenUiStore.instanceArgumentEditContent}
			joinsAutomatically={startupScreenUiStore.joinsAutomatically}
			onSelectArgument={operator.ui.selectInstanceArguments}
			onArgumentsEditContentChanged={operator.ui.setInstanceArgumentEditContent}
			onChangeJoinsAutomatically={operator.ui.setJoinsAutomatically}
			onClickStart={this._handleClickStart}
		/>;
	}

	private _handleClickStart = (): void => {
		const { operator, startupScreenUiStore } = this.props;
		const argText = startupScreenUiStore.instanceArgumentEditContent;
		operator.startContent({
			joinsSelf: startupScreenUiStore.joinsAutomatically,
			instanceArgument: (argText !== "") ? JSON.parse(argText) : undefined
		});
	};
}
