import { action } from "@storybook/addon-actions";
import * as React from "react";
import { PlayerControl } from "../molecule/PlayerControl";

export default {
	title: "m-PlayerControl"
};

export const JoinedEnabled = {
	render: () => (
		<PlayerControl
			makeProps={() => ({
				selfId: "1234567asdfg",
				isJoined: true,
				isJoinEnabled: true,
				onClickJoinLeave: action("joinleave")
			})}
		/>
	),

	name: "joined&enabled"
};

export const NonJoinedDisabled = {
	render: () => (
		<PlayerControl
			makeProps={() => ({
				selfId: "1234567asdfg",
				isJoined: false,
				isJoinEnabled: false,
				onClickJoinLeave: action("joinleave")
			})}
		/>
	),

	name: "non-joined&disabled"
};
