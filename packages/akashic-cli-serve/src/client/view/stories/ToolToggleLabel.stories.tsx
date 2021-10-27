import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { ToolToggleLabel } from "../atom/ToolToggleLabel";

storiesOf("a-ToolToggleLabel", module)
	.add("pushed", () => (
		<ToolToggleLabel isPushed={true} onToggle={action("toggle")}>
			<i className="material-icons">zoom_in</i>
		</ToolToggleLabel>
	))
	.add("non-pushed", () => (
		<ToolToggleLabel isPushed={false} onToggle={action("toggle")}>
			<p>Foo</p>
		</ToolToggleLabel>
	));
