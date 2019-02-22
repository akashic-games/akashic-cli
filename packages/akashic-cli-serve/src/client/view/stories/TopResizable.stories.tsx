import * as React from "react";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { TopResizable } from "../atom/TopResizable";

const store = observable({
	height: 200
});

const TestWithBehaviour = observer(() => (
	<div style={{ display: "flex", flexFlow: "column nowrap", padding: 20, height: 300 }}>
		<div style={{ flex: "1 1 auto", background: "#ddd" }}/>
		<TopResizable height={store.height} minHeight={50} onResize={(h) => ((console.log(h)), store.height = h)}>
			<p style={{ height: "100%", padding: 10, border: "1px solid gray" }}>Foo</p>
		</TopResizable>
	</div>
));

storiesOf("a-TopResizable", module)
	.add("basic", () => (
		<div style={{ padding: 20 }}>
			<TopResizable height={200} minHeight={50} onResize={action("resize")}>
				<p style={{ flex: "1 1 auto", padding: 10, border: "1px solid gray" }}>Foo</p>
			</TopResizable>
		</div>
	))
	.add("with-behavior", () => <TestWithBehaviour />);
