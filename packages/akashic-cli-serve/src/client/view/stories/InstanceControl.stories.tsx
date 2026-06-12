import * as React from "react";
import { fn } from "storybook/test";
import { InstanceControl } from "../molecule/InstanceControl.js";

export default {
	title: "m-InstanceControl"
};

export const Basic = {
	render: () => (
		<InstanceControl
			makeProps={() => ({
				currentTime: 2234 * 1000,
				duration: 7501 * 1000,
				resetTime: 1111 * 1000,
				isPaused: false,
				isProgressActive: false,
				onProgressChange: fn(),
				onProgressCommit: fn(),
				onClickPause: fn(),
				onClickFastForward: fn()
			})}
		/>
	),
	name: "basic"
};
