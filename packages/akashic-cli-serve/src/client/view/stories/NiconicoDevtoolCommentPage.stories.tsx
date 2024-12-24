import { action } from "@storybook/addon-actions";
// import { observable } from "mobx";
// import { observer } from "mobx-react";
import * as React from "react";
import { NiconicoDevtoolCommentPage } from "../molecule/NiconicoDevtoolCommentPage";

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
				onCommentInputChanged={action("comment-input-changed")}
				onCommandInputChanged={action("command-input-changed")}
				onSenderTypeChanged={action("sender-changed")}
				onClickSend={action("click-send")}
				onClickTemplate={action("click-template")}
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
					senderType: "operator",
					senderLimitation: "operator",
					commandInput: "",
					commentInput: "",
				}}
				onCommentInputChanged={action("comment-input-changed")}
				onCommandInputChanged={action("command-input-changed")}
				onSenderTypeChanged={action("sender-changed")}
				onClickSend={action("click-send")}
				onClickTemplate={action("click-template")}
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
					senderLimitation: "audience",
					commandInput: "ue big red",
					commentInput: "コメント送信内容",
				}}
				onCommentInputChanged={action("comment-input-changed")}
				onCommandInputChanged={action("command-input-changed")}
				onSenderTypeChanged={action("sender-changed")}
				onClickSend={action("click-send")}
				onClickTemplate={action("click-template")}
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
				onCommentInputChanged={action("comment-input-changed")}
				onCommandInputChanged={action("command-input-changed")}
				onSenderTypeChanged={action("sender-changed")}
				onClickSend={action("click-send")}
				onClickTemplate={action("click-template")}
			/>
		</div>
	),
	name: "disabled"
};
