/**
 * callback が関数であるなら err を与えて呼び出す。でなければ err を throw する。
 *
 * 以下すべてを満たす時に利用すること。
 * (a) エラー通知用のコールバックが省略可能で、必ずしもそれでエラー通知ができない
 * (b) err がロジックエラー (コンテンツ開発者の対応が必要) であり、serve としてはゲーム開発者が確実に気づける形が望ましい
 * (c) 通知したいエラーが同期的に発生している
 */
export function callOrThrow(callback: ((err?: Error) => void) | null | undefined, err: Error): void {
	if (callback) {
		callback(err);
	} else {
		throw err;
	}
}
