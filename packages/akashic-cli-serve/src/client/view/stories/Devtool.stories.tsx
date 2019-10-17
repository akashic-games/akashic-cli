import * as React from "react";
import { observable, ObservableMap } from "mobx";
import { observer } from "mobx-react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { EDumpItem } from "../../akashic/EDumpItem";
import { Devtool } from "../organism/Devtool";

const store = observable({
	devtoolsHeight: 300,
	activeDevtool: "EntityTree",
	showsEventList: true,
	eventListWidth: 280,
	eventEditContent: `["test": true]`,
	entityTreeStateTable: observable.map({})
});

function createFilledRectDumpItem(id: number, cssColor: string = "black"): EDumpItem {
	return {
		id,
		constructorName: "FilledRect",
		x: 0,
		y: 0,
		width: 100,
		height: 100,
		opacity: 1,
		scaleX: 1.4,
		scaleY: 1.2,
		anchorX: 0,
		anchorY: 0,
		children: null,
		angle: 0,
		touchable: false,
		visible: true,
		cssColor
	};
}

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
		entityTreeDevtoolProps={{
			onClickUpdateEntityTrees: action("update-entity-tree"),
			onClickToggleOpenEntityChildren: (e => {
				store.entityTreeStateTable.set(e.id, !store.entityTreeStateTable.get(e.id));
			}),
			onClickEntityItem: action("click-entity"),
			onMouseOverEntityItem: action("mouseover"),
			onMouseLeaveEntityItem: action("mouseleave"),
			entityTrees: [
				{
					id: 0,
					constructorName: "Label",
					x: 0,
					y: 0,
					width: 10,
					height: 10,
					opacity: 1,
					scaleX: 1,
					scaleY: 1,
					anchorX: 0,
					anchorY: 0,
					children: [
						{
							id: 1,
							constructorName: "Sprite",
							x: 0,
							y: 0,
							width: 32,
							height: 64,
							opacity: 1,
							scaleX: 2,
							scaleY: 2,
							anchorX: 0,
							anchorY: 0,
							children: [
								{
									id: 3,
									constructorName: "FilledRect",
									x: 10,
									y: 88,
									width: 100,
									height: 100,
									opacity: 0.5,
									scaleX: 1.4,
									scaleY: 1.2,
									anchorX: 0,
									anchorY: 0,
									children: null,
									angle: 0,
									touchable: true,
									visible: true,
									cssColor: "red"
								}
							],
							angle: 45,
							touchable: true,
							visible: false
						},
						{
							id: 2,
							constructorName: "Label",
							x: 0,
							y: 0,
							width: 100,
							height: 100,
							opacity: 1,
							scaleX: 1.4,
							scaleY: 1.2,
							anchorX: 0,
							anchorY: 0,
							children: null,
							angle: 0,
							touchable: false,
							visible: true,
							text: "100 pt."
						}
					],
					angle: 0,
					touchable: true,
					visible: true,
					text: "我輩は人である。名前はもうある。どこで生れたかはとんと見当がつかぬがまあ病院である。"
				},
				createFilledRectDumpItem(100),
				createFilledRectDumpItem(101),
				createFilledRectDumpItem(102),
				createFilledRectDumpItem(103),
				createFilledRectDumpItem(104),
				createFilledRectDumpItem(105),
				createFilledRectDumpItem(106),
				createFilledRectDumpItem(107),
				createFilledRectDumpItem(108),
				createFilledRectDumpItem(109),
				createFilledRectDumpItem(110),
				createFilledRectDumpItem(111),
				createFilledRectDumpItem(112),
				createFilledRectDumpItem(113),
				createFilledRectDumpItem(114),
				createFilledRectDumpItem(115),
				createFilledRectDumpItem(116),
				createFilledRectDumpItem(117),
				createFilledRectDumpItem(118),
				createFilledRectDumpItem(119),
				createFilledRectDumpItem(120),
				createFilledRectDumpItem(121),
				createFilledRectDumpItem(122)
			],
			entityTreeStateTable: store.entityTreeStateTable
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
			entityTreeDevtoolProps={{
				onClickUpdateEntityTrees: action("update-entity-tree"),
				onClickToggleOpenEntityChildren: action("toggle"),
				onClickEntityItem: action("click-entity"),
				onMouseOverEntityItem: action("mouseover"),
				onMouseLeaveEntityItem: action("mouseleave"),
				entityTrees: [
					{
						id : 1,
						constructorName: "FilledRect",
						children: [],
						x: 0,
						y: 10,
						width: 20,
						height: 20,
						opacity: 0,
						angle: 0,
						scaleX: 1,
						scaleY: 1,
						touchable: true,
						visible: true
					}
				],
				entityTreeStateTable: observable.map({ 1: false })
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
			entityTreeDevtoolProps={{
				onClickUpdateEntityTrees: action("update-entity-tree"),
				onClickToggleOpenEntityChildren: action("toggle"),
				onClickEntityItem: action("click-entity"),
				onMouseOverEntityItem: action("mouseover"),
				onMouseLeaveEntityItem: action("mouseleave"),
				entityTrees: [],
				entityTreeStateTable: observable.map({})
			}}
		/>
	))
	.add("with-behavior", () => <TestWithBehaviour />);
