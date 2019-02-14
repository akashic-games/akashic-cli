import * as React from "react";
import { storiesOf } from "@storybook/react";
import { ToolControlGroup } from "../atom/ToolControlGroup";

storiesOf("a-ToolControlGroup", module)
	.add("basic", () => (
		<ToolControlGroup label="Foo">
			<p style={{ margin: 3, padding: 2, border: "1px solid gray" }}>Bar</p>
			<p style={{ margin: 3, padding: 2, border: "1px solid gray" }}>Zoo</p>
		</ToolControlGroup>
	));
