import * as React from "react";
import { fn } from "storybook/test";
import { ToolToggleLabel } from "../atom/ToolToggleLabel.js";

export default {
	title: "a-ToolToggleLabel"
};

export const Pushed = {
	render: () => (
		<ToolToggleLabel isPushed={true} onToggle={fn()}>
			<i className="material-icons">zoom_in</i>
		</ToolToggleLabel>
	),
	name: "pushed"
};

export const NonPushed = {
	render: () => (
		<ToolToggleLabel isPushed={false} onToggle={fn()}>
			<p>Foo</p>
		</ToolToggleLabel>
	),
	name: "non-pushed"
};
