import * as React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { PlayControl } from "../molecule/PlayControl";

storiesOf("m-PlayControl", module)
	.add("basic", () => (
		<PlayControl makeProps={() => ({
			playbackRate: 1.5,
			isActivePausing: false,
			onClickReset: action("reset"),
			onClickActivePause: action("active-pause"),
			onClickAddInstance: action("add-instance")
		})} />
	))
	.add("pausing", () => (
		<PlayControl makeProps={() => ({
			playbackRate: 1.5,
			isActivePausing: true,
			onClickReset: action("reset"),
			onClickActivePause: action("active-pause"),
			onClickAddInstance: action("add-instance")
		})} />
	));
