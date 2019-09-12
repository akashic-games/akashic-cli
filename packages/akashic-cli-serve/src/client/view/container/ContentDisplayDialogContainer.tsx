import * as React from "react";
import { observer } from "mobx-react";
import { ContentDisplayDialog } from "../organism/ContentDisplayDialog";
import { ToolBarUiStore } from "../../store/ToolBarUiStore";
import { Operator } from "../../operator/Operator";

export interface ContentDisplayDialogContainerProps {
	toolBarUiStore: ToolBarUiStore;
	operator: Operator;
}

@observer
export class ContentDisplayDialogContainer extends React.Component<ContentDisplayDialogContainerProps, {}> {
	render(): React.ReactNode {
		return <ContentDisplayDialog
			showsGridCanvas={this.props.toolBarUiStore.showsGridCanvas}
			showsBgImage={this.props.toolBarUiStore.showsBgImage}
			setShowBgImage={this.props.operator.ui.setShowBgImage}
			setShowGridCanvas={this.props.operator.ui.setShowGridCanvas}
		/>;
	}
}
