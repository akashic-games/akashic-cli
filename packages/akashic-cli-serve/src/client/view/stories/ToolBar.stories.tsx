import * as React from "react";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { ToolBar } from "../organism/ToolBar";

const store = observable({
	realtime: true,
	seeking: false,
	paused: false,
	currentTimePreview: 0 * 1000,
	currentTime: 145 * 1000,
	duration: 380 * 1000,
	showsAppearance: false,
	showsDevtools: false,
	isActivePausing: false
});

setInterval(() => {
	store.duration += 1000;
	store.currentTime += 1000;
}, 1000);

const TestWithBehaviour = observer(() => (
		<ToolBar
			makePlayControlProps={() => ({
				playbackRate: 150,
				isActivePausing: store.isActivePausing,
				onClickReset: action("reset"),
				onClickActivePause: (v => (store.isActivePausing = v)),
				onClickAddInstance: action("add-instance")
			})}
			makeInstanceControlProps={() => ({
				currentTime:
					store.realtime ? store.duration :
					store.seeking ? store.currentTimePreview : store.currentTime,
				duration: store.duration,
				isPaused: store.paused,
				isProgressActive: store.seeking,
				enableFastForward: !store.realtime,
				onProgressChange: (t => (store.currentTimePreview = t, store.seeking = true)),
				onProgressCommit: (t => (store.currentTime = t, store.seeking = false, store.realtime = false)),
				onClickPause: (t => (store.paused = t)),
				onClickFastForward: () => (store.realtime = true)
			})}
			makePlayerControlProps={() => ({
				selfId: "1234567asdfg",
				isJoined: true,
				isJoinEnabled: store.realtime,
				onClickJoinLeave: action("joinleave")
			})}
			showsAppearance={store.showsAppearance}
			showsDevtools={store.showsDevtools}
			showsInstanceControl={store.showsDevtools}
			onToggleAppearance={v => (store.showsAppearance = v)}
			onToggleDevTools={v => (store.showsDevtools = v)}
		/>
));

storiesOf("o-ToolBar", module)
	.add("basic", () => (
		<ToolBar
			makePlayControlProps={() => ({
				playbackRate: 150,
				isActivePausing: false,
				onClickReset: action("reset"),
				onClickActivePause: action("active-pause"),
				onClickAddInstance: action("add-instance")
			})}
			makeInstanceControlProps={() => ({
				currentTime: 2234 * 1000,
				duration: 7501 * 1000,
				isPaused: false,
				isProgressActive: false,
				onProgressChange: action("progress-change"),
				onProgressCommit: action("progress-commit"),
				onClickPause: action("click-pause"),
				onClickFastForward: action("click-fast-forward")
			})}
			makePlayerControlProps={() => ({
				selfId: "1234567asdfg",
				isJoined: true,
				isJoinEnabled: false,
				onClickJoinLeave: action("joinleave")
			})}
			showsAppearance={false}
			showsDevtools={true}
			showsInstanceControl={true}
			onToggleAppearance={action("toggle-appearance")}
			onToggleDevTools={action("toggle-dev-tools")} />
	))
	.add("with-behavior", () => <TestWithBehaviour />);
