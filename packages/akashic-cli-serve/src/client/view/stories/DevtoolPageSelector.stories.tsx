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
				items={[
					{ label: "foo", key: "foo", title: "foo", disabled: true },
					{ label: "bar", key: "bar", title: "bar" },
				]}
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
					{ label: "an opiton", key: "a", title: "an option" },
					{ label: "another option", key: "b", title: "another option" },
					{ label: "a ridculously long option that bleeds out the containing box", key: "c", title: "yet another option" },
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
			items={[
				{ label: "Ranking", key: "ranking", title: "Ranking" },
				{ label: "Comment", key: "comment", title: "Comment (Experimental)" },
				{ label: "Another Option", key: "another", title: "An option implemented in future" },
			]}
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
