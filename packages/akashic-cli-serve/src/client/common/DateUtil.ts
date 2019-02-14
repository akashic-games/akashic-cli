export class DateUtil {
	static toHms(sec: number) {
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

	static toHmsFromMsec(msec: number) {
		return DateUtil.toHms(Math.floor(msec / 1000));
	}
}
