export function secondsToHms(sec: number): string {
	function pad(x: number): string {
		return ((x < 10) ? "0" : "") + x;
	}
	const sign = sec < 0 ? "-" : "";
	const secAbs = Math.abs(sec);
	const h = Math.floor(secAbs / 3600);
	const m = Math.floor(secAbs / 60) % 60;
	const s = secAbs % 60;
	return sign + ((h === 0) ? `${m}:${pad(s)}` : `${h}:${pad(m)}:${pad(s)}`);
}

export function millisecondsToHms(msec: number): string {
	return secondsToHms(Math.floor(msec / 1000));
}

const timezoneOffset = (new Date()).getTimezoneOffset();
const timezoneStr =
	(timezoneOffset > 0) ? " GMT" + (-timezoneOffset / 60) :
	(timezoneOffset < 0) ? " GMT+" + (-timezoneOffset / 60) :
	"Z";

/**
 * Time value (1970/1/1 00:00:00 UTC からの経過時刻のミリ秒) を文字列にする。
 *
 * `Date.prototype.toISOString()` (ISO 8601) とは、
 * "T" ではなく空白文字を使う点、およびタイムゾーンを考慮する点で異なる。
 * 利用イメージは以下:
 *
 * ```
 * timeValueToString(Date.now()) // ==> "2021-11-11 19:57:52.938 GMT+9"
 * ```
 */
export function timeValueToString(timeValue: number): string {
	timeValue -= timezoneOffset * 60 * 1000;
	return new Date(timeValue).toISOString().split("T").join(" ").replace("Z", timezoneStr);
}

