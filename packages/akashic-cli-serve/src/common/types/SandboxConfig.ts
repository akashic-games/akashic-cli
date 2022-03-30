export interface SandboxConfig {
	/**
	 * @deprecated 非推奨。将来削除する予定。
	 * autoSendEventName の使用が正となる。autoSendEventName が存在する場合にこの値は無視される。
	 */
	autoSendEvents?: string;
	autoSendEventName?: string;
	backgroundImage?: string;
	backgroundColor?: string;
	showMenu?: boolean;
	events?: { [name: string]: any };
	arguments?: { [name: string]: any };
	externalAssets?: (string | RegExp)[] | null;
}
