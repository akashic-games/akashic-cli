import * as React from "react";
import { ToolControlGroup } from "../atom/ToolControlGroup";

export default {
	title: "a-ToolControlGroup",
};

export const Basic = {
	render: () => (
		<ToolControlGroup label="Foo">
			<p style={{ margin: 3, padding: 2, border: "1px solid gray" }}>Bar</p>
			<p style={{ margin: 3, padding: 2, border: "1px solid gray" }}>Zoo</p>
		</ToolControlGroup>
	),

	name: "basic",
};
