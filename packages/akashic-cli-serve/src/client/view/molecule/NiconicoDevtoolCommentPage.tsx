import { observer } from "mobx-react";
import * as React from "react";
import type { NicoliveComment } from "../../../server/domain/nicoliveComment/NicoliveCommentPlugin";
import { ToolChoiceButton, type ToolChoiceButtonItem } from "../atom/ToolChoiceButton";
import styles from "./NiconicoDevtoolCommentPage.module.css";

export type NiconicoDevtoolCommentPageSenderType = "Anonymous" | "Operator" | "Named";

export interface NiconicoDevtoolCommentPageProps {
	comments: NicoliveComment[];
	templates: string[];
	isEnabled: boolean;
	senderType: NiconicoDevtoolCommentPageSenderType;
	isSenderTypeFixed: boolean;
	commandInput: string;
	commentInput: string;
	onCommentInputChanged: (content: string) => void;
	onCommandInputChanged: (content: string) => void;
	onSenderTypeChanged: (type: NiconicoDevtoolCommentPageSenderType) => void;
	onClickSend: () => void;
	onClickTemplate: (index: number) => void;
}

const commentModeChoiceItems: (ToolChoiceButtonItem & { type: NiconicoDevtoolCommentPageSenderType })[] = [
	{ label: "Anonyomous", title: "匿名 (なふだ OFF) でコメント", type: "Anonymous" },
	{ label: "Named", title: "非匿名 (なふだ ON) でコメント", type: "Named" },
	{ label: "Operator", title: "配信者としてコメント", type: "Operator" },
];

export const NiconicoDevtoolCommentPage = observer(function NiconicoDevtoolCommentPage(props: NiconicoDevtoolCommentPageProps) {
	const {
		comments,
		templates,
		isEnabled,
		senderType,
		isSenderTypeFixed,
		commandInput,
		commentInput,
		onCommandInputChanged,
		onCommentInputChanged,
		onSenderTypeChanged,
		onClickSend,
		onClickTemplate,
	} = props;

	const handleChoiceSenderType = React.useCallback((index: number) => {
		onSenderTypeChanged(commentModeChoiceItems[index].type);
	}, [onSenderTypeChanged]);

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
											onClick={() => onClickTemplate(i)}
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
					onChange={ev => onCommandInputChanged(ev.target!.value)}
					disabled={!isEnabled}
				/>

				<input
					type="text"
					className={styles["input-comment"]}
					placeholder="Comment"
					value={commentInput}
					onChange={ev => onCommentInputChanged(ev.target!.value)}
					disabled={!isEnabled}
				/>

				<button onClick={onClickSend} disabled={!isEnabled}>Send</button>

				<div className={styles.mode}>
					As:
					<ToolChoiceButton
						items={commentModeChoiceItems}
						pushedIndex={commentModeChoiceItems.findIndex(item => item.type === senderType)}
						disabled={isSenderTypeFixed || !isEnabled}
						onClick={handleChoiceSenderType}
					/>
				</div>
			</div>
		</div>
	);
});

interface CommentRowProps {
	comment: NicoliveComment;
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
