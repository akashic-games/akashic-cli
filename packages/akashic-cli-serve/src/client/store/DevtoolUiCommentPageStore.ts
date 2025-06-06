import { observable, action } from "mobx";
import type { NamagameCommentEventComment } from "../../common/types/NamagameCommentPlugin";

export class DevtoolUiCommentPageStore {
	@observable comments: NamagameCommentEventComment[] = [];
	@observable templates: string[] = [];
	@observable isEnabled: boolean = false;
	@observable asAnonymous: boolean = true;
	@observable commandInput: string = "";
	@observable commentInput: string = "";

	@action
	addComments(comments: NamagameCommentEventComment[]): void {
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
	setAsAnonymous(asAnonymous: boolean): void {
		this.asAnonymous = asAnonymous;
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
