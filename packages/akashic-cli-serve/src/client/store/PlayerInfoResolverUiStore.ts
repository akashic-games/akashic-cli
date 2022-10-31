import { Trigger } from "@akashic/trigger";
import { observable, action, computed } from "mobx";
import type { PlayerInfoResolverResultMessage } from "../akashic/plugin/CoeLimitedPlugin";
import { storage } from "./storage";

const DEFAULT_LIMIT_MILLISECONDS = 15 * 1000;

export class PlayerInfoResolverUiStore {
	onResolve: Trigger<PlayerInfoResolverResultMessage> = new Trigger();
	@observable isDisplayingResolver: boolean = false;
	@observable remainingMilliSeconds: number = DEFAULT_LIMIT_MILLISECONDS;
	@observable name: string = "";
	@observable guestName: string = "ゲスト" + ((Math.random() * 100) | 0);
	private timerId!: number | null;

	async assertInitialized(): Promise<void> {
		await storage.assertInitialized();
		this.name = storage.data.playerName;
	}

	@action.bound
	showDialog(limitSeconds?: number): void {
		this.isDisplayingResolver = true;
		// NOTE: この場合、ページリロード時に表示上だけ制限時間がリセットされてしまう(実際はリセットされない)ので、現在時刻ではなくゲームの起動時刻を取得した方が良さそう？
		const startingDateTime = Date.now();
		const limitMilliSeconds = limitSeconds ? (limitSeconds * 1000) : DEFAULT_LIMIT_MILLISECONDS;

		this.timerId = window.setInterval(() => {
			this.setRemainingMilliSeconds(limitMilliSeconds - (Date.now() - startingDateTime));
			if (this.remainingMilliSeconds === 0 && this.timerId != null) {
				this._clearTimerIfNeeded();
				this._fireResolve(false);
			}
		}, 200); // 1s毎だと表示と実際の時間に若干のズレが生まれそうなので、やや間隔短めに残り時間の算出を行う
	};

	@action.bound
	hideDialog(): void {
		this.isDisplayingResolver = false;
		this._clearTimerIfNeeded();
	}

	@action.bound
	finishDialog(accepted: boolean): void {
		this.hideDialog();
		this._fireResolve(accepted);
	}

	@computed
	get remainingSeconds(): number {
		return Math.ceil(this.remainingMilliSeconds / 1000);
	}

	@action
	setRemainingMilliSeconds(ms: number): void {
		this.remainingMilliSeconds = Math.max(0, ms);
	}

	private _clearTimerIfNeeded(): void {
		if (this.timerId != null) {
			window.clearInterval(this.timerId);
			this.timerId = null;
		}
	}

	private _fireResolve(accepted: boolean): void {
		this.onResolve.fire({
			result: {
				name: accepted ? this.name : this.guestName,
				userData: { accepted, premium: storage.data.premium }
			}
		});
	}
}
