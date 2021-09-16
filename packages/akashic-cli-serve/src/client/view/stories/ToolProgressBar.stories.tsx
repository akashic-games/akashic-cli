import * as React from "react";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { ToolProgressBar } from "../atom/ToolProgressBar";

const store = observable({
	max: 100,
	value: 10,
});

const TestWithBehaviour = observer(() => (
	<>
		<div style={{ width: 300, padding: "0 14px", border: "1px solid red", resize: "horizontal", overflow: "auto" }}>
			<ToolProgressBar
				max={store.max}
				value={store.value}
				onChange={v => store.value = v}
				onCommit={v => store.value = v}
			/>
		</div>
		{ store.value } / { store.max }
	</>
));

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
	))
	.add("no-width", () => (
		<ToolProgressBar max={100} value={50} />
	))
	.add("with-behaviour", () => <TestWithBehaviour />);
