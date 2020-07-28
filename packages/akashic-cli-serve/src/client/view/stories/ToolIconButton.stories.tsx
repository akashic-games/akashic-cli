import * as React from "react";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { ToolIconButton } from "../atom/ToolIconButton";

const store = observable({
	pushed: false
});

const TestWithBehaviour = observer(() => (
	<ToolIconButton className="test" icon="face" pushed={store.pushed} pushedIcon="pause" onClick={v => (store.pushed = v)} />
));

storiesOf("a-ToolIconButton", module)
	.add("basic", () => (
		<ToolIconButton className="basic" icon="face" title="face!" onClick={action("clicked")} />
	))
	.add("disabled", () => (
		<ToolIconButton className="disabled" icon="face" disabled={true} onClick={action("should not fire")} />
	))
	.add("pushed", () => (
		<ToolIconButton className="pushed" icon="face" pushed={true} onClick={action("clicked")} />
	))
	.add("pushed&pushedIcon", () => (
		<ToolIconButton className="pushed-and-pushed-icon" icon="face" pushed={true} pushedIcon="pause" onClick={action("clicked")} />
	))
	.add("non-pushed&pushedIcon", () => (
		<ToolIconButton className="non-pushed-and-pushed-icon" icon="face" pushed={false} pushedIcon="pause" onClick={action("clicked")} />
	))
	.add("pushed&disabled", () => (
		<ToolIconButton className="pushed-and-disabled" icon="face" pushed={true} disabled={true} onClick={action("should not fire")} />
	))
	.add("with text", () => (
		<ToolIconButton className="with-text" icon="pause" onClick={action("clicked")}>Send to the play</ToolIconButton>
	))
	.add("with behavior (toggle)", () => <TestWithBehaviour />);
