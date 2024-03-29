export interface ContentLocatorData {
	// serve のサーバが /contents/:id/ でホストしているコンテンツ (の :id) 。
	// この値が存在すれば必ずこちらが優先される。
	contentId?: string | null;

	// 拡張性のために予約される。
	host?: string | null;
	path?: string | null;
	debuggablePath?: string | null;
}
