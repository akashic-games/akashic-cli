import * as React from "react";
import { fn } from "storybook/test";
import { PlayControl } from "../molecule/PlayControl.js";

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
				showsAddInstanceOptions: false,
				onClickAddInstanceOptions: fn(),
				onClickReset: fn(),
				onClickActivePause: fn(),
				onClickAddInstance: fn(),
				onClickAddSamePlayerInstance: fn(),
				onClickStep: fn()
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
				showsAddInstanceOptions: false,
				onClickAddInstanceOptions: fn(),
				onClickReset: fn(),
				onClickActivePause: fn(),
				onClickAddInstance: fn(),
				onClickAddSamePlayerInstance: fn(),
				onClickStep: fn()
			})}
		/>
	),
	name: "pausing"
};

export const ShowsAddInstanceOptions = {
	render: () => (
		<PlayControl
			makeProps={() => ({
				playbackRate: 1.5,
				isActivePausing: false,
				isActiveExists: true,
				showsAddInstanceOptions: true,
				onClickAddInstanceOptions: fn(),
				onClickReset: fn(),
				onClickActivePause: fn(),
				onClickAddInstance: fn(),
				onClickAddSamePlayerInstance: fn(),
				onClickStep: fn()
			})}
		/>
	),
	name: "shows-add-instance-options"
};
