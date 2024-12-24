import { observable, action } from "mobx";
import type { NicoliveCommentEventComment } from "../../common/types/NicoliveCommentPlugin";

/**
 * コメント送信者タイプ。
 *
 * - "anonymous": 匿名の視聴者。コメントを isAnonymous: true で送る
 * - "named": 顕名の視聴者。isAnonymous, isOperatorComment なしで送る
 * - "operator": 放送者。コメントを isOperatorComment: true で送る
 */
export type NiconicoDevtoolCommentPageSenderType = "anonymous" | "named" | "operator";

/**
 * コメント送信者タイプの制限。
 *
 * - "operator": 放送者。 "operator" しか選べない
 * - "audience": 非放送者。 "named" か "anonymous" しか選べない
 * - "none": 制限なし
 */
export type NiconicoDevtoolCommentPageSenderLimitation = "operator" | "audience" | "none";

export class DevtoolUiCommentPageStore {
	@observable comments: NicoliveCommentEventComment[] = [];
	@observable templates: string[] = [];
	@observable isEnabled: boolean = false;
	@observable senderType: NiconicoDevtoolCommentPageSenderType = "anonymous";
	@observable senderLimitation: NiconicoDevtoolCommentPageSenderLimitation = "none";
	@observable commandInput: string = "";
	@observable commentInput: string = "";

	@action
	addComments(comments: NicoliveCommentEventComment[]): void {
		this.comments.push(...comments);
	}

	@action
	resetComments(): void {
		this.comments.length = 0;
	}

	@action
	setTemplates(templates: string[]): void {
		this.templates = templates;
	}

	@action
	setIsEnabled(isEnabled: boolean): void {
		this.isEnabled = isEnabled;
	}

	@action
	setSenderType(senderType: NiconicoDevtoolCommentPageSenderType): void {
		this.senderType = senderType;
	}

	@action
	setSenderLimitation(limiatation: NiconicoDevtoolCommentPageSenderLimitation): void {
		this.senderLimitation = limiatation;
	}

	@action
	setCommandInput(input: string): void {
		this.commandInput = input;
	}

	@action
	setCommentInput(input: string): void {
		this.commentInput = input;
	}
}
