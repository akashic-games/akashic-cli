import { time, timeStamp } from "console";

export function secondsToHms(sec: number): string {
	function pad(x: number) {
		return (x < 10) ? "0" + x : x;
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

export function timeValueToString(timeValue: number): string {
	timeValue -= timezoneOffset * 60 * 1000;
	return new Date(timeValue).toISOString().split("T").join(" ").replace("Z", timezoneStr);
}
