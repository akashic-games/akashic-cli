import * as React from "react";
import { observer } from "mobx-react";
import { Operator } from "../../operator/Operator";
import { StartupScreen } from "../organism/StartupScreen";
import { StartupScreenUiStore } from "../../store/StartupScreenUiStore";
import { SandboxConfig } from "../../../common/types/SandboxConfig";

export interface StartupScreenContainerProps {
	operator: Operator;
	startupScreenUiStore: StartupScreenUiStore;
	sandboxConfig: SandboxConfig;
}

@observer
export class StartupScreenContainer extends React.Component<StartupScreenContainerProps, {}> {
	render(): React.ReactNode {
		const { operator, startupScreenUiStore, sandboxConfig } = this.props;
		return <StartupScreen
			showsEventList={startupScreenUiStore.showsStartupArgumentList}
			eventListWidth={startupScreenUiStore.startupArgumentListWidth}
			eventListMinWidth={150}
			onEventListResize={operator.ui.setStartupArgumentListWidth}
			onToggleList={operator.ui.toggleShowStartupArgumentList}
			eventNames={sandboxConfig.arguments ? Object.keys(sandboxConfig.arguments) : []}
			eventEditContent={startupScreenUiStore.startupArgumentEditContent}
			joinsAutomatically={startupScreenUiStore.joinsAutomatically}
			onClickCopyEvent={operator.ui.copyRegisteredStartupArgumentToEditor}
			onEventEditContentChanged={operator.ui.setStartupArgumentEditContent}
			onChangeJoinsAutomatically={operator.ui.setJoinsAutomatically}
			onClickStartContent={operator.startContent}
		/>;
	}
}
