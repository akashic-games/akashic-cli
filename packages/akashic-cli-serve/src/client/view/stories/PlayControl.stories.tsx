import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { PlayControl } from "../molecule/PlayControl";

storiesOf("m-PlayControl", module)
	.add("basic", () => (
		<PlayControl makeProps={() => ({
			playbackRate: 1.5,
			isActivePausing: false,
			isActiveExists: true,
			onClickReset: action("reset"),
			onClickActivePause: action("active-pause"),
			onClickAddInstance: action("add-instance"),
			onClickStep: action("step")

		})} />
	))
	.add("pausing", () => (
		<PlayControl makeProps={() => ({
			playbackRate: 1.5,
			isActivePausing: true,
			isActiveExists: true,
			onClickReset: action("reset"),
			onClickActivePause: action("active-pause"),
			onClickAddInstance: action("add-instance"),
			onClickStep: action("step")
		})} />
	));
