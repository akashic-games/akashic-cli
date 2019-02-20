import * as amflow from "@akashic/amflow";
import * as playlog from "@akashic/playlog";
import { Trigger } from "@akashic/trigger";

// TODO 複数インスタンスを作れるようにする(現状イベント名がかぶるのでSocketごとに一インスタンスしか作れない)
export class SocketIOAMFlowClient implements amflow.AMFlow {
	onGotStartedAt: Trigger<number>;

	_permission: amflow.Permission | null;  // デバッグ用に保持。
	private _socket: SocketIOClient.Socket;
	private _tickHandlers: ((tick: playlog.Tick) => void)[];
	private _eventHandlers: ((ev: playlog.Event) => void)[];
	private _startedAt: number | null;

	constructor(socket: SocketIOClient.Socket) {
		this.onGotStartedAt = new Trigger<number>();
		this._socket = socket;
		this._tickHandlers = [];
		this._eventHandlers = [];
		this._permission = null;
		this._startedAt = null;
	}

	/**
	 * 現状開いているplayの開始時刻を取得する。
	 * SocketIOAMFlowClient独自拡張。暫定。
	 *
	 * この値が null の場合は、以降 (最初に getStartPoint() が呼ばれた時点で) onGotStartedAt がfireされる。
	 *
	 * TODO 開始時刻は、おそらくサーバ側で putStartPoint() に反応してpush通知する方がクリーン。
	 * その場合 getPlay() の情報にも開始時刻を含めることになる。
	 * ただし現状では Runner からの putStartPoint() を監視する方法がない。
	 */
	getStartedAt(): number | null {
		return this._startedAt;
	}

	open(playId: string, callback?: (error?: Error) => void): void {
		// TODO callback may not be able to be passed Error.
		this._socket.emit("amflow:open", playId, callback);
		this._socket.on("amflow:[tick]", this._onTick);
		this._socket.on("amflow:[event]", this._onEvent);
	}

	close(callback?: (error?: Error) => void): void {
		this._socket.off("amflow:[tick]", this._onTick);
		this._socket.off("amflow:[event]", this._onEvent);
		this._socket.emit("amflow:close", callback);
	}

	authenticate(token: string, callback: (error: Error, permission: amflow.Permission) => void): void {
		this._socket.emit("amflow:authenticate", token, (error: Error, permission: amflow.Permission) => {
			this._permission = permission;
			callback(error, permission);
		});
	}

	sendTick(tick: playlog.Tick): void {
		this._socket.emit("amflow:sendTick", tick);
	}

	onTick(handler: (tick: playlog.Tick) => void): void {
		this._tickHandlers.push(handler);
		this._socket.emit("amflow:onTick");
	}

	offTick(handler: (tick: playlog.Tick) => void): void {
		this._tickHandlers = this._tickHandlers.filter(h => h !== handler);
		this._socket.emit("amflow:offTick");
	}

	sendEvent(event: playlog.Event): void {
		this._socket.emit("amflow:sendEvent", event);
	}

	onEvent(handler: (event: playlog.Event) => void): void {
		this._eventHandlers.push(handler);
		this._socket.emit("amflow:onEvent");
	}

	offEvent(handler: (event: playlog.Event) => void): void {
		this._eventHandlers = this._eventHandlers.filter(h => h !== handler);
		this._socket.emit("amflow:offEvent");
	}

	getTickList(begin: number, end: number, callback: (error: Error, tickList: playlog.TickList) => void): void {
		this._socket.emit("amflow:getTickList", begin, end, callback);
	}

	putStartPoint(startPoint: amflow.StartPoint, callback: (error: Error) => void): void {
		this._socket.emit("amflow:putStartPoint", startPoint, callback);
	}

	getStartPoint(opts: amflow.GetStartPointOptions, callback: (error: Error, startPoint: amflow.StartPoint) => void): void {
		this._socket.emit("amflow:getStartPoint", opts, (err: Error, startPoint: amflow.StartPoint) => {
			if ((this._startedAt === null) && !err && opts.frame === 0) {
				this._startedAt = startPoint.data.startedAt;
				this.onGotStartedAt.fire(this._startedAt);
			}
			callback(err, startPoint);
		});
	}

	// 継承元のinterfaceに合わせるためのメソッド定義。noUnusedParametersを無視するために利用されていない引数のprefixに_を付けた
	putStorageData(_key: playlog.StorageKey, _value: playlog.StorageValue, _options: any, callback: (err: Error) => void): void {
		callback(new Error("not supported"));
	}

	// 継承元のinterfaceに合わせるためのメソッド定義。noUnusedParametersを無視するために利用されていない引数のprefixに_を付けた
	getStorageData(_keys: playlog.StorageReadKey[], callback: (error: Error, values: playlog.StorageData[]) => void): void {
		callback(new Error("not supported"), null);
	}

	private _onTick = (tick: playlog.Tick): void => {
		this._tickHandlers.forEach(h => h(tick));
	}

	private _onEvent = (pev: playlog.Event): void => {
		this._eventHandlers.forEach(h => h(pev));
	}
}
