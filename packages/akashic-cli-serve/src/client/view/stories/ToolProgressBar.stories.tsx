import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import { observable } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";
import { ToolProgressBar } from "../atom/ToolProgressBar";

const store = observable({
	max: 100,
	value: 10,
	subValue: 4,
	markerValue: 20,
});

const TestWithBehaviour = observer(() => (
	<>
		<div style={{ width: 300, display: "flex", flexFlow: "row nowrap", }}>
			subValue
			<div style={{ flex: "1 1 auto" }}>
				<ToolProgressBar
					max={store.max}
					value={store.subValue}
					onChange={v => store.subValue = v}
					onCommit={v => store.subValue = v}
				/>
			</div>
		</div>
		<div style={{ width: 300, display: "flex", flexFlow: "row nowrap", }}>
			max
			<div style={{ flex: "1 1 auto" }}>
				<ToolProgressBar
					max={200}
					value={store.max}
					onChange={v => store.max = v}
					onCommit={v => store.max = v}
				/>
			</div>
		</div>
		<div style={{ width: 300, display: "flex", flexFlow: "row nowrap", }}>
			markerValue
			<div style={{ flex: "1 1 auto" }}>
				<ToolProgressBar
					max={store.max}
					value={store.markerValue}
					onChange={v => store.markerValue = v}
					onCommit={v => store.markerValue = v}
				/>
			</div>
		</div>
		<div style={{ width: 300, padding: "0 14px", border: "1px solid red", resize: "horizontal", overflow: "auto" }}>
			<ToolProgressBar
				max={store.max}
				value={store.value}
				subValue={store.subValue}
				markerValue={store.markerValue}
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
	.add("sub/marker", () => (
		<ToolProgressBar width={200} max={100} value={30} subValue={50} markerValue={70} />
	))
	.add("with-behaviour", () => <TestWithBehaviour />);
