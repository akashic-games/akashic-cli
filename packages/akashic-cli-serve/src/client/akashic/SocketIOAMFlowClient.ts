import type * as amflow from "@akashic/amflow";
import type * as playlog from "@akashic/playlog";
import { Trigger } from "@akashic/trigger";
import type { Socket } from "socket.io-client";

export class SocketIOAMFlowClient implements amflow.AMFlow {
	onGotStartedAt: Trigger<number | null>;

	_permission: amflow.Permission | null;  // デバッグ用に保持。
	private _socket: Socket;
	private _tickHandlers: ((tick: playlog.Tick) => void)[];
	private _eventHandlers: ((ev: playlog.Event) => void)[];
	private _startedAt: number | null;
	private _eventQueue: playlog.Event[];
	private _connectionId: string | null;

	constructor(socket: Socket) {
		this.onGotStartedAt = new Trigger<number | null>();
		this._socket = socket;
		this._tickHandlers = [];
		this._eventHandlers = [];
		this._permission = null;
		this._startedAt = null;
		this._eventQueue = [];
		this._connectionId = null;
	}

	debugGetConnectionId(): string | null {
		return this._connectionId;
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

	/**
	 * 可能なタイミングでイベントを送る。
	 * SocketIOAMFlowClient独自拡張。暫定。
	 *
	 * TODO playIdでイベントを投げるAPIを作り、そちらを利用する。
	 */
	enqueueEvent(event: playlog.Event): void {
		if (this._permission != null) { // 暫定でなければpermissionの内容を踏まえるべき
			this.sendEvent(event);
		} else {
			this._eventQueue.push(event);
		}
	}

	/**
	 * getStartPoint() の Promise 版。
	 * SocketIOAMFlowClient独自拡張。
	 */
	getStartPointPromise(opts: amflow.GetStartPointOptions): Promise<amflow.StartPoint> {
		return new Promise((resolve, reject) => {
			this.getStartPoint(opts, (err, sp) => {
				void (err ? reject(err) : resolve(sp));
			});
		});
	}

	open(playId: string, callback?: (error: Error | null) => void): void {
		this._socket.on("amflow:[tick]", this._onTick);
		this._socket.on("amflow:[event]", this._onEvent);
		this._socket.emit("amflow:open", playId, (err: Error, connectionId?: string) => {
			if (err) {
				if (callback) callback(err);
				return;
			}
			this._connectionId = connectionId ?? null;
			if (callback) callback(null);
		});
	}

	close(callback?: (error: Error | null) => void): void {
		this._socket.off("amflow:[tick]", this._onTick);
		this._socket.off("amflow:[event]", this._onEvent);
		this._socket.emit("amflow:close", this._connectionId, callback);
		this._connectionId = null;
	}

	authenticate(token: string, callback: (error: Error, permission: amflow.Permission) => void): void {
		this._socket.emit("amflow:authenticate", this._connectionId, token, (error: Error, permission: amflow.Permission) => {
			this._permission = permission;

			this._eventQueue.forEach(ev => this.sendEvent(ev));
			this._eventQueue = [];

			callback(error, permission);
		});
	}

	sendTick(tick: playlog.Tick): void {
		this._socket.emit("amflow:sendTick", this._connectionId, tick);
	}

	onTick(handler: (tick: playlog.Tick) => void): void {
		this._tickHandlers.push(handler);
		if (this._tickHandlers.length === 1) {
			this._socket.emit("amflow:onTick", this._connectionId);
		}
	}

	offTick(handler: (tick: playlog.Tick) => void): void {
		this._tickHandlers = this._tickHandlers.filter(h => h !== handler);
		if (this._tickHandlers.length === 0) {
			this._socket.emit("amflow:offTick", this._connectionId);
		}
	}

	sendEvent(event: playlog.Event): void {
		this._socket.emit("amflow:sendEvent", this._connectionId, event);
	}

	onEvent(handler: (event: playlog.Event) => void): void {
		this._eventHandlers.push(handler);
		if (this._eventHandlers.length === 1) {
			this._socket.emit("amflow:onEvent", this._connectionId);
		}
	}

	offEvent(handler: (event: playlog.Event) => void): void {
		this._eventHandlers = this._eventHandlers.filter(h => h !== handler);
		if (this._eventHandlers.length === 0) {
			this._socket.emit("amflow:offEvent", this._connectionId);
		}
	}

	getTickList(
		optsOrBegin: number | amflow.GetTickListOptions,
		endOrCallback: number | ((error: Error | null, tickList?: playlog.TickList) => void),
		callbackOrUndefined?: (error: Error | null, tickList?: playlog.TickList) => void
	): void {
		let opts: amflow.GetTickListOptions;
		let callback: (error: Error | null, tickList?: playlog.TickList) => void;
		if (typeof optsOrBegin === "number") {
			// NOTE: optsOrBegin === "number" であれば必ず amflow@2 以前の引数だとみなしてキャストする
			opts = {
				begin: optsOrBegin,
				end: endOrCallback as number
			};
			callback = callbackOrUndefined as (error: Error | null, tickList?: playlog.TickList) => void;
		} else {
			// NOTE: optsOrBegin !== "number" であれば必ず amflow@3 以降の引数だとみなしてキャストする
			opts = optsOrBegin;
			callback = endOrCallback as (error: Error | null, tickList?: playlog.TickList) => void;
		}
		this._socket.emit("amflow:getTickList", this._connectionId, opts, callback);
	}

	putStartPoint(startPoint: amflow.StartPoint, callback: (error: Error) => void): void {
		this._socket.emit("amflow:putStartPoint", this._connectionId, startPoint, callback);
	}

	getStartPoint(opts: amflow.GetStartPointOptions, callback: (error: Error, startPoint: amflow.StartPoint) => void): void {
		this._socket.emit("amflow:getStartPoint", this._connectionId, opts, (err: Error, startPoint: amflow.StartPoint) => {
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
	getStorageData(_keys: playlog.StorageReadKey[], callback: (error: Error, values?: playlog.StorageData[]) => void): void {
		callback(new Error("not supported"));
	}

	private _onTick = (connectionId: string, tick: playlog.Tick): void => {
		if (connectionId !== this._connectionId)
			return;
		this._tickHandlers.forEach(h => h(tick));
	};

	private _onEvent = (connectionId: string, pev: playlog.Event): void => {
		if (connectionId !== this._connectionId)
			return;
		this._eventHandlers.forEach(h => h(pev));
	};
}
