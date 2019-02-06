import * as React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { ToolProgressBar } from "../atom/ToolProgressBar";

storiesOf("a-ToolProgressBar", module)
	.add("basic", () => (
		<ToolProgressBar width={200} max={100} value={64}
		                 onChange={action("change")} onCommit={action("commit")} />
	))
	.add("active", () => (
		<ToolProgressBar width={200} max={100} value={64} active />
	))
	.add("min", () => (
		<ToolProgressBar width={200} max={10} value={0} />
	))
	.add("max", () => (
		<ToolProgressBar width={200} max={100} value={100} />
	));
