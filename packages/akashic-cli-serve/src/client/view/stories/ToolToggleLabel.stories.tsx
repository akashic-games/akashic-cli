import { action } from "@storybook/addon-actions";
import * as React from "react";
import { ToolToggleLabel } from "../atom/ToolToggleLabel";

export default {
	title: "a-ToolToggleLabel"
};

export const Pushed = {
	render: () => (
		<ToolToggleLabel isPushed={true} onToggle={action("toggle")}>
			<i className="material-icons">zoom_in</i>
		</ToolToggleLabel>
	),

	name: "pushed"
};

export const NonPushed = {
	render: () => (
		<ToolToggleLabel isPushed={false} onToggle={action("toggle")}>
			<p>Foo</p>
		</ToolToggleLabel>
	),

	name: "non-pushed"
};
