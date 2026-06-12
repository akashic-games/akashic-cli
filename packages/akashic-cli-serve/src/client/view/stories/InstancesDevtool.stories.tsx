import * as React from "react";
import { fn } from "storybook/test";
import { InstancesDevtool } from "../molecule/InstancesDevtool.js";

export default {
	title: "m-InstancesDevtool"
};

export const Basic = {
	render: () => (
		<InstancesDevtool
			instances={[
				{
					type: "active",
					env: "(server)",
					playerId: null,
					name: null,
					isJoined: false
				},
				{
					type: "passive",
					env: "Chrome",
					playerId: "1234567890",
					name: "player-1",
					isJoined: true
				},
				{
					type: "passive",
					env: "Chrome",
					playerId: "aa0941jlta",
					name: "player-2",
					isJoined: false
				},
				{
					type: "passive",
					env: "Firefox",
					playerId: "asfaiout",
					name: "player-3",
					isJoined: false
				},
			]}
			onClickAddInstance={fn()}
		/>
	),
	name: "basic"
};
