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
			showsEventList={startupScreenUiStore.showsGameArgumentList}
			eventListWidth={startupScreenUiStore.gameArgumentListWidth}
			eventListMinWidth={150}
			onEventListResize={operator.ui.setGameArgumentListWidth}
			onToggleList={operator.ui.toggleShowGameArgumentList}
			eventNames={sandboxConfig.arguments ? Object.keys(sandboxConfig.arguments) : []}
			eventEditContent={startupScreenUiStore.gameArgumentEditContent}
			joinsAutomatically={startupScreenUiStore.joinsAutomatically}
			onClickCopyEvent={operator.ui.copyRegisteredGameArgumentToEditor}
			onEventEditContentChanged={operator.ui.setGameArgumentEditContent}
			onChangeJoinsAutomatically={operator.ui.setJoinsAutomatically}
			onClickStartContent={operator.startContent}
		/>;
	}
}
