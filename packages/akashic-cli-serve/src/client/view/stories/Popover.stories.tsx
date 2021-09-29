import * as React from "react";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { storiesOf } from "@storybook/react";
// import { action } from "@storybook/addon-actions";
import { Popover } from "../atom/Popover";

const store = observable({
	shows: false
});

const TestWithBehaviour = observer(() => {
	const ref = React.useRef();
	return <div style={{ display: "inline-block" }} ref={ref}>
		<button onClick={() => (store.shows = !store.shows)}>toggle me</button>
		<Popover
			style={{ position: "absolute", minWidth: 200, padding: 2 }}
			caption="A Popover"
			shows={store.shows}
			onChangeShows={(shows) => (store.shows = shows)}
			outsideRef={ref}
		>
			<p style={{ flex: "1 1 auto", padding: 10, border: "1px solid gray" }}>Foo</p>
		</Popover>
	</div>
});

storiesOf("a-Popover", module)
	.add("basic", () => (
		<Popover
			style={{ position: "absolute", minWidth: 200, padding: 20 }}
			caption="A Popover"
			shows={true}
			onChangeShows={() => {}}
		>
			<p style={{ flex: "1 1 auto", padding: 10, border: "1px solid gray" }}>Foo</p>
		</Popover>
	))
	.add("with-behavior", () => <TestWithBehaviour />);

