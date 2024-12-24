import { action } from "@storybook/addon-actions";
import { observable } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";
import type { NiconicoDevtoolPageType, NiconicoDevtoolProps } from "../molecule/NiconicoDevtool";
import { NiconicoDevtool } from "../molecule/NiconicoDevtool";

const store: NiconicoDevtoolProps = observable({
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
			"events:use-preferred-total-time-limit-changed",
		),
		onUseStopGameChanged: action("events:use-stop-game-changed")
	},

	commentPageProps: {
		model: {
			comments: [
				{ command: "ue big", comment: "わこつ", userID: "pid1", },
				{ command: "", comment: "放送者コメントテスト", userID: "pid1", isOperatorComment: true, },
				{ command: "ue big", comment: "わこつ", userID: "pid1", isAnonymous: true, },
				{ command: "", comment: "テスト1", userID: "pid1", isAnonymous: true },
				{ command: "", comment: "テスト2", userID: "pid2", isAnonymous: true },
				{ command: "", comment: "テスト3", userID: "pid3", isAnonymous: true },
				{ command: "red", comment: "テスト4", userID: "pid4", isAnonymous: true },
				{ command: "shita", comment: "テスト5", userID: "pid5", isAnonymous: true },
				{ command: "", comment: "テスト6", userID: "pid6", isAnonymous: true },
				{ command: "", comment: "テスト7", userID: "pid7", isAnonymous: true },
				{ command: "", comment: "テスト8", userID: "pid8", isAnonymous: true },
			],
			templates: [
				"わこつx3",
				"草",
			],
			isEnabled: true,
			senderType: "anonymous",
			senderLimitation: "none",
			commandInput: "ue big red",
			commentInput: "コメント送信内容",
		},
		onCommentInputChanged: action("comment-input-changed"),
		onCommandInputChanged: action("command-input-changed"),
		onSenderTypeChanged: action("sender-changed"),
		onClickSend: action("click-send"),
		onClickTemplate: action("click-template"),
	},

	activePage: "ranking" as NiconicoDevtoolPageType,
	selectorWidth: 100,

	onResizeSelector: size => {
		store.selectorWidth = size;
	},
	onChangePage: page => {
		store.activePage = page;
	},
});

const TestWithBehavior = observer(() => {
	return (
		<div style={{
			display: "flex",
			height: 300,
			border: "1px dotted silver"
		}}>
			<NiconicoDevtool {...store} />
		</div>
	);
});

export const WithBehavior = {
	render: () => <TestWithBehavior />,
	name: "with-behavior"
};

export default {
	title: "m-NiconicoDevtool"
};
