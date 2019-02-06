export class TimeKeeper {
	origin: number | null;
	pausedTime: number;
	rate: number;
	offset: number;

	constructor() {
		this.origin = null;
		this.pausedTime = 0;
		this.rate = 1;
		this.offset = 0;
	}

	isPausing(): boolean {
		return this.pausedTime != null;
	}

	now(): number {
		if (this.origin === null) {
			return 0;
		}
		return (this.isPausing()) ? this.pausedTime : ((Date.now() - this.origin) * this.rate + this.offset);
	}

	setTime(time: number): void {
		if (this.isPausing()) {
			this.pausedTime = time;
		} else {
			this.origin = Date.now();
			this.offset = time;
		}
	}

	start(origin: number = Date.now()): void {
		if (!this.isPausing()) {
			return;
		}
		this.origin = origin;
		this.offset = this.pausedTime;
		this.pausedTime = null;
	}

	pause(): void {
		if (this.isPausing()) {
			return;
		}
		this.pausedTime = this.now();
	}
}
