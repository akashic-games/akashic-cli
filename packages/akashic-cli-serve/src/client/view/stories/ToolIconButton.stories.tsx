import { observable } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";
import { fn } from "storybook/test";
import { ToolIconButton } from "../atom/ToolIconButton.js";

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
			onClick={fn()}
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
			onClick={fn()}
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
			onClick={fn()}
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
			onClick={fn()}
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
			onClick={fn()}
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
			onClick={fn()}
		/>
	),

	name: "pushed&disabled"
};

export const WithText = {
	render: () => (
		<ToolIconButton
			className="with-text"
			icon="pause"
			onClick={fn()}
		>
			Send to the play
		</ToolIconButton>
	),
	name: "with text"
};

export const WithSplitButton = {
	render: () => (
		<ToolIconButton
			className="with-split-button"
			icon="face"
			title="face!"
			onClick={fn()}
			splitButtonProps={{
				menuItems: [
					{ label: "First", icon: "face", tooltip: "face!", onClick: fn() },
					{ label: "Second", onClick: fn() }
				],
				showMenu: true,
				onToggleMenu: fn()
			}}
		/>
	),
	name: "with split button"
};

export const WithBehaviorToggle = {
	render: () => <TestWithBehaviour />,
	name: "with behavior (toggle)"
};
