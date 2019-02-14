import * as React from "react";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { EventsDevtool } from "../molecule/EventsDevtool";

const store = observable({
	shows: true,
	width: 280,
	editContent: `{ "foo": 100 }`,
	events: {
		"Start (difficulty: 3)": [[32, 0, "test1"]],
		"Start (difficulty: 10)": [[32, 0, "test2"]],
		"Stop": [[32, 0, "stop"]],
		"foo (a very long long event name example to test, woo hoo!)": [[32, 0, "Long"]]
	} as { [name: string]: any[] }
});

const TestWithBehaviour = observer(() => (
	<EventsDevtool
		showsEventList={store.shows}
		eventListWidth={store.width}
		eventListMinWidth={200}
		onEventListResize={w => (store.width = w)}
		eventNames={Object.keys(store.events)}
		eventEditContent={store.editContent}
		onToggleList={v => (store.shows = v)}
		onClickSendEvent={action("send")}
		onClickCopyEvent={name => (store.editContent = JSON.stringify(store.events[name]))}
		onClickSendEditingEvent={action("send-edit")}
		onEventEditContentChanged={v => (store.editContent = v)} />
));

storiesOf("m-EventsDevtool", module)
	.add("basic", () => (
		<EventsDevtool
			showsEventList={true}
			eventListWidth={250}
			eventListMinWidth={100}
			eventNames={[
				"Start (difficulty: 3)",
				"Start (difficulty: 10)",
				"Stop",
				"foo (a very long long event name example to test, woo hoo!)"
			]}
			eventEditContent={`["test"]`}
			onToggleList={action("toggle-list")}
			onEventListResize={action("event-list-resize")}
			onClickSendEvent={action("send")}
			onClickCopyEvent={action("copy")}
			onClickSendEditingEvent={action("send-edit")}
			onEventEditContentChanged={action("edit-content")} />
	))
	.add("many events", () => (
		<EventsDevtool
			showsEventList={true}
			eventListWidth={250}
			eventListMinWidth={100}
			eventNames={[
				"Start (difficulty: 3)",
				"Start (difficulty: 10)",
				"Stop",
				"foo (a very long long event name example to test, woo hoo!)",
				"Test 1",
				"Test 2",
				"Test 3",
				"Test 4",
				"Test 5",
				"Test 6",
				"Test 7",
				"Test 8",
				"Test 9",
				"Test 10",
				"Test 11",
				"Test 12",
				"Test 13",
				"Test 14",
				"Test 15",
				"Test 16",
				"Test 17",
				"Test 18",
				"Test 19",
				"Test 20",
				"Test 21",
				"Test 22",
				"Test 23",
				"Test 24",
				"Test 25",
				"Test 26",
				"Test 27",
				"Test 28",
				"Test 29",
				"Test 30",
				"Test 31",
				"Test 32"
			]}
			eventEditContent={`["test"]`}
			onToggleList={action("toggle-list")}
			onEventListResize={action("event-list-resize")}
			onClickSendEvent={action("send")}
			onClickCopyEvent={action("copy")}
			onClickSendEditingEvent={action("send-edit")}
			onEventEditContentChanged={action("edit-content")} />
	))
	.add("with-behavior", () => <TestWithBehaviour />);

