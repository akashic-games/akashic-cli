import { observer } from "mobx-react";
import * as React from "react";
import type { NamagameCommentEventComment } from "../../../common/types/NamagameCommentPlugin";
import type {
	NiconicoDevtoolCommentPageSenderLimitation,
	NiconicoDevtoolCommentPageSenderType
} from "../../store/DevtoolUiCommentPageStore";
import { ToolChoiceButton, type ToolChoiceButtonItem } from "../atom/ToolChoiceButton";
import styles from "./NiconicoDevtoolCommentPage.module.css";

export interface NiconicoDevtoolCommentPagePropsModel {
	comments: NamagameCommentEventComment[];
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
	{ label: "Broadcaster", title: "配信者としてコメント", type: "broadcaster" },
];

const commentModeChoiceItemsTable: { [limitation in NiconicoDevtoolCommentPageSenderLimitation]: typeof commentModeChoiceItemsBase } = {
	broadcaster: commentModeChoiceItemsBase.map(item => ({ ...item, disabled: item.type !== "broadcaster" })),
	audience: commentModeChoiceItemsBase.map(item => ({ ...item, disabled: item.type === "broadcaster" })),
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
							NamagameComment plugin is not enabled.<br/>
							(<code>environment.external.namagameComment</code> must be set in game.json to send/list comments here.)
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
	comment: NamagameCommentEventComment;
	index: number;
}

const CommentRow = observer(function CommentRow(props: CommentRowProps) {
	const { comment: commentEntry, index } = props;
	const { command, comment, userID, isAnonymous, vpos } = commentEntry;

	return (
		<div className={styles["comment-row"]}>
			<span className={styles.index}>{index + 1}</span>
			{
				(vpos != null) ?
					<span className={styles.vpos}>{formatCentiseconds(vpos)}</span> :
					null
			}
			<span className={userID == null ? styles.broadcaster : ""}>{comment}</span>
			{
				command ?
					<span className={styles.aux}>{command}</span> :
					null
			}
			{
				!isAnonymous && userID ?
					<span className={styles.aux}>userID: {userID}</span> :
					null
			}
		</div>
	);
});

function formatCentiseconds(centiseconds: number): string {
	const csecs = centiseconds % 100;
	const secs = Math.floor(centiseconds / 100) % 60;
	const mins = Math.floor(centiseconds / 6000) % 60;
	const hours = Math.floor(centiseconds / 360000);

	const hs = hours > 0 ? ("" + hours).padStart(2, "0") + ":" : "";
	const ms = ("" + mins).padStart(2, "0");
	const ss = ("" + secs).padStart(2, "0");
	const cs = csecs.toString().padStart(2, "0");
	return `${hs}${ms}:${ss}.${cs}`;
}
