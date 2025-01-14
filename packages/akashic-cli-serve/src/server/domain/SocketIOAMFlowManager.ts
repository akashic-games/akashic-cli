import type * as amf from "@akashic/amflow";
import { getSystemLogger } from "@akashic/headless-driver";
import * as pl from "@akashic/playlog";
import type { Socket } from "socket.io";
import type { ClientInstanceDescription } from "../../common/types/TestbedEvent.js";
import type { PlayStore } from "../domain/PlayStore.js";

export interface SocketIOAMFlowManagerParameterObject {
	playStore: PlayStore;
}

export interface Connection {
	playId: string;
	amflow: amf.AMFlow;
	socket: Socket;
	lastToken: string | null;
	emitTick: (tick: pl.Tick) => void;
	emitEvent: (ev: pl.Event) => void;
}

export class SocketIOAMFlowManager {
	private playStore: PlayStore;
	private descMap: { [token: string]: ClientInstanceDescription };
	private idCounter: number;

	private connectionMap: { [connId: string]: Connection };
	private connectionIdCounter: number;

	constructor(params: SocketIOAMFlowManagerParameterObject) {
		this.playStore = params.playStore;
		this.descMap = {};
		this.idCounter = 0;
		this.connectionMap = {};
		this.connectionIdCounter = 0;
	}

	createPlayToken(playId: string, playerId: string, name: string, isActive: boolean, envInfo: any): string {
		const token = this.playStore.createPlayToken(playId, isActive);
		const desc = { id: ++this.idCounter, playId, playerId, name, isActive, envInfo };
		this.descMap[token] = desc;
		return token;
	}

	deletePlayToken(token: string): void {
		const desc = this.descMap[token];
		if (!desc)
			return;
		this.playStore.unregisterClientInstance(desc.playId, desc);
		delete this.descMap[token];
	}

	setupSocketIOAMFlow(socket: Socket): void {
		socket.on("amflow:open", (playId: string, callback?: (e: Error | null, connectionId?: string) => void) => {
			getSystemLogger().info("a user connected. playId: " + playId);
			const amflow = this.playStore.createAMFlow(playId);
			const connId = "con" + (++this.connectionIdCounter);
			this.connectionMap[connId] = {
				playId,
				amflow,
				socket,
				lastToken: null,
				emitTick: (tick: pl.Tick) => {
					socket.emit("amflow:[tick]", connId, tick);
				},
				emitEvent: (event: pl.Event) => {
					socket.emit("amflow:[event]", connId, event);
				}
			};
			amflow.open(playId, callback ? (e => callback(e, connId)) : undefined);
		});

		socket.on(
			"amflow:authenticate",
			(connectionId: string, token: string, callback: (error: Error | null, permission: amf.Permission | undefined) => void) => {
				const conn = this.getConncetion(connectionId);
				if (!conn) {
					callback(this.makeConnectionError(connectionId), undefined);
					return;
				}
				conn.amflow.authenticate(token, (err, permission) => {
					if (err) {
						callback(err, undefined);
						return;
					}
					this.playStore.registerClientInstance(conn.playId, this.descMap[token]);
					conn.lastToken = token;
					callback(null, permission);
				});
			});

		socket.on("amflow:onTick", (connectionId: string) => {
			const conn = this.getConncetion(connectionId);
			if (!conn)
				return;
			conn.amflow.onTick(conn.emitTick);
		});

		socket.on("amflow:offTick", (connectionId: string) => {
			const conn = this.getConncetion(connectionId);
			if (!conn)
				return;
			conn.amflow.offTick(conn.emitTick);
		});

		socket.on("amflow:onEvent", (connectionId: string) => {
			const conn = this.getConncetion(connectionId);
			if (!conn)
				return;
			conn.amflow.onEvent(conn.emitEvent);
		});

		socket.on("amflow:offEvent", (connectionId: string) => {
			const conn = this.getConncetion(connectionId);
			if (!conn)
				return;
			conn.amflow.offEvent(conn.emitEvent);
		});

		socket.on("amflow:sendTick", (connectionId: string, tick: pl.Tick) => {
			const conn = this.getConncetion(connectionId);
			if (!conn)
				return;
			conn.amflow.sendTick(tick);
		});

		socket.on("amflow:sendEvent", (connectionId: string, event: pl.Event) => {
			const conn = this.getConncetion(connectionId);
			if (!conn)
				return;
			if (event[pl.EventIndex.Code] === pl.EventCode.Join) {
				const player = { id: event[pl.JoinEventIndex.PlayerId]!, name: event[pl.JoinEventIndex.PlayerName] };
				this.playStore.join(conn.playId, player);
			} else if (event[pl.EventIndex.Code] === pl.EventCode.Leave) {
				this.playStore.leave(conn.playId, event[pl.EventIndex.PlayerId]!);
			}
			conn.amflow.sendEvent(event);
		});

		socket.on(
			"amflow:getTickList",
			(connectionId: string, opts: amf.GetTickListOptions, callback: (error: Error | null, tickList?: pl.TickList) => void) => {
				const conn = this.getConncetion(connectionId);
				if (!conn)
					return callback(this.makeConnectionError(connectionId));
				conn.amflow.getTickList(opts, callback);
			}
		);

		socket.on("amflow:putStartPoint", (connectionId: string, startPoint: amf.StartPoint, callback: (error: Error | null) => void) => {
			const conn = this.getConncetion(connectionId);
			if (!conn)
				return callback(this.makeConnectionError(connectionId));
			conn.amflow.putStartPoint(startPoint, callback);
		});

		socket.on(
			"amflow:getStartPoint",
			(
				connectionId: string,
				opts: amf.GetStartPointOptions,
				callback: (error: Error | null, startPoint?: amf.StartPoint) => void
			) => {
				const conn = this.getConncetion(connectionId);
				if (!conn)
					return callback(this.makeConnectionError(connectionId));
				conn.amflow.getStartPoint(opts, callback);
			}
		);

		socket.on(
			"amflow:putStorageData",
			(connectionId: string, key: pl.StorageKey, value: pl.StorageValue, options: any, callback: (err: Error | null) => void) => {
				const conn = this.getConncetion(connectionId);
				if (!conn)
					return callback(this.makeConnectionError(connectionId));
				conn.amflow.putStorageData(key, value, options, callback);
			}
		);

		socket.on(
			"amflow:getStorageData",
			(connectionId: string, keys: pl.StorageReadKey[], callback: (error: Error | null, values?: pl.StorageData[]) => void) => {
				const conn = this.getConncetion(connectionId);
				if (!conn)
					return callback(this.makeConnectionError(connectionId));
				conn.amflow.getStorageData(keys, callback);
			}
		);

		socket.on("amflow:close", (connectionId: string, callback: () => void) => {
			const conn = this.getConncetion(connectionId);
			if (!conn)
				return callback();
			conn.amflow.close(callback);

			delete this.connectionMap[connectionId];
			getSystemLogger().info("user disconnected. playId: " + conn.playId + " connectionId: " + connectionId);
		});

		socket.on("disconnect", () => {
			const doNothing = (): void => {}; // eslint-disable-line @typescript-eslint/no-empty-function
			Object.keys(this.connectionMap).forEach(connId => {
				const conn = this.connectionMap[connId];
				if (conn.socket === socket) {
					this.deletePlayToken(conn.lastToken!);
					conn.amflow.close(doNothing);
					delete this.connectionMap[connId];
				}
			});
		});
	}

	private getConncetion(connectionId: string): Connection | null {
		const conn = this.connectionMap[connectionId];
		if (!conn)
			return null;
		if (!this.playStore.getPlay(conn.playId))
			return null;
		return conn;
	}

	private makeConnectionError(connectionId: string): Error {
		const conn = this.connectionMap[connectionId];
		if (!conn)
			return new Error(`Invalid connectionId: ${connectionId}`);
		if (!this.playStore.getPlay(conn.playId))
			return new Error(`Already closed play. play: ${connectionId}`);
		return Error("Unknown Error on SocketIOAMFlowManager");
	}
}
