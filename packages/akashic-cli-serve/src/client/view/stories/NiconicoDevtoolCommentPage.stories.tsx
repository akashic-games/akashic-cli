// import { observable } from "mobx";
// import { observer } from "mobx-react";
import * as React from "react";
import { fn } from "storybook/test";
import { NiconicoDevtoolCommentPage } from "../molecule/NiconicoDevtoolCommentPage.js";

export default {
	title: "m-NiconicoDevtoolCommentPage"
};

export const Basic = {
	render: () => (
		<div style={{ height: 300, display: "flex", border: "1px dotted silver" }}>
			<NiconicoDevtoolCommentPage
				model={{
					comments: [],
					templates: [],
					isEnabled: true,
					senderType: "anonymous",
					senderLimitation: "none",
					commandInput: "",
					commentInput: "",
				}}
				onCommentInputChanged={fn()}
				onCommandInputChanged={fn()}
				onSenderTypeChanged={fn()}
				onClickSend={fn()}
				onClickTemplate={fn()}
			/>
		</div>
	),
	name: "basic"
};

export const HasTemplates = {
	render: () => (
		<div style={{ height: 300, display: "flex", border: "1px dotted silver" }}>
			<NiconicoDevtoolCommentPage
				model={{
					comments: [],
					templates: [
						"わこつx3",
						"草",
					],
					isEnabled: true,
					senderType: "broadcaster",
					senderLimitation: "broadcaster",
					commandInput: "",
					commentInput: "",
				}}
				onCommentInputChanged={fn()}
				onCommandInputChanged={fn()}
				onSenderTypeChanged={fn()}
				onClickSend={fn()}
				onClickTemplate={fn()}
			/>
		</div>
	),
	name: "has templates"
};

export const ManyComments = {
	render: () => (
		<div style={{ height: 300, display: "flex", border: "1px dotted silver" }}>
			<NiconicoDevtoolCommentPage
				model={{
					comments: [
						{ command: "ue big", comment: "わこつ", userID: "pid1", isAnonymous: false, vpos: 0, },
						{ command: "", comment: "放送者コメントテスト", isAnonymous: false, },
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
					senderLimitation: "audience",
					commandInput: "ue big red",
					commentInput: "コメント送信内容",
				}}
				onCommentInputChanged={fn()}
				onCommandInputChanged={fn()}
				onSenderTypeChanged={fn()}
				onClickSend={fn()}
				onClickTemplate={fn()}
			/>
		</div>
	),
	name: "many comments"
};

export const Disabled = {
	render: () => (
		<div style={{ height: 300, display: "flex", border: "1px dotted silver" }}>
			<NiconicoDevtoolCommentPage
				model={{
					comments: [],
					templates: [
						"わこつx3",
						"草",
					],
					isEnabled: false,
					senderType: "anonymous",
					senderLimitation: "none",
					commandInput: "ue big red",
					commentInput: "コメント送信内容",
				}}
				onCommentInputChanged={fn()}
				onCommandInputChanged={fn()}
				onSenderTypeChanged={fn()}
				onClickSend={fn()}
				onClickTemplate={fn()}
			/>
		</div>
	),
	name: "disabled"
};
