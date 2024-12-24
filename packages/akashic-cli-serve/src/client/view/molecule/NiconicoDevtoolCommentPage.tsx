import { observer } from "mobx-react";
import * as React from "react";
import type { NicoliveCommentEventComment } from "../../../common/types/NicoliveCommentPlugin";
import type {
	NiconicoDevtoolCommentPageSenderLimitation,
	NiconicoDevtoolCommentPageSenderType
} from "../../store/DevtoolUiCommentPageStore";
import { ToolChoiceButton, type ToolChoiceButtonItem } from "../atom/ToolChoiceButton";
import styles from "./NiconicoDevtoolCommentPage.module.css";

export interface NiconicoDevtoolCommentPagePropsModel {
	comments: NicoliveCommentEventComment[];
	templates: string[];
	isEnabled: boolean;
	senderType: NiconicoDevtoolCommentPageSenderType;
	senderLimitation: NiconicoDevtoolCommentPageSenderLimitation;
	commandInput: string;
	commentInput: string;
}

export interface NiconicoDevtoolCommentPageProps {
	model: NiconicoDevtoolCommentPagePropsModel;
	onCommentInputChanged: (content: string) => void;
	onCommandInputChanged: (content: string) => void;
	onSenderTypeChanged: (type: NiconicoDevtoolCommentPageSenderType) => void;
	onClickSend: () => void;
	onClickTemplate: (name: string) => void;
}

const commentModeChoiceItemsBase: (ToolChoiceButtonItem & { type: NiconicoDevtoolCommentPageSenderType })[] = [
	{ label: "Anonyomous", title: "匿名 (なふだ OFF) でコメント", type: "anonymous" },
	{ label: "Named", title: "非匿名 (なふだ ON) でコメント", type: "named" },
	{ label: "Operator", title: "配信者としてコメント", type: "operator" },
];

const commentModeChoiceItemsTable: { [limitation in NiconicoDevtoolCommentPageSenderLimitation]: typeof commentModeChoiceItemsBase } = {
	operator: commentModeChoiceItemsBase.map(item => ({ ...item, disabled: item.type !== "operator" })),
	audience: commentModeChoiceItemsBase.map(item => ({ ...item, disabled: item.type === "operator" })),
	none: commentModeChoiceItemsBase,
};

export const NiconicoDevtoolCommentPage = observer(function NiconicoDevtoolCommentPage(props: NiconicoDevtoolCommentPageProps) {
	const { model, onCommandInputChanged, onCommentInputChanged, onSenderTypeChanged, onClickSend, onClickTemplate } = props;
	const { comments, templates, isEnabled, senderType, senderLimitation, commandInput, commentInput } = model;

	const handleChoiceSenderType = React.useCallback((index: number) => {
		onSenderTypeChanged(commentModeChoiceItemsBase[index].type);
	}, [onSenderTypeChanged]);

	const handleCommandInputChanged = React.useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
		onCommandInputChanged(ev.target!.value);
	}, [onCommandInputChanged]);

	const handleCommentInputChanged = React.useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
		onCommentInputChanged(ev.target!.value);
	}, [onCommentInputChanged]);

	const handleCommentInputKeyDown = React.useCallback((ev: React.KeyboardEvent<HTMLInputElement>) => {
		if (ev.key === "Enter" && !ev.nativeEvent.isComposing) {
			ev.preventDefault();
			onClickSend();
		}
	}, [onClickSend]);

	return (
		<div className={styles["comment-devtool"]}>
			{
				isEnabled ?
					<div className={styles["comment-list"]}>
						{
							comments.length ?
								comments.map((comment, i) => (
									<CommentRow key={i} comment={comment} index={i} />
								)) :
								<div className={styles.placeholder}>Comments sent to the game will be shown here.</div>
						}
					</div> :
					<div className={styles["disabled-message"]}>
						<div>
							NicoliveComment plugin is either not enabled or not started.<br/>
							(<code>g.game.external.nicoliveComment.start()</code>
							to send/list comments here.)
						</div>
					</div>
			}

			{
				templates.length ?
					<div className={styles["comment-template-row"]}>
						<>
							<div className={styles.label}>Template</div>
							<div className={styles.list}>
								{
									templates.map((item, i) => (
										<button
											key={`${i}/${item}`}
											className={styles.item}
											onClick={() => onClickTemplate(item)}
											disabled={!isEnabled}
										>
											{item}
										</button>
									))
								}
							</div>
						</>
					</div> :
					null
			}

			<div className={styles["comment-input-row"]}>
				<input
					type="text"
					placeholder="Command"
					value={commandInput}
					onChange={handleCommandInputChanged}
					disabled={!isEnabled}
				/>

				<input
					type="text"
					className={styles["input-comment"]}
					placeholder="Comment"
					value={commentInput}
					onChange={handleCommentInputChanged}
					onKeyDown={handleCommentInputKeyDown}
					disabled={!isEnabled}
				/>

				<button onClick={onClickSend} disabled={!isEnabled}>Send</button>

				<div className={styles.mode}>
					As:
					<ToolChoiceButton
						items={commentModeChoiceItemsTable[senderLimitation]}
						pushedIndex={commentModeChoiceItemsTable[senderLimitation].findIndex(item => item.type === senderType)}
						disabled={!isEnabled}
						onClick={handleChoiceSenderType}
					/>
				</div>
			</div>
		</div>
	);
});

interface CommentRowProps {
	comment: NicoliveCommentEventComment;
	index: number;
}

const CommentRow = observer(function CommentRow(props: CommentRowProps) {
	const { comment: commentEntry, index } = props;
	const { command, comment, userID, isAnonymous, isOperatorComment } = commentEntry;
	return (
		<div className={styles["comment-row"]}>
			<span className={styles.index}>{index + 1}</span>
			<span className={isOperatorComment ? styles.operator : ""}>{comment}</span>
			{
				command ?
					<span className={styles.aux}>{command}</span> :
					null
			}
			{
				!isOperatorComment && !isAnonymous ?
					<span className={styles.aux}>userID: {userID}</span> :
					null
			}
		</div>
	);
});
