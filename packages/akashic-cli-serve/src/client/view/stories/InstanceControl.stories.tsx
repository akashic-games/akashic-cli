import * as React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { InstanceControl } from "../molecule/InstanceControl";

storiesOf("m-InstanceControl", module)
	.add("basic", () => (
		<InstanceControl makeProps={() => ({
			currentTime: 2234 * 1000,
			duration: 7501 * 1000,
			isPaused: false,
			isProgressActive: false,
			onProgressChange: action("progress-change"),
			onProgressCommit: action("progress-commit"),
			onClickPause: action("click-pause"),
			onClickFastForward: action("click-fast-forward")
		})} />
	));
