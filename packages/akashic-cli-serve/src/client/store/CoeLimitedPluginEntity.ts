import * as pl from "@akashic/playlog";
import { observable, action, computed } from "mobx";
import { storage } from "./storage";

export interface PlayerInfoResolverResultMessage {
	result: {
		name: string;
		userData: {
			accepted: boolean;
			premium: boolean;
		};
	};
}

export interface StartLocalSessionPameterObject {
	sessionId: string;
	applicationName: string;
	localEvents: pl.Event[];
	messageHandler: (message: PlayerInfoResolverResultMessage) => void;
}

const DEFAULT_LIMIT_MILLISECONDS = 15 * 1000;
const ALLOWED_APPLICATION_NAME = "player-info-resolver";

// TODO: 本来このEntityはakashicの文脈に依存するものなのでakashicディレクトリで定義して、コンポーネントで利用するプロパティはStoreに、関数はOperatorに定義すべき
export class CoeLimitedPluginEntity {
	@observable isDisplayingResolver: boolean;
	@observable remainingMilliSeconds: number;
	@observable messageHandler: (message: PlayerInfoResolverResultMessage) => void;
	@observable name: string;
	@observable guestName: string;
	private sessionId: string;
	private timerId: number | null;

	constructor() {
		this.isDisplayingResolver = false;
		this.remainingMilliSeconds = DEFAULT_LIMIT_MILLISECONDS;
		this.name = storage.data.playerName;
		this.guestName = "ゲスト" + ((Math.random() * 100) | 0);
	}
	/* eslint-disable @typescript-eslint/indent */
	// annotation の次行の関数式でインデントエラーとなるため disable とする。

	// 名前表示確認ダイアログを表示する。この関数はコンテンツ側から呼ばれる想定
	@action
	startLocalSession = (param: StartLocalSessionPameterObject): void => {
		if (param.applicationName !== ALLOWED_APPLICATION_NAME) {
			return;
		}
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
		this.timerId = window.setInterval(() => {
			this.calculateRemainingMilliSeconds(limitMilliSeconds, startingDateTime);
			if (this.remainingMilliSeconds === 0 && this.timerId != null) {
				this.sendName(false);
			}
		}, 200); // 1s毎だと表示と実際の時間に若干のズレが生まれそうなので、やや間隔短めに残り時間の算出を行う
	};

	// 名前表示確認ダイアログを消す。この関数はコンテンツ側から呼ばれる想定
	@action
	exitLocalSession = (_sessionId: string): void => {
		this.stopToDisplayResolver();
	};

	@action
	stopToDisplayResolver(): void {
		if (this.timerId != null) {
			window.clearInterval(this.timerId);
		}
		this.isDisplayingResolver = false;
		this.timerId = null;
	}

	@computed
	get remainingSeconds(): number {
		return Math.ceil(this.remainingMilliSeconds / 1000);
	}

	@action
	sendName = (accepted: boolean): void => {
		if (this.messageHandler) {
			this.messageHandler({
				result: {
					name: accepted ? this.name : this.guestName,
					userData: { accepted, premium: storage.data.premium }
				}
			});
		}
		if (this.timerId != null) {
			this.exitLocalSession(this.sessionId);
		}
	};

	@action
	private calculateRemainingMilliSeconds = (limitTime: number, startingDateTime: number): void => {
		this.remainingMilliSeconds = limitTime - (Date.now() - startingDateTime);
		if (this.remainingMilliSeconds <= 0) {
			this.remainingMilliSeconds = 0;
		}
	};
	/* eslint-enable @typescript-eslint/indent */
}
