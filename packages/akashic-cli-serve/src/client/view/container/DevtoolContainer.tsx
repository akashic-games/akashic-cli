import * as React from "react";
import { observer } from "mobx-react";
import { SandboxConfig} from "../../../common/types/SandboxConfig";
import { PlayEntity } from "../../store/PlayEntity";
import { DevtoolUiStore } from "../../store/DevtoolUiStore";
import { Operator } from "../../operator/Operator";
import { Devtool } from "../organism/Devtool";

export interface DevtoolContainerProps {
	play: PlayEntity;
	operator: Operator;
	devtoolUiStore: DevtoolUiStore;
	sandboxConfig: SandboxConfig;
}

@observer
export class DevtoolContainer extends React.Component<DevtoolContainerProps, {}> {
	render(): React.ReactNode {
		const { play, operator, devtoolUiStore, sandboxConfig } = this.props;
		return <Devtool
			height={devtoolUiStore.height}
			minHeight={200}
			onResizeHeight={operator.ui.setDevtoolHeight}
			activeDevtool={devtoolUiStore.activeDevtool as any /* TODO any 排除？ */}
			onSelectDevtool={operator.ui.setActiveDevtool}
			eventsDevtoolProps={{
				showsEventList: devtoolUiStore.showsEventList,
				eventListWidth: devtoolUiStore.eventListWidth,
				eventListMinWidth: 150,
				onEventListResize: operator.ui.setEventListWidth,
				onToggleList: operator.ui.toggleShowEventList,
				eventNames: sandboxConfig.events ? Object.keys(sandboxConfig.events) : [],
				eventEditContent: devtoolUiStore.eventEditContent,
				onClickSendEvent: operator.play.sendRegisteredEvent,
				onClickCopyEvent: operator.ui.copyRegisteredEventToEditor,
				onClickSendEditingEvent: operator.play.sendEditorEvent,
				onEventEditContentChanged: operator.ui.setEventEditContent
			}}
			instancesDevtoolProps={{
				instances: play.serverInstances.map(desc => ({
					type: "active" as ("active" | "passive"),
					env: `server (runnerId: ${desc.runnerId})`,
					playerId: null,
					name: null,
					isJoined: false
				})).concat(play.clientInstances.map(desc => ({
					type: (desc.isActive ? "active" : "passive") as ("active" | "passive"),
					env: desc.envInfo ? JSON.stringify(desc.envInfo) : null,
					playerId: desc.playerId,
					name: desc.name,
					isJoined: play.joinedPlayerTable.has(desc.playerId)
				}))),
				onClickAddInstance: operator.play.openNewClientInstance
			}}
		/>;
	}
}

