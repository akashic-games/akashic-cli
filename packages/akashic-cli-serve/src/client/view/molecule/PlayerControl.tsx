import { observer } from "mobx-react";
import * as React from "react";
import { ToolControlGroup } from "../atom/ToolControlGroup";
import { ToolIconButton } from "../atom/ToolIconButton";
import { ToolLabel } from "../atom/ToolLabel";

export interface PlayerControlPropsData {
	selfId: string;
	isJoined: boolean;
	isJoinEnabled: boolean;
	onClickJoinLeave: (toJoin: boolean) => void;
}

export interface PlayerControlProps {
	makeProps: () => PlayerControlPropsData;
}

export const PlayerControl = observer(class PlayerControl extends React.Component<PlayerControlProps, {}> {
	render(): React.ReactNode {
		const props = this.props.makeProps();
		return <ToolControlGroup label="Player">
			<ToolLabel title="selfId">selfId: {props.selfId}</ToolLabel>
			<ToolIconButton
				className="external-ref_button_join-leave"
				icon="person_add"
				pushedIcon="person_outline"
				pushed={props.isJoined}
				disabled={!props.isJoinEnabled}
				title={`このインスタンスのプレイヤーの${props.isJoined ? "Leave" : "Join"}Eventを送信`}
				onClick={props.onClickJoinLeave}
			>
				{ props.isJoined ? "Leave Me" : "Join Me" }
			</ToolIconButton>
		</ToolControlGroup>;
	}
});

