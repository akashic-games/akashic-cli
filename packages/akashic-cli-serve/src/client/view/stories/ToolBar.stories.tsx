import * as React from "react";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { ToolBar } from "../organism/ToolBar";
import { PlayAudioStateSummary } from "../../../common/types/PlayAudioState";

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
	showsBackgroundImage: false,
	showsGrid: false,
	isActivePausing: false,
	audioStateSummary: "all-player-unmuted" as PlayAudioStateSummary,
	showsDesignGuideline: false
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
				onClickReset: action("reset"),
				onClickActivePause: (v => (store.isActivePausing = v)),
				onClickAddInstance: action("add-instance"),
				onClickStep: action("step")
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
			makeAudioOptionControlProps={() => ({
				showsAudioOptionPopover: store.showsAudioOptionPopover,
				audioStateSummary: store.audioStateSummary,
				onClickAudioOptionPopover: (show => store.showsAudioOptionPopover = show),
				onClickSolo: (() => store.audioStateSummary = "only-this-player-unmuted"),
				onClickMuteAll: (() => store.audioStateSummary = "all-player-muted"),
				onClickMuteNone: (() => store.audioStateSummary = "all-player-unmuted")
			})}
			makeDisplayOptionControlProps={() => ({
				showsDisplayOptionPopover: store.showsDisplayOptionPopover,
				showsBackgroundImage: store.showsBackgroundImage,
				showsGrid: store.showsGrid,
				showsDesignGuideline: store.showsDesignGuideline,
				onClickDisplayOptionPopover: (show => store.showsDisplayOptionPopover = show),
				onChangeShowBackgroundImage: (show => store.showsBackgroundImage = show),
				onChangeShowGrid: (show => store.showsGrid = show),
				onChangeShowDesignGuideline: (show => store.showsDesignGuideline = show)
			})}
			showsAppearance={store.showsAppearance}
			showsDevtools={store.showsDevtools}
			showsInstanceControl={store.showsDevtools}
			targetService={"none"}
			onToggleAppearance={v => (store.showsAppearance = v)}
			onClickDevTools={v => (store.showsDevtools = v)}
		/>
));

storiesOf("o-ToolBar", module)
	.add("basic", () => (
		<ToolBar
			makePlayControlProps={() => ({
				playbackRate: 150,
				isActivePausing: false,
				isActiveExists: true,
				onClickReset: action("reset"),
				onClickActivePause: action("active-pause"),
				onClickAddInstance: action("add-instance"),
				onClickStep: action("step")
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
			makeAudioOptionControlProps={() => ({
				showsAudioOptionPopover: false,
				audioStateSummary: "only-this-player-unmuted",
				onClickAudioOptionPopover: action("audio-option"),
				onClickSolo: () => {},
				onClickMuteAll: () => {},
				onClickMuteNone: () => {}
			})}
			makeDisplayOptionControlProps={() => ({
				showsDisplayOptionPopover: true,
				showsBackgroundImage: false,
				showsGrid: true,
				showsDesignGuideline: false,
				onClickDisplayOptionPopover: action("display-option"),
				onChangeShowBackgroundImage: action("bgimage"),
				onChangeShowGrid: action("grid"),
				onChangeShowDesignGuideline: action("design-guideline")
			})}
			showsAppearance={false}
			showsDevtools={true}
			showsInstanceControl={true}
			targetService={"none"}
			onToggleAppearance={action("toggle-appearance")}
			onClickDevTools={action("dev-tools")}
		/>
	))
	.add("with-behavior", () => <TestWithBehaviour />);
