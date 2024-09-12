import { action } from "@storybook/addon-actions";
import { observable } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";
import { ToolIconButton } from "../atom/ToolIconButton";

const store = observable({
	pushed: false
});

const TestWithBehaviour = observer(() => (
	<ToolIconButton
		className="test"
		icon="face"
		pushed={store.pushed}
		pushedIcon="pause"
		onClick={(v) => (store.pushed = v)}
	/>
));

export default {
	title: "a-ToolIconButton"
};

export const Basic = {
	render: () => (
		<ToolIconButton
			className="basic"
			icon="face"
			title="face!"
			onClick={action("clicked")}
		/>
	),

	name: "basic"
};

export const Disabled = {
	render: () => (
		<ToolIconButton
			className="disabled"
			icon="face"
			disabled={true}
			onClick={action("should not fire")}
		/>
	),

	name: "disabled"
};

export const Pushed = {
	render: () => (
		<ToolIconButton
			className="pushed"
			icon="face"
			pushed={true}
			onClick={action("clicked")}
		/>
	),

	name: "pushed"
};

export const PushedPushedIcon = {
	render: () => (
		<ToolIconButton
			className="pushed-and-pushed-icon"
			icon="face"
			pushed={true}
			pushedIcon="pause"
			onClick={action("clicked")}
		/>
	),

	name: "pushed&pushedIcon"
};

export const NonPushedPushedIcon = {
	render: () => (
		<ToolIconButton
			className="non-pushed-and-pushed-icon"
			icon="face"
			pushed={false}
			pushedIcon="pause"
			onClick={action("clicked")}
		/>
	),

	name: "non-pushed&pushedIcon"
};

export const PushedDisabled = {
	render: () => (
		<ToolIconButton
			className="pushed-and-disabled"
			icon="face"
			pushed={true}
			disabled={true}
			onClick={action("should not fire")}
		/>
	),

	name: "pushed&disabled"
};

export const WithText = {
	render: () => (
		<ToolIconButton
			className="with-text"
			icon="pause"
			onClick={action("clicked")}
		>
			Send to the play
		</ToolIconButton>
	),
	name: "with text"
};

export const WithBehaviorToggle = {
	render: () => <TestWithBehaviour />,
	name: "with behavior (toggle)"
};
