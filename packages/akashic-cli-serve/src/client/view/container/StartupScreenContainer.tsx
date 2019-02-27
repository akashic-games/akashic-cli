import * as React from "react";
import { observer } from "mobx-react";
import { Operator } from "../../operator/Operator";
import { StartupScreen } from "../organism/StartupScreen";
import { StartupScreenUiStore } from "../../store/StartupScreenUiStore";

export interface StartupScreenContainerProps {
	operator: Operator;
	startupScreenUiStore: StartupScreenUiStore;
	startupArguments: {[name: string]: any};
}

@observer
export class StartupScreenContainer extends React.Component<StartupScreenContainerProps, {}> {
	render(): React.ReactNode {
		const { operator, startupScreenUiStore, startupArguments } = this.props;
		return <StartupScreen
			showsEventList={startupScreenUiStore.showsStartupArgumentList}
			eventListWidth={startupScreenUiStore.startupArgumentListWidth}
			eventListMinWidth={150}
			onEventListResize={operator.ui.setStartupArgumentListWidth}
			onToggleList={operator.ui.toggleShowStartupArgumentList}
			eventNames={startupArguments ? Object.keys(startupArguments) : []}
			eventEditContent={startupScreenUiStore.startupArgumentEditContent}
			joinFlag={startupScreenUiStore.joinFlag}
			onClickCopyEvent={operator.ui.copyRegisteredStartupArgumentToEditor}
			onEventEditContentChanged={operator.ui.setStartupArgumentEditContent}
			onChangeJoinFlag={operator.ui.setJoinFlag}
			startContent={operator.startContent}
		/>;
	}
}
