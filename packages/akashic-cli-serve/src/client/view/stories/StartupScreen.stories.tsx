import { action } from "@storybook/addon-actions";
import { observable } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";
import { StartupScreen } from "../organism/StartupScreen";

const store = observable({
	joinsAutomatically: false,
	width: 280,
	editContent: "{ \"foo\": 100 }",
	argumentsTable: {
		"Start (difficulty: 3)": JSON.stringify([[32, 0, "test1"]], null, 2),
		"Start (difficulty: 10)": JSON.stringify([[32, 0, "test2"]], null, 2),
		Stop: JSON.stringify([[32, 0, "stop"]], null, 2),
		"foo (a very long long argument name example to test, woo hoo!)":
        JSON.stringify([[32, 0, "Long"]], null, 2)
	} as { [name: string]: string },
	selectedArgumentName: ""
});

const Box = (props: any): JSX.Element => {
	const style = {
		display: "flex",
		flexFlow: "row nowrap",
		justifyContent: "center",
		padding: 10,
		border: "1px dotted red"
	};
	return <div style={style}>{props.children}</div>;
};

const TestWithBehaviour = observer(() => (
	<Box>
		<StartupScreen
			listWidth={store.width}
			listMinWidth={200}
			onListResize={(w) => (store.width = w)}
			argumentsTable={store.argumentsTable}
			selectedArgumentName={store.selectedArgumentName}
			argumentEditContent={store.editContent}
			joinsAutomatically={store.joinsAutomatically}
			onSelectArgument={(name) => (
				(store.selectedArgumentName = name!),
				(store.editContent = store.argumentsTable[name!] || "")
			)}
			onArgumentsEditContentChanged={(v) => (store.editContent = v)}
			onChangeJoinsAutomatically={(v) => (store.joinsAutomatically = v)}
			onClickStart={action("start-content")}
		/>
	</Box>
));

export default {
	title: "m-StartupScreen"
};

export const Basic = {
	render: () => (
		<Box>
			<StartupScreen
				listWidth={250}
				listMinWidth={100}
				argumentsTable={{
					"Start (difficulty: 3)": "1",
					"Start (difficulty: 10)": "1",
					Stop: "1",
					"foo (a very long long argument name example to test, woo hoo!)": "1",
				}}
				selectedArgumentName={"Stop"}
				argumentEditContent={"[\"test\"]"}
				joinsAutomatically={false}
				onListResize={action("argument-list-resize")}
				onSelectArgument={action("select")}
				onArgumentsEditContentChanged={action("edit-content")}
				onChangeJoinsAutomatically={action("change-joins-auto")}
				onClickStart={action("start-content")}
			/>
		</Box>
	),
	name: "basic"
};

export const ManyArgumentsTable = {
	render: () => (
		<Box>
			<StartupScreen
				listWidth={250}
				listMinWidth={100}
				argumentsTable={{
					"Start (difficulty: 3)": "1",
					"Start (difficulty: 10)": "1",
					Stop: "1",
					"foo (a very long long argument name example to test, woo hoo!)": "1",
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
				selectedArgumentName={"Test 9"}
				argumentEditContent={"[\"test\"]"}
				joinsAutomatically={false}
				onListResize={action("argument-list-resize")}
				onSelectArgument={action("select")}
				onArgumentsEditContentChanged={action("edit-content")}
				onChangeJoinsAutomatically={action("change-joins-auto")}
				onClickStart={action("start-content")}
			/>
		</Box>
	),
	name: "many argumentsTable"
};

export const WithBehavior = {
	render: () => <TestWithBehaviour />,
	name: "with-behavior"
};
