import * as React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { DevtoolSelectorBar } from "../atom/DevtoolSelectorBar";

storiesOf("a-DevtoolSelectorBar", module)
	.add("basic", () => (
		<DevtoolSelectorBar items={[
			{ name: "Instances", onClick: action("instance"), active: true },
			{ name: "Entities", onClick: action("entities") },
			{ name: "Events", onClick: action("events") },
			{ name: "Niconico", onClick: action("niconico"), warning: true }
		]} />
	))
	.add("active&warn", () => (
		<DevtoolSelectorBar items={[
			{ name: "Niconico", onClick: action("niconico"), warning: true },
			{ name: "Instances", onClick: action("instance"), active: true, warning: true }
		]} />
	));
