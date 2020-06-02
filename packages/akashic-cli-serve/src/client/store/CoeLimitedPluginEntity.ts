import { observable, action, computed } from "mobx";
import * as pl from "@akashic/playlog";
import { storage } from "./storage";

export interface UsernameDisplayAuthorizationMessage {
	result: {
		name: string;
		userData: {
			accepted: boolean;
		};
	};
}

export interface StartLocalSessionPameterObject {
	sessionId: string;
	localEvents: pl.Event[];
	messageHandler: (message: UsernameDisplayAuthorizationMessage) => void;
}

const DEFAULT_LIMIT_MILLISECONDS = 15 * 1000;
const DEFAULT_PLAYER_NAME = "akashic-cli-serve-player";

export class CoeLimitedPluginEntity {
	@observable isDisplayingResolver: boolean;
	@observable remainingMilliSeconds: number;
	@observable messageHandler: (message: UsernameDisplayAuthorizationMessage) => void;
	private sessionId: string;
	private timerId: NodeJS.Timer | null;

	constructor() {
		this.isDisplayingResolver = false;
		this.remainingMilliSeconds = DEFAULT_LIMIT_MILLISECONDS;
	}

	@action
	startLocalSession = (param: StartLocalSessionPameterObject): void => {
		this.messageHandler = param.messageHandler;
		this.isDisplayingResolver = true;
		this.sessionId = param.sessionId;
		// NOTE: この場合、ページリロード時に表示上だけ制限時間がリセットされてしまう(実際はリセットされない)ので、現在時刻ではなくゲームの起動時刻を取得した方が良さそう？
		const startingDateTime = Date.now();
		let limitMilliSeconds = DEFAULT_LIMIT_MILLISECONDS;
		const localEventData = param.localEvents[0][pl.MessageEventIndex.Data];
		if (localEventData && localEventData.parameters && localEventData.parameters.limitSeconds) {
			limitMilliSeconds = localEventData.parameters.limitSeconds * 1000;
		}
		this.timerId = setInterval(() => {
			this.calculateRemainingMilliSeconds(limitMilliSeconds, startingDateTime);
			if (this.remainingMilliSeconds === 0 && this.timerId != null) {
				this.sendName(false);
			}
		}, 200); // 1s毎だと表示と実際の時間に若干のズレが生まれそうなので、やや間隔短めに残り時間の算出を行う
	}

	@action
	exitLocalSession = (_sessionId: string): void => {
		clearInterval(this.timerId);
		this.isDisplayingResolver = false;
		this.timerId = null;
	}

	@computed
	get remainingSeconds(): number {
		return Math.ceil(this.remainingMilliSeconds / 1000);
	}

	@action.bound
	sendName(accepted: boolean): void {
		if (this.messageHandler) {
			this.messageHandler({
				result: {
					name: accepted ? storage.data.playerName : DEFAULT_PLAYER_NAME,
					userData: { accepted }
				}
			});
		}
		if (this.timerId != null) {
			this.exitLocalSession(this.sessionId);
		}
	}

	@action.bound
	private calculateRemainingMilliSeconds(limitTime: number, startingDateTime: number): void {
		this.remainingMilliSeconds = limitTime - (Date.now() - startingDateTime);
		if (this.remainingMilliSeconds <= 0) {
			this.remainingMilliSeconds = 0;
		}
	}
}
