import * as React from "react";
import { fn } from "storybook/test";
import { PlayerControl } from "../molecule/PlayerControl.js";

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
				onClickJoinLeave: fn()
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
				onClickJoinLeave: fn()
			})}
		/>
	),
	name: "non-joined&disabled"
};
