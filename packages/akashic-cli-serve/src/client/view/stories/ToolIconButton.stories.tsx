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
	<ToolIconButton id="test" icon="face" pushed={store.pushed} pushedIcon="pause" onClick={v => (store.pushed = v)} />
));

storiesOf("a-ToolIconButton", module)
	.add("basic", () => (
		<ToolIconButton id="basic" icon="face" title="face!" onClick={action("clicked")} />
	))
	.add("disabled", () => (
		<ToolIconButton id="disabled" icon="face" disabled={true} onClick={action("should not fire")} />
	))
	.add("pushed", () => (
		<ToolIconButton id="pushed" icon="face" pushed={true} onClick={action("clicked")} />
	))
	.add("pushed&pushedIcon", () => (
		<ToolIconButton id="pushedAndPushedIcon" icon="face" pushed={true} pushedIcon="pause" onClick={action("clicked")} />
	))
	.add("non-pushed&pushedIcon", () => (
		<ToolIconButton id="nonPushedAndPushedIcon" icon="face" pushed={false} pushedIcon="pause" onClick={action("clicked")} />
	))
	.add("pushed&disabled", () => (
		<ToolIconButton id="pushedAndDisabled" icon="face" pushed={true} disabled={true} onClick={action("should not fire")} />
	))
	.add("with text", () => (
		<ToolIconButton id="withText" icon="pause" onClick={action("clicked")}>Send to the play</ToolIconButton>
	))
	.add("with behavior (toggle)", () => <TestWithBehaviour />);
