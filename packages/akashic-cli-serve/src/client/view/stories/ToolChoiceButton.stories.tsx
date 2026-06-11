import { observable } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";
import { fn } from "storybook/test";
import { ToolChoiceButton } from "../atom/ToolChoiceButton.js";

const store = observable({
	pushedIndex: 0
});

const TestWithBehaviour = observer(() => (
	<ToolChoiceButton
		items={[
			{ label: "Elem1", title: "title 1" },
			{ label: "Elem2" },
			{ label: "Third Element" },
			{ label: "Last One" }
		]}
		className="test"
		pushedIndex={store.pushedIndex}
		onClick={(v) => (store.pushedIndex = v)}
	/>
));

export default {
	title: "a-ToolChoiceButton"
};

export const Basic = {
	render: () => (
		<ToolChoiceButton
			items={[
				{ label: "Elem1", title: "title 1" },
				{ label: "Elem2" },
				{ label: "Third Element" }
			]}
			className="test"
			onClick={fn()}
		/>
	),
	name: "basic"
};

export const AllDisabled = {
	render: () => (
		<ToolChoiceButton
			items={[
				{ label: "Elem1", title: "title 1" },
				{ label: "Elem2" },
				{ label: "Third Element" }
			]}
			disabled={true}
			pushedIndex={null}
			onClick={fn()}
		/>
	),
	name: "all-disabled"
};

export const PartialDisabled = {
	render: () => (
		<ToolChoiceButton
			items={[
				{ label: "Elem1", title: "title 1" },
				{ label: "Elem2", disabled: true },
				{ label: "Third Element" }
			]}
			pushedIndex={0}
			onClick={fn()}
		/>
	),
	name: "partial-disabled"
};

export const WithBehaviorToggle = {
	render: () => <TestWithBehaviour />,
	name: "with behavior (toggle)"
};
