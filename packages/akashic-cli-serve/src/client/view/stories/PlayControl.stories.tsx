import { action } from "@storybook/addon-actions";
import * as React from "react";
import { PlayControl } from "../molecule/PlayControl";

export default {
	title: "m-PlayControl"
};

export const Basic = {
	render: () => (
		<PlayControl
			makeProps={() => ({
				playbackRate: 1.5,
				isActivePausing: false,
				isActiveExists: true,
				onClickReset: action("reset"),
				onClickActivePause: action("active-pause"),
				onClickAddInstance: action("add-instance"),
				onClickStep: action("step")
			})}
		/>
	),

	name: "basic"
};

export const Pausing = {
	render: () => (
		<PlayControl
			makeProps={() => ({
				playbackRate: 1.5,
				isActivePausing: true,
				isActiveExists: true,
				onClickReset: action("reset"),
				onClickActivePause: action("active-pause"),
				onClickAddInstance: action("add-instance"),
				onClickStep: action("step")
			})}
		/>
	),

	name: "pausing"
};
