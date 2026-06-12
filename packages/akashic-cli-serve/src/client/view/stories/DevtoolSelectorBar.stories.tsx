import * as React from "react";
import { fn } from "storybook/test";
import { DevtoolSelectorBar } from "../atom/DevtoolSelectorBar.js";

export default {
	title: "a-DevtoolSelectorBar"
};

export const Basic = {
	render: () => (
		<DevtoolSelectorBar
			items={[
				{ name: "Instances", onClick: fn(), active: true },
				{ name: "Entities", onClick: fn() },
				{ name: "Events", onClick: fn() },
				{ name: "Niconico", onClick: fn(), warning: true }
			]}
		/>
	),
	name: "basic"
};

export const ActiveWarn = {
	render: () => (
		<DevtoolSelectorBar
			items={[
				{ name: "Niconico", onClick: fn(), warning: true },
				{
					name: "Instances",
					onClick: fn(),
					active: true,
					warning: true
				}
			]}
		/>
	),
	name: "active&warn"
};
