import { action } from "@storybook/addon-actions";
import { observable } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";
import { RightResizable } from "../atom/RightResizable";

const store = observable({
	width: 200
});

const TestWithBehaviour = observer(() => (
	<div
		style={{ display: "flex", flexFlow: "row nowrap", padding: 20, width: 300 }}
	>
		<RightResizable
			width={store.width}
			minWidth={50}
			onResize={(w) => (console.log(w), (store.width = w))}
		>
			<p
				style={{
					boxSizing: "border-box",
					width: "100%",
					padding: 10,
					border: "1px solid gray"
				}}
			>
        Foo
			</p>
		</RightResizable>
		<div style={{ flex: "1 1 auto", background: "#ddd" }} />
	</div>
));

export default {
	title: "a-RightResizable"
};

export const Basic = {
	render: () => (
		<div style={{ padding: 20 }}>
			<RightResizable width={200} minWidth={50} onResize={action("resize")}>
				<p style={{ flex: "1 1 auto", padding: 10, border: "1px solid gray" }}>
          Foo
				</p>
			</RightResizable>
		</div>
	),

	name: "basic"
};

export const WithBehavior = {
	render: () => <TestWithBehaviour />,
	name: "with-behavior"
};
