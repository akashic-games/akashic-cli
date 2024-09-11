import { action } from "@storybook/addon-actions";
import * as React from "react";
import { InstanceControl } from "../molecule/InstanceControl";

export default {
	title: "m-InstanceControl",
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
				onProgressChange: action("progress-change"),
				onProgressCommit: action("progress-commit"),
				onClickPause: action("click-pause"),
				onClickFastForward: action("click-fast-forward"),
			})}
		/>
	),

	name: "basic",
};
