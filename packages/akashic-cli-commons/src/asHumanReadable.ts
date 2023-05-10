/**
 * バイト数をヒューマンリーダブルな文字列に変換する。
 * Ki, Mi, Gi の2進接頭語に対応。
 * @param byteLength バイト数
 * @param fractionDigits 小数点以下の桁数
 */
export function asHumanReadable(byteLength: number, fractionDigits?: number): string {
	if (byteLength < 1024) {
		return `${byteLength} Bytes`;
	}
	// 1024 * 1024
	if (byteLength < 1048576) {
		return `${(byteLength / 1024).toFixed(fractionDigits)} KiB`;
	}
	// 1024 * 1024 * 1024
	if (byteLength < 1073741824) {
		return `${(byteLength / 1048576).toFixed(fractionDigits)} MiB`;
	}
	return `${(byteLength / 1073741824).toFixed(fractionDigits)} GiB`;
}
