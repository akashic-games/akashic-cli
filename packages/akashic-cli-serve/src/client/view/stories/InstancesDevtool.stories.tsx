import { action } from "@storybook/addon-actions";
import * as React from "react";
import { InstancesDevtool } from "../molecule/InstancesDevtool";

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
			onClickAddInstance={action("add-instance")}
		/>
	),
	name: "basic"
};
