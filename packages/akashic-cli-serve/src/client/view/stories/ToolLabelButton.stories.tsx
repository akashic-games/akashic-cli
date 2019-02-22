import * as React from "react";
import { storiesOf } from "@storybook/react";
import { ToolLabelButton } from "../atom/ToolLabelButton";

storiesOf("a-ToolLabelButton", module)
	.add("basic", () => (
		<ToolLabelButton title="some title">selfId: 141l51g8bnag</ToolLabelButton>
	));
