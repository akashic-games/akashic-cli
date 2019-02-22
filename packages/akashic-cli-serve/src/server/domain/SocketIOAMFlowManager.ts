import { Socket } from "socket.io";
import { Permission } from "@akashic/amflow";
import { Event, Tick, EventCode, EventIndex, JoinEventIndex } from "@akashic/playlog";
import { getSystemLogger } from "@akashic/headless-driver";
import { ClientInstanceDescription } from "../../common/types/TestbedEvent";
import { PlayStore } from "../domain/PlayStore";

export interface SocketIOAMFlowManagerParameterObject {
	playStore: PlayStore;
}

export class SocketIOAMFlowManager {
	private playStore: PlayStore;
	private descMap: { [token: string]: ClientInstanceDescription };
	private idCounter: number;

	constructor(params: SocketIOAMFlowManagerParameterObject) {
		this.playStore = params.playStore;
		this.descMap = {};
		this.idCounter = 0;
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
		// TODO playId ごとに amflow を複数作れるようにする。(現状は同時に一つしかない前提になっている)
		function clearListeners(): void {
			socket.removeAllListeners("amflow:authenticate");
			socket.removeAllListeners("amflow:onTick");
			socket.removeAllListeners("amflow:offTick");
			socket.removeAllListeners("amflow:onEvent");
			socket.removeAllListeners("amflow:offEvent");
			socket.removeAllListeners("amflow:sendTick");
			socket.removeAllListeners("amflow:sendEvent");
			socket.removeAllListeners("amflow:getTickList");
			socket.removeAllListeners("amflow:putStartPoint");
			socket.removeAllListeners("amflow:getStartPoint");
			socket.removeAllListeners("amflow:putStorageData");
			socket.removeAllListeners("amflow:getStorageData");
			socket.removeAllListeners("amflow:close");
			socket.removeAllListeners("disconnect");
		}

		socket.on("amflow:open", (playId: string, callback?: (e?: Error) => void) => {
			getSystemLogger().info("a user connected. playId: " + playId);
			let lastToken: string = null;
			const amflow = this.playStore.createAMFlow(playId);
			const emitTick = ((tick: Tick) => socket.emit("amflow:[tick]", tick));
			const emitEvent = ((ev: Event) => socket.emit("amflow:[event]", ev));

			amflow.open(playId, (e?: Error) => {
				if (e) {
					if (callback) {
						callback(e);
					}
					return;
				}

				const that = this;
				// TODO この暫定対応をやめてheadless-driverでamflowが破棄済みのケースをカバーする。
				function wrap(f: (...args: any[]) => void): (...args: any[]) => void {
					return function () {
						if (!that.playStore.getPlay(playId)) {
							const cb = arguments[arguments.length - 1];
							if (typeof cb === "function") {
								cb(new Error(`Already closed play. PlayId: ${playId}`));
							}
							return;
						}
						return f.apply(this, arguments);
					};
				}

				socket.on("amflow:authenticate", wrap((token: string, callback: (error: Error, permission: Permission) => void) => {
					amflow.authenticate(token, (error: Error, permission: Permission) => {
						if (error) {
							callback(error, null);
							return;
						}
						lastToken = token;
						this.playStore.registerClientInstance(playId, this.descMap[token]);

						socket.on("amflow:onTick", wrap(() => amflow.onTick(emitTick)));
						socket.on("amflow:offTick", wrap(() => amflow.offTick(emitTick)));
						socket.on("amflow:onEvent", wrap(() => amflow.onEvent(emitEvent)));
						socket.on("amflow:offEvent", wrap(() => amflow.offEvent(emitEvent)));
						socket.on("amflow:sendTick", wrap(amflow.sendTick.bind(amflow)));
						socket.on("amflow:sendEvent", wrap((event: Event) => {
							if (event[EventIndex.Code] === EventCode.Join) {
								this.playStore.join(playId, {
									id: event[JoinEventIndex.PlayerId],
									name: event[JoinEventIndex.PlayerName]
								});
							} else if (event[EventIndex.Code] === EventCode.Leave) {
								this.playStore.leave(playId, event[EventIndex.PlayerId]);
							}
							amflow.sendEvent(event);
						}));
						socket.on("amflow:getTickList", wrap(amflow.getTickList.bind(amflow)));
						socket.on("amflow:putStartPoint", wrap(amflow.putStartPoint.bind(amflow)));
						socket.on("amflow:getStartPoint", wrap(amflow.getStartPoint.bind(amflow)));
						socket.on("amflow:putStorageData", wrap(amflow.putStorageData.bind(amflow)));
						socket.on("amflow:getStorageData", wrap(amflow.getStorageData.bind(amflow)));
						socket.on("amflow:close", wrap((callback: () => void) => {
							getSystemLogger().info("user disconnected. playId: " + playId);
							amflow.close(callback);
							clearListeners();
						}));
						callback(null, permission);
					});
				}));
				socket.on("disconnect", wrap(() => {
					getSystemLogger().info("user disconnected. playId: " + playId);
					amflow.close(() => { return; });
					this.deletePlayToken(lastToken);
					clearListeners();
				}));
				if (callback) {
					callback();
				}
			});
		});
	}
}
