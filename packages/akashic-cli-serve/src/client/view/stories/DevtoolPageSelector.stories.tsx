import { action } from "@storybook/addon-actions";
import { observable } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";
import { DevtoolPageSelector } from "../atom/DevtoolPageSelector";

export default {
	title: "a-DevtoolPageSelector"
};

export const Basic = {
	name: "basic",
	render: () => (
		<div style={{
			border: "1px dotted silver",
			width: 100
		}}>
			<DevtoolPageSelector
				items={["foo", "bar"]}
				activeIndex={1}
				onChangeActive={action("event:change-active")}
			/>
		</div>
	)
};

export const Bleedout = {
	name: "bleedout",
	render: () => (
		<div style={{
			border: "1px dotted silver",
			width: 100
		}}>
			<DevtoolPageSelector
				items={[
					"an opiton",
					"another option",
					"a ridculously long option that bleeds out the containing box"
				]}
				activeIndex={1}
				onChangeActive={action("event:change-active")}
			/>
		</div>
	)
};

const store = observable({
	activeIndex: 0,
});

const TestWithBehavior = observer(() => (
	<div style={{
		border: "1px dotted silver",
		width: 200,
	}}>
		<DevtoolPageSelector
			items={["Ranking", "Comment", "Another Option"]}
			activeIndex={store.activeIndex}
			onChangeActive={idx => {
				store.activeIndex = idx;
			}}
		/>
	</div>
));

export const WithBehavior = {
	name: "with-behavior",
	render: () => <TestWithBehavior />
};
