import { observable } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";
import { Popover } from "../atom/Popover";

const store = observable({
	shows: false
});

const TestWithBehaviour = observer(() => {
	const ref = React.useRef() as React.MutableRefObject<HTMLInputElement>;
	return (
		<div style={{ display: "inline-block" }} ref={ref}>
			<button onClick={() => (store.shows = !store.shows)}>toggle me</button>
			<Popover
				style={{ position: "absolute", minWidth: 200, padding: 2 }}
				caption="A Popover"
				shows={store.shows}
				onChangeShows={(shows) => (store.shows = shows)}
				outsideRef={ref}
			>
				<p style={{ flex: "1 1 auto", padding: 10, border: "1px solid gray" }}>
					Foo
				</p>
			</Popover>
		</div>
	);
});

export default {
	title: "a-Popover"
};

export const Basic = {
	render: () => (
		<Popover
			style={{ position: "absolute", minWidth: 200, padding: 20 }}
			caption="A Popover"
			shows={true}
			onChangeShows={() => {
				// do nothing
			}}
		>
			<p style={{ flex: "1 1 auto", padding: 10, border: "1px solid gray" }}>
				Foo
			</p>
		</Popover>
	),

	name: "basic"
};

export const WithBehavior = {
	render: () => <TestWithBehaviour />,
	name: "with-behavior"
};
