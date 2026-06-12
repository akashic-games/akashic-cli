import { observable } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";
import { fn } from "storybook/test";
import type { NiconicoDevtoolPageType, NiconicoDevtoolProps } from "../molecule/NiconicoDevtool.js";
import { NiconicoDevtool } from "../molecule/NiconicoDevtool.js";

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
		onAutoSendEventsChanged: fn(),
		onModeSelectChanged: fn(),
		onTotalTimeLimitInputValueChanged: fn(),
		onUsePreferredTotalTimeLimitChanged: fn(),
		onUseStopGameChanged: fn()
	},

	commentPageProps: {
		model: {
			comments: [
				{ command: "ue big", comment: "わこつ", userID: "pid1", isAnonymous: false, vpos: 0, },
				{ command: "", comment: "放送者コメントテスト", isAnonymous: false },
				{ command: "ue big", comment: "わこつ", userID: "pid1", isAnonymous: true, vpos: 100, },
				{ command: "", comment: "テスト1", userID: "pid1", isAnonymous: true, vpos: 200, },
				{ command: "", comment: "テスト2", userID: "pid2", isAnonymous: true, vpos: 300, },
				{ command: "", comment: "テスト3", userID: "pid3", isAnonymous: true, vpos: 400, },
				{ command: "red", comment: "テスト4", userID: "pid4", isAnonymous: true, vpos: 500, },
				{ command: "shita", comment: "テスト5", userID: "pid5", isAnonymous: true, vpos: 600, },
				{ command: "", comment: "テスト6", userID: "pid6", isAnonymous: true, vpos: 700, },
				{ command: "", comment: "テスト7", userID: "pid7", isAnonymous: true, vpos: 800, },
				{ command: "", comment: "テスト8", userID: "pid8", isAnonymous: true, vpos: 900, },
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
		onCommentInputChanged: fn(),
		onCommandInputChanged: fn(),
		onSenderTypeChanged: fn(),
		onClickSend: fn(),
		onClickTemplate: fn(),
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
