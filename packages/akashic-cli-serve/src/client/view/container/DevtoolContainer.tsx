import * as React from "react";
import { observer } from "mobx-react";
import { SandboxConfig} from "../../../common/types/SandboxConfig";
import { PlayEntity } from "../../store/PlayEntity";
import { DevtoolUiStore } from "../../store/DevtoolUiStore";
import { Operator } from "../../operator/Operator";
import { Devtool } from "../organism/Devtool";
import { ExternalPluginUiStore } from "../../store/ExternalPluginUiStore";

export interface DevtoolContainerProps {
	play: PlayEntity;
	operator: Operator;
	devtoolUiStore: DevtoolUiStore;
	externalPluginUiStore: ExternalPluginUiStore;
	sandboxConfig: SandboxConfig;
}

@observer
export class DevtoolContainer extends React.Component<DevtoolContainerProps, {}> {
	render(): React.ReactNode {
		const { play, operator, devtoolUiStore, externalPluginUiStore, sandboxConfig } = this.props;
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
				eventNames: Object.keys(sandboxConfig.events),
				eventEditContent: devtoolUiStore.eventEditContent,
				onClickSendEvent: operator.play.sendRegisteredEvent,
				onClickCopyEvent: operator.ui.copyRegisteredEventToEditor,
				onClickSendEditingEvent: operator.play.sendEditorEvent,
				onEventEditContentChanged: operator.ui.setEventEditContent
			}}
			instancesDevtoolProps={{
				instances: play.serverInstances.map(si => ({
					type: "active" as ("active" | "passive"),
					env: `server (runnerId: ${si.runnerId})`,
					playerId: null,
					name: null,
					isJoined: false,
					passedArgument: si.passedArgument
				})).concat(play.clientInstances.map(ci => ({
					type: (ci.isActive ? "active" : "passive") as ("active" | "passive"),
					env: ci.envInfo ? JSON.stringify(ci.envInfo) : null,
					playerId: ci.playerId,
					name: ci.name,
					isJoined: play.joinedPlayerTable.has(ci.playerId),
					passedArgument: ci.passedArgument
				}))),
				onClickAddInstance: operator.play.openNewClientInstance
			}}
			externalPluginsDevtoolProps={{
				childSessionContentUrl: externalPluginUiStore.contentUrl,
				childSessionParameters: externalPluginUiStore.sessionParameters,
				currentPlayId: externalPluginUiStore.currentPlayId,
				onChangeChildSessionContentUrl: operator.ui.setContentUrl,
				onChangeChildSessionParameters: operator.ui.setSessionParameters,
				onChangeCurrentPlayId: operator.ui.setCurrentPlayId,
				onClickCreateChildPlay: operator.createChildPlayAndSendEvents,
				onClickSuspendChildPlay: operator.suspendPlayAndSendEvents,
				playTree: devtoolUiStore.playTree
			}}
		/>;
	}
}

