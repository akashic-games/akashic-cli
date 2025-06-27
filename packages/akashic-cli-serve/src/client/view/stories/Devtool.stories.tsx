import { action } from "@storybook/addon-actions";
import { observable } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";
import type { EDumpItem } from "../../common/types/EDumpItem";
import type { NiconicoDevtoolProps } from "../molecule/NiconicoDevtool";
import type { PlaybackDevtoolProps } from "../molecule/PlaybackDevtool";
import { Devtool } from "../organism/Devtool";

const store = observable({
	devtoolsHeight: 300,
	activeDevtool: "Playback",
	showsEventList: true,
	eventListWidth: 280,
	eventEditContent: "[\"test\": true]",
	entityTreeStateTable: observable.map({}),
	showsHidden: true,
	volume: 0,
	isSeekingVolume: false,

	// playback
	currentTime: 20000,
	duration: 30000,
	resetTime: 8000,
	isPaused: false,
	isProgressActive: false,
	isReplay: false,
	isActiveExists: true,
	isActivePaused: false,
	isForceResetOnSeek: true,
	selectedStartPointIndex: null as number | null
});

const nicoProps: NiconicoDevtoolProps = {
	rankingPageProps: {
		isAutoSendEvent: true,
		usePreferredTimeLimit: true,
		stopsGameOnTimeout: true,
		totalTimeLimitInputValue: 75,
		emulatingShinichibaMode: "ranking",
		totalTimeLimit: 65,
		playDuration: 0,
		preferredTotalTimeLimit: 55,
		score: 700,
		playThreshold: 100,
		clearThreshold: 500,
		onAutoSendEventsChanged: action("events:auto-send-events-changed"),
		onModeSelectChanged: action("events:mode-select-changed"),
		onTotalTimeLimitInputValueChanged: action("events:total-time-limit-changed"),
		onUsePreferredTotalTimeLimitChanged: action(
			"events:use-preferred-total-time-limit-changed"
		),
		onUseStopGameChanged: action("events:use-stop-game-changed")
	},
	commentPageProps: {
		model: {
			comments: [],
			templates: [],
			isEnabled: false,
			senderType: "anonymous",
			senderLimitation: "broadcaster",
			commandInput: "",
			commentInput: ""
		},
		onCommentInputChanged: action("events:comment-input-changed"),
		onCommandInputChanged: action("events:command-input-changed"),
		onSenderTypeChanged: action("events:sender-type-changed"),
		onClickSend: action("events:send-comment"),
		onClickTemplate: action("events:send-template"),
	},
	activePage: "ranking",
	selectorWidth: 120,
	onResizeSelector: action("events:resize-selector"),
	onChangePage: action("events:cahnge-page"),
};

const dummyPlaybackDevtoolProps: PlaybackDevtoolProps = {
	startPointHeaders: [],
	focusedStartPointHeaderIndex: 0,
	currentTime: 10,
	duration: 100,
	resetTime: 0,
	isPaused: false,
	isProgressActive: false,
	isReplay: false,
	isActiveExists: true,
	isActivePaused: false,
	isForceResetOnSeek: true,
	onClickPauseActive: action("click-pause-active"),
	onClickSavePlaylog: action("click-save-playlog"),
	onClickForceResetOnSeek: action("click-force-jump-on-seek"),
	onProgressChange: action("progress-change"),
	onProgressCommit: action("progress-commit"),
	onClickPause: action("click-pause"),
	onClickFastForward: action("click-fastforward"),
	onHoverStartPoint: action("hover-startpoint"),
	onJumpWithStartPoint: action("jump-startpoint"),
	onDumpStartPoint: action("doubleclick-startpoint")
};

function createFilledRectDumpItem(
	id: number,
	cssColor: string = "black"
): EDumpItem {
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
		children: undefined,
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
		onResizeHeight={(h) => (store.devtoolsHeight = h)}
		activeDevtool={store.activeDevtool as any}
		onSelectDevtool={(t) => (store.activeDevtool = t)}
		playbackDevtoolProps={{
			startPointHeaders: [
				{ frame: 150, timestamp: 1627467453814 },
				{ frame: 300, timestamp: 1627467458813 },
				{ frame: 450, timestamp: 1627467463814 }
			],
			focusedStartPointHeaderIndex: store.selectedStartPointIndex!,
			currentTime: store.currentTime,
			duration: store.duration,
			resetTime: store.resetTime,
			isPaused: store.isPaused,
			isProgressActive: store.isProgressActive,
			isReplay: store.isReplay,
			isActiveExists: true,
			isActivePaused: store.isActivePaused,
			isForceResetOnSeek: store.isForceResetOnSeek,
			onClickPauseActive: (v) => (store.isActivePaused = v),
			onClickSavePlaylog: action("click-save-playlog"),
			onClickForceResetOnSeek: (v) => (store.isForceResetOnSeek = v),
			onProgressChange: (v) => (store.currentTime = v),
			onProgressCommit: (v) => {
				store.currentTime = v;
				store.isReplay = true;
			},
			onClickPause: (v) => (store.isPaused = v),
			onClickFastForward: () => (store.isReplay = false),
			onHoverStartPoint: (v, hovers) =>
				(store.selectedStartPointIndex = hovers ? v : null),
			onJumpWithStartPoint: action("jump-startpoint"),
			onDumpStartPoint: action("dump-startpoint")
		}}
		eventsDevtoolProps={{
			showsEventList: store.showsEventList,
			eventListWidth: store.eventListWidth,
			eventListMinWidth: 200,
			onEventListResize: (w) => (store.eventListWidth = w),
			onClickShowEventList: (v) => (store.showsEventList = v),
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
			onEventEditContentChanged: (v) => (store.eventEditContent = v)
		}}
		instancesDevtoolProps={{
			instances: [
				{
					type: "active",
					env: "(server)",
					playerId: null,
					name: null,
					isJoined: false
				},
				{
					type: "passive",
					env: "Chrome",
					playerId: "1234567890",
					name: "player-1",
					isJoined: true
				},
				{
					type: "passive",
					env: "Chrome",
					playerId: "aa0941jlta",
					name: "player-2",
					isJoined: false
				},
				{
					type: "passive",
					env: "Firefox",
					playerId: "asfaiout",
					name: "player-3",
					isJoined: true
				},
			],
			onClickAddInstance: action("add-instance")
		}}
		entityTreeDevtoolProps={{
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
									children: undefined,
									angle: 0,
									touchable: true,
									visible: true,
									cssColor: "red"
								},
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
							children: undefined,
							angle: 0,
							local: true,
							touchable: false,
							visible: true,
							text: "100 pt."
						},
					],
					angle: 0,
					touchable: true,
					visible: true,
					text: "我輩は人である。名前はもうある。どこで生れたかはとんと見当がつかぬがまあ病院である。"
				},
			],
			entityTreeStateTable: store.entityTreeStateTable,
			selectedEntityId: 2,
			isSelectingEntity: false,
			showsHidden: store.showsHidden,
			onClickDump: action("dump"),
			onChangeShowsHidden: (shows) => (store.showsHidden = shows),
			onClickSelectEntity: () => {
				// do nothing
			},
			onClickUpdateEntityTrees: action("update-entity-tree"),
			onClickToggleOpenEntityChildren: (e) => {
				store.entityTreeStateTable.set(
					e.id,
					!store.entityTreeStateTable.get(e.id)
				);
			},
			onClickEntityItem: action("click-entity"),
			onMouseOverEntityItem: action("mouseover"),
			onMouseLeaveEntityItem: action("mouseleave")
		}}
		niconicoDevtoolProps={nicoProps}
		internalDevtoolProps={{
			sendScreenshotEvent: action("send-screenshot-event"),
			sendFinishEvent: action("send-finish-event")
		}}
	/>
));

export default {
	title: "o-Devtool"
};

export const Instances = {
	render: () => (
		<Devtool
			height={300}
			minHeight={200}
			onResizeHeight={action("resize-height")}
			activeDevtool={"Instances"}
			onSelectDevtool={action("select-tool")}
			playbackDevtoolProps={dummyPlaybackDevtoolProps}
			eventsDevtoolProps={{
				showsEventList: true,
				eventListWidth: 250,
				eventListMinWidth: 200,
				onEventListResize: action("events:list-resize"),
				onClickShowEventList: action("events:list"),
				eventNames: [
					"Foo",
					"Start",
					"Stop",
					"A very long event name to see how it will be shown on your display ya?"
				],
				eventEditContent: "[\"test\", 1]",
				onClickSendEvent: action("events:send"),
				onClickCopyEvent: action("events:copy"),
				onClickSendEditingEvent: action("events:send-edit"),
				onEventEditContentChanged: action("events:edit")
			}}
			instancesDevtoolProps={{
				instances: [
					{
						type: "active",
						env: "(server)",
						playerId: null,
						name: null,
						isJoined: false
					},
					{
						type: "passive",
						env: "Chrome",
						playerId: "1234567890",
						name: "player-1",
						isJoined: false
					},
					{
						type: "passive",
						env: "Chrome",
						playerId: "aa0941jlta",
						name: "player-2",
						isJoined: false
					},
					{
						type: "passive",
						env: "Firefox",
						playerId: "asfaiout",
						name: "player-3",
						isJoined: false
					},
					{
						type: "passive",
						env: "Firefox",
						playerId: "asfaiout1",
						name: "player-4",
						isJoined: false
					},
					{
						type: "passive",
						env: "Firefox",
						playerId: "asfaiout2",
						name: "player-5",
						isJoined: false
					},
					{
						type: "passive",
						env: "Firefox",
						playerId: "asfaiout3",
						name: "player-6",
						isJoined: false
					},
					{
						type: "passive",
						env: "Firefox",
						playerId: "asfaiout4",
						name: "player-7",
						isJoined: false
					},
					{
						type: "passive",
						env: "Firefox",
						playerId: "asfaiout5",
						name: "player-8",
						isJoined: false
					},
					{
						type: "passive",
						env: "Firefox",
						playerId: "asfaiout6",
						name: "player-9",
						isJoined: false
					},
					{
						type: "passive",
						env: "Firefox",
						playerId: "asfaiout7",
						name: "player-10",
						isJoined: false
					},
					{
						type: "passive",
						env: "Firefox",
						playerId: "asfaiout8",
						name: "player-11",
						isJoined: false
					},
					{
						type: "passive",
						env: "Firefox",
						playerId: "asfaiout9",
						name: "player-12",
						isJoined: false
					},
					{
						type: "passive",
						env: "Firefox",
						playerId: "asfaiout10",
						name: "player-13",
						isJoined: false
					},
					{
						type: "passive",
						env: "Firefox",
						playerId: "asfaiout11",
						name: "player-14",
						isJoined: false
					},
					{
						type: "passive",
						env: "Firefox",
						playerId: "asfaiout12",
						name: "player-15",
						isJoined: false
					},
					{
						type: "passive",
						env: "Firefox",
						playerId: "asfaiout13",
						name: "player-16",
						isJoined: false
					},
					{
						type: "passive",
						env: "Firefox",
						playerId: "asfaiout14",
						name: "player-17",
						isJoined: false
					},
					{
						type: "passive",
						env: "Firefox",
						playerId: "asfaiout15",
						name: "player-18",
						isJoined: false
					},
					{
						type: "passive",
						env: "Firefox",
						playerId: "asfaiout16",
						name: "player-19",
						isJoined: false
					},
					{
						type: "passive",
						env: "Firefox",
						playerId: "asfaiout17",
						name: "player-20",
						isJoined: false
					},
					{
						type: "passive",
						env: "Firefox",
						playerId: "asfaiout18",
						name: "player-21",
						isJoined: false
					},
					{
						type: "passive",
						env: "Firefox",
						playerId: "asfaiout19",
						name: "player-22",
						isJoined: false
					},
					{
						type: "passive",
						env: "Firefox",
						playerId: "asfaiout20",
						name: "player-23",
						isJoined: false
					},
					{
						type: "passive",
						env: "Firefox",
						playerId: "asfaiout21",
						name: "player-24",
						isJoined: false
					},
					{
						type: "passive",
						env: "Firefox",
						playerId: "asfaiout22",
						name: "player-25",
						isJoined: false
					},
					{
						type: "passive",
						env: "Firefox",
						playerId: "asfaiout23",
						name: "player-26",
						isJoined: false
					},
					{
						type: "passive",
						env: "Firefox",
						playerId: "asfaiout24",
						name: "player-27",
						isJoined: false
					},
				],
				onClickAddInstance: action("add-instance")
			}}
			entityTreeDevtoolProps={{
				entityTrees: [
					{
						id: 1,
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
					},
				],
				entityTreeStateTable: observable.map({ 1: false }),
				selectedEntityId: null,
				isSelectingEntity: false,
				showsHidden: false,
				onClickDump: action("dump"),
				onChangeShowsHidden: action("change-shows-hidden"),
				onClickSelectEntity: action("click-select-entity"),
				onClickUpdateEntityTrees: action("update-entity-tree"),
				onClickToggleOpenEntityChildren: action("toggle"),
				onClickEntityItem: action("click-entity"),
				onMouseOverEntityItem: action("mouseover"),
				onMouseLeaveEntityItem: action("mouseleave")
			}}
			niconicoDevtoolProps={nicoProps}
			internalDevtoolProps={{
				sendScreenshotEvent: action("send-screenshot-event"),
				sendFinishEvent: action("send-finish-event")
			}}
		/>
	),

	name: "instances"
};

export const Events = {
	render: () => (
		<Devtool
			height={300}
			minHeight={200}
			onResizeHeight={action("resize-height")}
			activeDevtool={"Events"}
			onSelectDevtool={action("select-tool")}
			playbackDevtoolProps={dummyPlaybackDevtoolProps}
			eventsDevtoolProps={{
				showsEventList: true,
				eventListWidth: 250,
				eventListMinWidth: 200,
				onEventListResize: action("events:list-resize"),
				onClickShowEventList: action("events:list"),
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
				eventEditContent: "[\"test\", 1]",
				onClickSendEvent: action("events:send"),
				onClickCopyEvent: action("events:copy"),
				onClickSendEditingEvent: action("events:send-edit"),
				onEventEditContentChanged: action("events:edit")
			}}
			instancesDevtoolProps={{
				instances: [
					{
						type: "active",
						env: "(server)",
						playerId: null,
						name: null,
						isJoined: false
					},
					{
						type: "passive",
						env: "Chrome",
						playerId: "1234567890",
						name: "player-1",
						isJoined: false
					},
					{
						type: "passive",
						env: "Chrome",
						playerId: "aa0941jlta",
						name: "player-2",
						isJoined: false
					},
					{
						type: "passive",
						env: "Firefox",
						playerId: "asfaiout",
						name: "player-3",
						isJoined: false
					},
				],
				onClickAddInstance: action("add-instance")
			}}
			entityTreeDevtoolProps={{
				entityTrees: [],
				entityTreeStateTable: observable.map({}),
				selectedEntityId: null,
				isSelectingEntity: false,
				showsHidden: false,
				onClickDump: action("dump"),
				onChangeShowsHidden: action("change-shows-hidden"),
				onClickSelectEntity: action("click-select-entity"),
				onClickUpdateEntityTrees: action("update-entity-tree"),
				onClickToggleOpenEntityChildren: action("toggle"),
				onClickEntityItem: action("click-entity"),
				onMouseOverEntityItem: action("mouseover"),
				onMouseLeaveEntityItem: action("mouseleave")
			}}
			niconicoDevtoolProps={nicoProps}
			internalDevtoolProps={{
				sendScreenshotEvent: action("send-screenshot-event"),
				sendFinishEvent: action("send-finish-event")
			}}
		/>
	),

	name: "events"
};

export const EntityTree = {
	render: () => (
		<Devtool
			height={300}
			minHeight={200}
			onResizeHeight={action("resize-height")}
			activeDevtool={"EntityTree"}
			onSelectDevtool={action("select-tool")}
			playbackDevtoolProps={dummyPlaybackDevtoolProps}
			eventsDevtoolProps={{
				showsEventList: true,
				eventListWidth: 250,
				eventListMinWidth: 200,
				onEventListResize: action("events:list-resize"),
				onClickShowEventList: action("events:toggle-list"),
				eventNames: ["Foo", "Test 0"],
				eventEditContent: "[\"test\", 1]",
				onClickSendEvent: action("events:send"),
				onClickCopyEvent: action("events:copy"),
				onClickSendEditingEvent: action("events:send-edit"),
				onEventEditContentChanged: action("events:edit")
			}}
			instancesDevtoolProps={{
				instances: [
					{
						type: "active",
						env: "(server)",
						playerId: null,
						name: null,
						isJoined: false
					},
					{
						type: "passive",
						env: "Chrome",
						playerId: "1234567890",
						name: "player-1",
						isJoined: false
					},
					{
						type: "passive",
						env: "Chrome",
						playerId: "aa0941jlta",
						name: "player-2",
						isJoined: false
					},
					{
						type: "passive",
						env: "Firefox",
						playerId: "asfaiout",
						name: "player-3",
						isJoined: false
					},
				],
				onClickAddInstance: action("add-instance")
			}}
			entityTreeDevtoolProps={{
				entityTrees: [
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
					createFilledRectDumpItem(122),
					createFilledRectDumpItem(123),
					createFilledRectDumpItem(124),
					createFilledRectDumpItem(125),
					createFilledRectDumpItem(126),
					createFilledRectDumpItem(127),
					createFilledRectDumpItem(128),
					createFilledRectDumpItem(129),
					createFilledRectDumpItem(130),
					createFilledRectDumpItem(131),
					createFilledRectDumpItem(132),
					createFilledRectDumpItem(133),
					createFilledRectDumpItem(134),
					createFilledRectDumpItem(135),
					createFilledRectDumpItem(136),
					createFilledRectDumpItem(137),
					createFilledRectDumpItem(138),
					createFilledRectDumpItem(139)
				],
				entityTreeStateTable: observable.map({}),
				selectedEntityId: null,
				isSelectingEntity: false,
				showsHidden: false,
				onClickDump: action("dump"),
				onChangeShowsHidden: action("change-shows-hidden"),
				onClickSelectEntity: action("click-select-entity"),
				onClickUpdateEntityTrees: action("update-entity-tree"),
				onClickToggleOpenEntityChildren: action("toggle"),
				onClickEntityItem: action("click-entity"),
				onMouseOverEntityItem: action("mouseover"),
				onMouseLeaveEntityItem: action("mouseleave")
			}}
			niconicoDevtoolProps={nicoProps}
			internalDevtoolProps={{
				sendScreenshotEvent: action("send-screenshot-event"),
				sendFinishEvent: action("send-finish-event")
			}}
		/>
	),

	name: "entity-tree"
};

export const Niconico = {
	render: () => (
		<Devtool
			height={300}
			minHeight={200}
			onResizeHeight={action("resize-height")}
			activeDevtool={"Niconico"}
			onSelectDevtool={action("select-tool")}
			playbackDevtoolProps={dummyPlaybackDevtoolProps}
			eventsDevtoolProps={{
				showsEventList: true,
				eventListWidth: 250,
				eventListMinWidth: 200,
				onEventListResize: action("events:list-resize"),
				onClickShowEventList: action("events:toggle-list"),
				eventNames: ["Foo", "Test 0"],
				eventEditContent: "[\"test\", 1]",
				onClickSendEvent: action("events:send"),
				onClickCopyEvent: action("events:copy"),
				onClickSendEditingEvent: action("events:send-edit"),
				onEventEditContentChanged: action("events:edit")
			}}
			instancesDevtoolProps={{
				instances: [],
				onClickAddInstance: action("add-instance")
			}}
			entityTreeDevtoolProps={{
				entityTrees: [],
				entityTreeStateTable: observable.map({}),
				selectedEntityId: null,
				isSelectingEntity: false,
				showsHidden: false,
				onClickDump: action("dump"),
				onChangeShowsHidden: action("change-shows-hidden"),
				onClickSelectEntity: action("click-select-entity"),
				onClickUpdateEntityTrees: action("update-entity-tree"),
				onClickToggleOpenEntityChildren: action("toggle"),
				onClickEntityItem: action("click-entity"),
				onMouseOverEntityItem: action("mouseover"),
				onMouseLeaveEntityItem: action("mouseleave")
			}}
			niconicoDevtoolProps={nicoProps}
			internalDevtoolProps={{
				sendScreenshotEvent: action("send-screenshot-event"),
				sendFinishEvent: action("send-finish-event")
			}}
		/>
	),

	name: "niconico"
};

export const Playback = {
	render: () => (
		<Devtool
			height={300}
			minHeight={200}
			onResizeHeight={action("resize-height")}
			activeDevtool={"Playback"}
			onSelectDevtool={action("select-tool")}
			playbackDevtoolProps={dummyPlaybackDevtoolProps}
			eventsDevtoolProps={{
				showsEventList: true,
				eventListWidth: 250,
				eventListMinWidth: 200,
				onEventListResize: action("events:list-resize"),
				onClickShowEventList: action("events:toggle-list"),
				eventNames: ["Foo", "Test 0"],
				eventEditContent: "[\"test\", 1]",
				onClickSendEvent: action("events:send"),
				onClickCopyEvent: action("events:copy"),
				onClickSendEditingEvent: action("events:send-edit"),
				onEventEditContentChanged: action("events:edit")
			}}
			instancesDevtoolProps={{
				instances: [],
				onClickAddInstance: action("add-instance")
			}}
			entityTreeDevtoolProps={{
				entityTrees: [],
				entityTreeStateTable: observable.map({}),
				selectedEntityId: null,
				isSelectingEntity: false,
				showsHidden: false,
				onClickDump: action("dump"),
				onChangeShowsHidden: action("change-shows-hidden"),
				onClickSelectEntity: action("click-select-entity"),
				onClickUpdateEntityTrees: action("update-entity-tree"),
				onClickToggleOpenEntityChildren: action("toggle"),
				onClickEntityItem: action("click-entity"),
				onMouseOverEntityItem: action("mouseover"),
				onMouseLeaveEntityItem: action("mouseleave")
			}}
			niconicoDevtoolProps={nicoProps}
			internalDevtoolProps={{
				sendScreenshotEvent: action("send-screenshot-event"),
				sendFinishEvent: action("send-finish-event")
			}}
		/>
	),

	name: "playback"
};

export const WithBehavior = {
	render: () => <TestWithBehaviour />,
	name: "with-behavior",
};
