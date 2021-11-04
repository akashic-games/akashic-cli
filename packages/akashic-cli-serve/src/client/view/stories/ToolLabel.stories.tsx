import { storiesOf } from "@storybook/react";
import * as React from "react";
import { ToolLabel } from "../atom/ToolLabel";

storiesOf("a-ToolLabel", module)
	.add("basic", () => (
		<ToolLabel title="some title">selfId: 141l51g8bnag</ToolLabel>
	));
