// TODO コンテンツから参照できるように切り出す

export interface NicoliveComment {
	comment?: string;
	command?: string;
	userID?: string;
	isAnonymous?: boolean;
	isOperatorComment?: boolean;
}

export interface NicoliveCommentStartOptions {
	fields?: (keyof NicoliveComment)[];
}

export interface NicoliveCommentPlugin {
	start(opts: NicoliveCommentStartOptions, callback?: (err?: Error) => void): void;
	stop(): void;
}
