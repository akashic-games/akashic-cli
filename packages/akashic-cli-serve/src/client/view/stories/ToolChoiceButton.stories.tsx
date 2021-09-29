import * as React from "react";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { ToolChoiceButton } from "../atom/ToolChoiceButton";

const store = observable({
	pushedIndex: 0,
});

const TestWithBehaviour = observer(() => (
	<ToolChoiceButton
		items={[
			{ label: "Elem1", title: "title 1" },
			{ label: "Elem2" },
			{ label: "Third Element" },
			{ label: "Last One" },
		]}
		className="test"
		pushedIndex={store.pushedIndex}
		onClick={v => (store.pushedIndex = v)} />
));

storiesOf("a-ToolChoiceButton", module)
	.add("basic", () => (
		<ToolChoiceButton
			items={[
				{ label: "Elem1", title: "title 1" },
				{ label: "Elem2" },
				{ label: "Third Element" },
			]}
			className="test"
			onClick={action("onClick")} />
	))
	.add("all-disabled", () => (
		<ToolChoiceButton
			items={[
				{ label: "Elem1", title: "title 1" },
				{ label: "Elem2" },
				{ label: "Third Element" },
			]}
			disabled={true}
			pushedIndex={null}
			onClick={action("onClick")} />
	))
	.add("partial-disabled", () => (
		<ToolChoiceButton
			items={[
				{ label: "Elem1", title: "title 1" },
				{ label: "Elem2", disabled: true },
				{ label: "Third Element" },
			]}
			pushedIndex={0}
			onClick={action("onClick")} />
	))
	.add("with behavior (toggle)", () => <TestWithBehaviour />);
