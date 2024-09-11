import { action } from "@storybook/addon-actions";
import * as React from "react";
import { DevtoolSelectorBar } from "../atom/DevtoolSelectorBar";

export default {
	title: "a-DevtoolSelectorBar"
};

export const Basic = {
	render: () => (
		<DevtoolSelectorBar
			items={[
				{ name: "Instances", onClick: action("instance"), active: true },
				{ name: "Entities", onClick: action("entities") },
				{ name: "Events", onClick: action("events") },
				{ name: "Niconico", onClick: action("niconico"), warning: true }
			]}
		/>
	),
	name: "basic"
};

export const ActiveWarn = {
	render: () => (
		<DevtoolSelectorBar
			items={[
				{ name: "Niconico", onClick: action("niconico"), warning: true },
				{
					name: "Instances",
					onClick: action("instance"),
					active: true,
					warning: true
				}
			]}
		/>
	),
	name: "active&warn"
};
