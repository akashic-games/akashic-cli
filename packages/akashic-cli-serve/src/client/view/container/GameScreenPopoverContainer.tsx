import * as React from "react";
import { observer } from "mobx-react";
import { Operator } from "../../operator/Operator";
import { GameScreenPopover } from "../organism/GameScreenPopover";
import { ToolBarUiStore } from "../../store/ToolBarUiStore";

export interface GameScreenPopoverContainerProps {
	toolBarUiStore: ToolBarUiStore;
	operator: Operator;
}

@observer
export class GameScreenPopoverContainer extends React.Component<GameScreenPopoverContainerProps, {}> {
	render(): React.ReactNode {
		return <GameScreenPopover
			showsGridCanvas={this.props.toolBarUiStore.showsGridCanvas}
			showsBgImage={this.props.toolBarUiStore.showsBgImage}
			toggleShowBgImage={this.props.operator.ui.toggleShowBgImage}
			toggleShowGridCanvas={this.props.operator.ui.toggleShowGridCanvas}
		/>;
	}
}
