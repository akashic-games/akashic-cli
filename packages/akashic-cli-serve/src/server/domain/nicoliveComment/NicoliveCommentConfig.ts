// TODO sandbox-configuration に移動

export interface NicoliveCommentConfigComment {
	comment: string;
	command?: string;
	userID: string;
	isAnonymous?: boolean;
	isOperatorComment?: boolean;
	frame?: number;
}

export interface NicoliveCommentConfigTemplate {
	startBy?: "playStart" | "pluginStart" | "ui";
	// repeatAfter?: number | null;
	comments: NicoliveCommentConfigComment[];
}

export interface NicoliveCommentConfig {
	templates: { [name: string]: NicoliveCommentConfigTemplate };
}
