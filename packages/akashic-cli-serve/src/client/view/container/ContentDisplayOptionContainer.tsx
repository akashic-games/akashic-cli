import * as React from "react";
import { observer } from "mobx-react";
import { ContentDisplayOption } from "../organism/ContentDisplayOption";
import { ToolBarUiStore } from "../../store/ToolBarUiStore";
import { SandboxConfig } from "../../../common/types/SandboxConfig";
import { LocalInstanceEntity } from "../../store/LocalInstanceEntity";

export interface ContentDisplayOptionContainerProps {
	sandboxConfig: SandboxConfig;
	toolBarUiStore: ToolBarUiStore;
	localInstance: LocalInstanceEntity;
}

@observer
export class ContentDisplayOptionContainer extends React.Component<ContentDisplayOptionContainerProps, {}> {
	render(): React.ReactNode {
		const gameViewSize = this.props.localInstance.gameViewSize;
		return <ContentDisplayOption
			backgroundImage={this.props.sandboxConfig.backgroundImage}
			showsGridCanvas={this.props.toolBarUiStore.showsGridCanvas}
			showsBgImage={this.props.toolBarUiStore.showsBgImage}
			gameWidth={gameViewSize.width}
			gameHeight={gameViewSize.height}
		/>;
	}
}
