import * as React from "react";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { StartupScreen } from "../organism/StartupScreen";

const store = observable({
	joinsAutomatically: false,
	shows: true,
	width: 280,
	editContent: `{ "foo": 100 }`,
	argumentsTable: {
		"Start (difficulty: 3)": JSON.stringify([[32, 0, "test1"]], null, 2),
		"Start (difficulty: 10)": JSON.stringify([[32, 0, "test2"]], null, 2),
		"Stop": JSON.stringify([[32, 0, "stop"]], null, 2),
		"foo (a very long long event name example to test, woo hoo!)": JSON.stringify([[32, 0, "Long"]], null, 2)
	} as ({ [name: string]: string })
});

const Box = (props: any) => {
	const style = {
		display: "flex",
		flexFlow: "column nowrap",
		justifyContent: "stretch",
		margin: 10,
		// border: "1px dotted red",
		minWidth: 500,
		width: "80%",
		minHeight: 500 
	};
	return <div style={style}>{props.children}</div>;
};

const TestWithBehaviour = observer(() => (
	<Box>
		<StartupScreen
			showsEventList={store.shows}
			eventListWidth={store.width}
			eventListMinWidth={200}
			onEventListResize={w => (store.width = w)}
			argumentsTable={store.argumentsTable}
			eventEditContent={store.editContent}
			joinsAutomatically={store.joinsAutomatically}
			onToggleList={v => (store.shows = v)}
			onClickCopyEvent={name => (store.editContent = store.argumentsTable[name])}
			onEventEditContentChanged={v => (store.editContent = v)}
			onChangeJoinsAutomatically={v => (store.joinsAutomatically = v)} 
			onClickStartContent={action("start-content")} />
	</Box>
));

storiesOf("m-StartupScreen", module)
	.add("basic", () => (
		<Box>
			<StartupScreen
				showsEventList={true}
				eventListWidth={250}
				eventListMinWidth={100}
				argumentsTable={{
					"Start (difficulty: 3)": "1",
					"Start (difficulty: 10)": "1",
					"Stop": "1",
					"foo (a very long long event name example to test, woo hoo!)": "1"
				}}
				eventEditContent={`["test"]`}
				joinsAutomatically={false}
				onToggleList={action("toggle-list")}
				onEventListResize={action("event-list-resize")}
				onClickCopyEvent={action("copy")}
				onEventEditContentChanged={action("edit-content")}
				onChangeJoinsAutomatically={action("change-joins-auto")} 
				onClickStartContent={action("start-content")} />
		</Box>
	))
	.add("many argumentsTable", () => (
		<Box>
			<StartupScreen
				showsEventList={true}
				eventListWidth={250}
				eventListMinWidth={100}
				argumentsTable={{
					"Start (difficulty: 3)": "1",
					"Start (difficulty: 10)": "1",
					"Stop": "1",
					"foo (a very long long event name example to test, woo hoo!)": "1",
					"Test 1": "1",
					"Test 2": "1",
					"Test 3": "1",
					"Test 4": "1",
					"Test 5": "1",
					"Test 6": "1",
					"Test 7": "1",
					"Test 8": "1",
					"Test 9": "1",
					"Test 10": "1",
					"Test 11": "1",
					"Test 12": "1",
					"Test 13": "1",
					"Test 14": "1",
					"Test 15": "1",
					"Test 16": "1",
					"Test 17": "1",
					"Test 18": "1",
					"Test 19": "1",
					"Test 20": "1",
					"Test 21": "1",
					"Test 22": "1",
					"Test 23": "1",
					"Test 24": "1",
					"Test 25": "1",
					"Test 26": "1",
					"Test 27": "1",
					"Test 28": "1",
					"Test 29": "1",
					"Test 30": "1",
					"Test 31": "1",
					"Test 32": "1"
				}}
				eventEditContent={`["test"]`}
				joinsAutomatically={false}
				onToggleList={action("toggle-list")}
				onEventListResize={action("event-list-resize")}
				onClickCopyEvent={action("copy")}
				onEventEditContentChanged={action("edit-content")}
				onChangeJoinsAutomatically={action("change-joins-auto")} 
				onClickStartContent={action("start-content")} />
		</Box>
	))
	.add("with-behavior", () => <TestWithBehaviour />);


