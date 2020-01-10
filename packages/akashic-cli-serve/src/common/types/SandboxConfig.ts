export interface SandboxConfig {
	/**
	 * @deprecated 非推奨。将来削除する予定。
	 */
	autoSendEvents?: string;
	autoSendEventName?: string;
	backgroundImage?: string;
	showMenu?: boolean;
	events?: { [name: string]: any };
	arguments?: { [name: string]: any };
	externalAssets?: (string | RegExp)[] | null;
}
