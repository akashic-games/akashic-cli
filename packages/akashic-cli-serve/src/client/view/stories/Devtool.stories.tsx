import * as React from "react";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { Devtool } from "../organism/Devtool";

const store = observable({
	devtoolsHeight: 300,
	activeDevtool: "Instances",
	showsEventList: true,
	eventListWidth: 280,
	eventEditContent: `["test": true]`
});

const TestWithBehaviour = observer(() => (
	<Devtool
		height={store.devtoolsHeight}
		minHeight={200}
		onResizeHeight={h => (store.devtoolsHeight = h)}
		activeDevtool={store.activeDevtool as any}
		onSelectDevtool={t => (store.activeDevtool = t)}
		eventsDevtoolProps={{
			showsEventList: store.showsEventList,
			eventListWidth: store.eventListWidth,
			eventListMinWidth: 200,
			onEventListResize: (w => (store.eventListWidth = w)),
			onToggleList: (v => (store.showsEventList = v)),
			eventNames: [
				"Foo",
				"Start",
				"Stop",
				"A very long event name to see how it will be shown on your display ya?"
			],
			eventEditContent: store.eventEditContent,
			onClickSendEvent: action("events:send"),
			onClickCopyEvent: action("events:copy"),
			onClickSendEditingEvent: action("events:send-edit"),
			onEventEditContentChanged: (v => (store.eventEditContent = v))
		}}
		instancesDevtoolProps={{
			instances: [
				{ type: "active", env: "(server)", playerId: null, name: null, isJoined: false },
				{ type: "passive", env: "Chrome", playerId: "1234567890", name: "player-1", isJoined: true },
				{ type: "passive", env: "Chrome", playerId: "aa0941jlta", name: "player-2", isJoined: false },
				{ type: "passive", env: "Firefox", playerId: "asfaiout", name: "player-3", isJoined: true }
			],
			onClickAddInstance: action("add-instance")
		}}
	/>
));

storiesOf("o-Devtool", module)
	.add("instances", () => (
		<Devtool
			height={300}
			minHeight={200}
			onResizeHeight={action("resize-height")}
			activeDevtool={"Instances"}
			onSelectDevtool={action("select-tool")}
			eventsDevtoolProps={{
				showsEventList: true,
				eventListWidth: 250,
				eventListMinWidth: 200,
				onEventListResize: action("events:list-resize"),
				onToggleList: action("events:toggle-list"),
				eventNames: [
					"Foo",
					"Start",
					"Stop",
					"A very long event name to see how it will be shown on your display ya?"
				],
				eventEditContent: `["test", 1]`,
				onClickSendEvent: action("events:send"),
				onClickCopyEvent: action("events:copy"),
				onClickSendEditingEvent: action("events:send-edit"),
				onEventEditContentChanged: action("events:edit")
			}}
			instancesDevtoolProps={{
				instances: [
					{ type: "active", env: "(server)", playerId: null, name: null, isJoined: false },
					{ type: "passive", env: "Chrome", playerId: "1234567890", name: "player-1", isJoined: false },
					{ type: "passive", env: "Chrome", playerId: "aa0941jlta", name: "player-2", isJoined: false },
					{ type: "passive", env: "Firefox", playerId: "asfaiout", name: "player-3", isJoined: false },
					{ type: "passive", env: "Firefox", playerId: "asfaiout1", name: "player-4", isJoined: false },
					{ type: "passive", env: "Firefox", playerId: "asfaiout2", name: "player-5", isJoined: false },
					{ type: "passive", env: "Firefox", playerId: "asfaiout3", name: "player-6", isJoined: false },
					{ type: "passive", env: "Firefox", playerId: "asfaiout4", name: "player-7", isJoined: false },
					{ type: "passive", env: "Firefox", playerId: "asfaiout5", name: "player-8", isJoined: false },
					{ type: "passive", env: "Firefox", playerId: "asfaiout6", name: "player-9", isJoined: false },
					{ type: "passive", env: "Firefox", playerId: "asfaiout7", name: "player-10", isJoined: false },
					{ type: "passive", env: "Firefox", playerId: "asfaiout8", name: "player-11", isJoined: false },
					{ type: "passive", env: "Firefox", playerId: "asfaiout9", name: "player-12", isJoined: false },
					{ type: "passive", env: "Firefox", playerId: "asfaiout10", name: "player-13", isJoined: false },
					{ type: "passive", env: "Firefox", playerId: "asfaiout11", name: "player-14", isJoined: false },
					{ type: "passive", env: "Firefox", playerId: "asfaiout12", name: "player-15", isJoined: false },
					{ type: "passive", env: "Firefox", playerId: "asfaiout13", name: "player-16", isJoined: false },
					{ type: "passive", env: "Firefox", playerId: "asfaiout14", name: "player-17", isJoined: false },
					{ type: "passive", env: "Firefox", playerId: "asfaiout15", name: "player-18", isJoined: false },
					{ type: "passive", env: "Firefox", playerId: "asfaiout16", name: "player-19", isJoined: false },
					{ type: "passive", env: "Firefox", playerId: "asfaiout17", name: "player-20", isJoined: false },
					{ type: "passive", env: "Firefox", playerId: "asfaiout18", name: "player-21", isJoined: false },
					{ type: "passive", env: "Firefox", playerId: "asfaiout19", name: "player-22", isJoined: false },
					{ type: "passive", env: "Firefox", playerId: "asfaiout20", name: "player-23", isJoined: false },
					{ type: "passive", env: "Firefox", playerId: "asfaiout21", name: "player-24", isJoined: false },
					{ type: "passive", env: "Firefox", playerId: "asfaiout22", name: "player-25", isJoined: false },
					{ type: "passive", env: "Firefox", playerId: "asfaiout23", name: "player-26", isJoined: false },
					{ type: "passive", env: "Firefox", playerId: "asfaiout24", name: "player-27", isJoined: false }
				],
				onClickAddInstance: action("add-instance")
			}}
		/>
	))
	.add("events", () => (
		<Devtool
			height={300}
			minHeight={200}
			onResizeHeight={action("resize-height")}
			activeDevtool={"Events"}
			onSelectDevtool={action("select-tool")}
			eventsDevtoolProps={{
				showsEventList: true,
				eventListWidth: 250,
				eventListMinWidth: 200,
				onEventListResize: action("events:list-resize"),
				onToggleList: action("events:toggle-list"),
				eventNames: [
					"Foo",
					"Start",
					"Stop",
					"A very long event name to see how it will be shown on your display ya?",
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
				],
				eventEditContent: `["test", 1]`,
				onClickSendEvent: action("events:send"),
				onClickCopyEvent: action("events:copy"),
				onClickSendEditingEvent: action("events:send-edit"),
				onEventEditContentChanged: action("events:edit")
			}}
			instancesDevtoolProps={{
				instances: [
					{ type: "active", env: "(server)", playerId: null, name: null, isJoined: false },
					{ type: "passive", env: "Chrome", playerId: "1234567890", name: "player-1", isJoined: false },
					{ type: "passive", env: "Chrome", playerId: "aa0941jlta", name: "player-2", isJoined: false },
					{ type: "passive", env: "Firefox", playerId: "asfaiout", name: "player-3", isJoined: false }
				],
				onClickAddInstance: action("add-instance")
			}}
		/>
	))
	.add("with-behavior", () => <TestWithBehaviour />);
