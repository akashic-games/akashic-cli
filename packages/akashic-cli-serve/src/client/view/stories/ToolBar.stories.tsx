import { observable } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";
import { fn } from "storybook/test";
import type { PlayAudioStateSummary } from "../../../common/types/PlayAudioState.js";
import { ToolBar } from "../organism/ToolBar.js";

const store = observable({
	realtime: true,
	seeking: false,
	paused: false,
	currentTimePreview: 0 * 1000,
	currentTime: 145 * 1000,
	duration: 380 * 1000,
	showsAppearance: false,
	showsDevtools: false,
	showsAudioOptionPopover: true,
	showsDisplayOptionPopover: false,
	fitsToScreen: false,
	showsBackgroundImage: false,
	showsBackgroundColor: false,
	showsGrid: false,
	showsProfiler: false,
	isActivePausing: false,
	audioStateSummary: "all-player-unmuted" as PlayAudioStateSummary,
	showsDesignGuideline: false,
	audioVolume: 50
});

window.setInterval(() => {
	store.duration += 1000;
	store.currentTime += 1000;
}, 1000);

const TestWithBehaviour = observer(() => (
	<ToolBar
		makePlayControlProps={() => ({
			playbackRate: 150,
			isActivePausing: store.isActivePausing,
			isActiveExists: true,
			showsAddInstanceOptions: false,
			onClickAddInstanceOptions: fn(),
			onClickReset: fn(),
			onClickActivePause: (v) => (store.isActivePausing = v),
			onClickAddInstance: fn(),
			onClickAddSamePlayerInstance: fn(),
			onClickStep: fn()
		})}
		makeInstanceControlProps={() => ({
			currentTime:
				store.realtime ? store.duration :
					store.seeking ? store.currentTimePreview : store.currentTime,
			duration: store.duration,
			resetTime: 10,
			isPaused: store.paused,
			isProgressActive: store.seeking,
			enableFastForward: !store.realtime,
			onProgressChange: (t) => (
				(store.currentTimePreview = t), (store.seeking = true)
			),
			onProgressCommit: (t) => (
				(store.currentTime = t),
				(store.seeking = false),
				(store.realtime = false)
			),
			onClickPause: (t) => (store.paused = t),
			onClickFastForward: () => (store.realtime = true),
		})}
		makePlayerControlProps={() => ({
			selfId: "1234567asdfg",
			isJoined: true,
			isJoinEnabled: store.realtime,
			onClickJoinLeave: fn(),
		})}
		makeAudioOptionControlProps={() => ({
			showsAudioOptionPopover: store.showsAudioOptionPopover,
			audioStateSummary: store.audioStateSummary,
			audioVolume: store.audioVolume,
			onChangeAudioVolume: (volume) => void (store.audioVolume = volume),
			onClickAudioOptionPopover: (show) =>
				(store.showsAudioOptionPopover = show),
			onClickSolo: () => (store.audioStateSummary = "only-this-player-unmuted"),
			onClickMuteAll: () => (store.audioStateSummary = "all-player-muted"),
			onClickMuteNone: () => (store.audioStateSummary = "all-player-unmuted")
		})}
		makeDisplayOptionControlProps={() => ({
			showsDisplayOptionPopover: store.showsDisplayOptionPopover,
			fitsToScreen: store.fitsToScreen,
			showsBackgroundImage: store.showsBackgroundImage,
			showsBackgroundColor: store.showsBackgroundColor,
			showsGrid: store.showsGrid,
			showsProfiler: store.showsProfiler,
			showsDesignGuideline: store.showsDesignGuideline,
			onClickDisplayOptionPopover: (show) =>
				(store.showsDisplayOptionPopover = show),
			onChangeFitsToScreen: (fits) => (store.fitsToScreen = fits),
			onChangeShowBackgroundImage: (show) =>
				(store.showsBackgroundImage = show),
			onChangeShowBackgroundColor: (show) =>
				(store.showsBackgroundColor = show),
			onChangeShowGrid: (show) => (store.showsGrid = show),
			onChangeShowProfiler: (show) => (store.showsProfiler = show),
			onChangeShowDesignGuideline: (show) =>
				(store.showsDesignGuideline = show),
			onClickScreenshot: () => {
				// do nothing
			},
		})}
		showsAppearance={store.showsAppearance}
		showsDevtools={store.showsDevtools}
		showsInstanceControl={store.showsDevtools}
		targetService={"none"}
		onToggleAppearance={(v) => (store.showsAppearance = v)}
		onClickDevTools={(v) => (store.showsDevtools = v)}
	/>
));

export default {
	title: "o-ToolBar"
};

export const Basic = {
	render: () => (
		<ToolBar
			makePlayControlProps={() => ({
				playbackRate: 150,
				isActivePausing: false,
				isActiveExists: true,
				showsAddInstanceOptions: false,
				onClickAddInstanceOptions: fn(),
				onClickReset: fn(),
				onClickActivePause: fn(),
				onClickAddInstance: fn(),
				onClickAddSamePlayerInstance: fn(),
				onClickStep: fn()
			})}
			makeInstanceControlProps={() => ({
				currentTime: 2234 * 1000,
				duration: 7501 * 1000,
				resetTime: 1111 * 1000,
				isPaused: false,
				isProgressActive: false,
				onProgressChange: fn(),
				onProgressCommit: fn(),
				onClickPause: fn(),
				onClickFastForward: fn()
			})}
			makePlayerControlProps={() => ({
				selfId: "1234567asdfg",
				isJoined: true,
				isJoinEnabled: false,
				onClickJoinLeave: fn()
			})}
			makeAudioOptionControlProps={() => ({
				showsAudioOptionPopover: false,
				audioStateSummary: "only-this-player-unmuted",
				audioVolume: 50,
				onChangeAudioVolume: fn(),
				onClickAudioOptionPopover: fn(),
				onClickSolo: () => {
					// do nothing
				},
				onClickMuteAll: () => {
					// do nothing
				},
				onClickMuteNone: () => {
					// do nothing
				},
			})}
			makeDisplayOptionControlProps={() => ({
				showsDisplayOptionPopover: true,
				fitsToScreen: false,
				showsBackgroundImage: false,
				showsBackgroundColor: false,
				showsGrid: true,
				showsProfiler: true,
				showsDesignGuideline: false,
				onClickDisplayOptionPopover: fn(),
				onChangeFitsToScreen: fn(),
				onChangeShowBackgroundImage: fn(),
				onChangeShowBackgroundColor: fn(),
				onChangeShowGrid: fn(),
				onChangeShowProfiler: fn(),
				onChangeShowDesignGuideline: fn(),
				onClickScreenshot: () => {
					// do nothing
				}
			})}
			showsAppearance={false}
			showsDevtools={true}
			showsInstanceControl={true}
			targetService={"none"}
			onToggleAppearance={fn()}
			onClickDevTools={fn()}
		/>
	),

	name: "basic"
};

export const WithBehavior = {
	render: () => <TestWithBehaviour />,
	name: "with-behavior"
};
