// game.ejs で参照されるため、未使用の lint エラーを抑止
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class TimeKeeper {
	_origin: number;
	_pausedTime: number;
	_limit: number;
	_rate: number;
	_offset: number;

	constructor(limit?: number) {
		this._origin = Date.now();
		this._pausedTime = 0;
		this._limit = limit || Infinity;
		this._rate = 1;
		this._offset = 0;
	}

	now(): number {
		const time = (this.isPausing()) ? this._pausedTime : ((Date.now() - this._origin) * this._rate + this._offset);
		return Math.min(time, this._limit);
	}

	setTime(time: number): void {
		if (this.isPausing()) {
			this._pausedTime = time;
		} else {
			this._origin = Date.now();
			this._offset = time;
		}
	}

	isPausing(): boolean {
		return this._pausedTime != null;
	}

	start(): void {
		if (!this.isPausing())
			return;
		this._origin = Date.now();
		this._offset = this._pausedTime;
		this._pausedTime = null;
	}

	pause(): void {
		if (this.isPausing())
			return;
		this._pausedTime = this.now();
	}

	getRate(): number {
		return this._rate;
	}

	setRate(rate: number): void {
		if (this._rate === rate)
			return;
		this.setTime(this.now());
		this._rate = rate;
	}
}
