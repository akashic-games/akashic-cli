import * as http from "http";
import type { AMFlow, Permission } from "@akashic/amflow";
import * as hld from "@akashic/headless-driver";
import type { Event, Tick, TickList } from "@akashic/playlog";
import getPort from "get-port";
import * as socketio from "socket.io";
import io from "socket.io-client";
import { SocketIOAMFlowClient } from "../../client/akashic/SocketIOAMFlowClient.js";
import { ServerContentLocator } from "../common/ServerContentLocator.js";
import { PlayStore } from "../domain/PlayStore.js";
import { SocketIOAMFlowManager } from "../domain/SocketIOAMFlowManager.js";

interface Awaiter<T> {
	promise: Promise<T>;
	resolve: (value: T | PromiseLike<T>) => void;
	reject: (reason?: any) => void;
}

function makeAwaitee<T = void>(): Awaiter<T> {
	let resolve: (value: T | PromiseLike<T>) => void;
	let reject: (reason?: any) => void;
	const promise = new Promise<T>((res, rej) => {
		resolve = res;
		reject = rej;
	});
	return { promise, resolve: resolve!, reject: reject! };
}


describe("SocketIOAMFlowManager", () => {
	let testServerPort: number;

	let logger: hld.SystemLogger;
	beforeAll(async () => {
		testServerPort = await getPort();
		// TODO setSystemLogger() 依存をやめる
		logger = hld.getSystemLogger();
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		hld.setSystemLogger({ info: () => {}, debug: () => {}, warn: () => {}, error: () => {} });
	});
	afterAll(() => {
		hld.setSystemLogger(logger);
	});

	let socketIOServer: socketio.Server;
	beforeEach(async () => {
		const server = new http.Server();
		socketIOServer = new socketio.Server(server);
		const { promise, resolve } = makeAwaitee();
		server.listen(testServerPort, resolve);
		return promise;
	});
	afterEach(async () => {
		const { promise, resolve } = makeAwaitee();
		socketIOServer.close(() => {
			socketIOServer = null!;
			resolve();
		});
		return promise;
	});

	it("can be instantiated", () => {
		const playStore = new PlayStore({ playManager: new hld.PlayManager() });
		const amflowManager = new SocketIOAMFlowManager({ playStore });
		expect(amflowManager).toBeTruthy();
	});

	it("provides AMFlow functions with connectionId", async () => {
		let socket: ReturnType<typeof io> = null!;
		try {
			const playStore = new PlayStore({ playManager: new hld.PlayManager() });
			const amflowManager = new SocketIOAMFlowManager({ playStore });
			socketIOServer.on("connection", (socket) => amflowManager.setupSocketIOAMFlow(socket));
			socket = io("http://localhost:" + testServerPort);
			const contentLocator = new ServerContentLocator({ path: "dummycontenturl" });

			const playId1 = await playStore.createPlay({ contentLocator });
			const serverAMFlow = playStore.createAMFlow(playId1);
			const serverToken = playStore.createPlayToken(playId1, true);
			const token = amflowManager.createPlayToken(playId1, "playerId0", "john", false, null);

			await new Promise<void>((resolve, reject) => {
				serverAMFlow.open(playId1, (err) => err ? reject(err) : resolve());
			});
			await new Promise<void>((resolve, reject) => {
				serverAMFlow.authenticate(serverToken, (err) => err ? reject(err) : resolve());
			});

			const connId = await new Promise(resolve => {
				socket.emit("amflow:open", playId1, (err: Error | null, connId?: string) => {
					expect(err).toBeFalsy();
					expect(connId).toBe("con1");
					resolve(connId);
				});
			});

			await new Promise<void>(resolve => {
				socket.emit("amflow:authenticate", connId, token, (err: Error | null, perm: Permission | undefined) => {
					expect(err).toBeFalsy();
					expect(perm!.writeTick).toBe(false);
					expect(perm!.readTick).toBe(true);
					expect(perm!.subscribeEvent).toBe(false);
					expect(perm!.subscribeTick).toBe(true);
					resolve();
				});
			});

			let handleTick = null;
			await new Promise<void>(resolve => {
				handleTick = (cid: string, tick: Tick) => {
					expect(cid).toBe(connId);
					expect(tick).toEqual([0, null, null]);
					resolve();
				};
				socket.on("amflow:[tick]", handleTick);
				socket.emit("amflow:onTick", connId);

				// 非同期でないserverAMFlow.sendTick()がsocket.emit()に先行しないように待つ // TODO onTick()を非同期にする？
				setTimeout(() => serverAMFlow.sendTick([0, null, undefined]), 100);
			});

			socket.emit("amflow:offTick", connId);

			// 非同期でないserverAMFlow.sendTick()がsocket.emit()に先行しないように待つ
			await new Promise(resolve => setTimeout(resolve, 100));

			serverAMFlow.sendTick([1, null, undefined]);

			await new Promise<void>(resolve => {
				serverAMFlow.onEvent((ev) => {
					expect(ev).toEqual([0x20, 1, "dummy-player", { data: "foo" }]);
					resolve();
				});
				socket.emit("amflow:sendEvent", connId, [0x20, 1, "dummy-player", { data: "foo" }]);
			});

		} finally {
			await socket?.close();
		}
	});

	it("multiplexes a socket with connectionId", async () => {
		let socketA, socketB;
		try {
			const playStore = new PlayStore({ playManager: new hld.PlayManager() });
			const amflowManager = new SocketIOAMFlowManager({ playStore });
			socketIOServer.on("connection", (socket) => amflowManager.setupSocketIOAMFlow(socket));
			socketA = io("http://localhost:" + testServerPort);
			socketB = io("http://localhost:" + testServerPort);
			const contentLocator = new ServerContentLocator({ path: "dummycontenturl" });

			const playId1 = await playStore.createPlay({ contentLocator });
			const playId2 = await playStore.createPlay({ contentLocator });
			const token1a = amflowManager.createPlayToken(playId1, "playerId0", "john", true, null);
			const token1p1 = amflowManager.createPlayToken(playId1, "playerId1", "bob", false, null);
			const token1p2 = amflowManager.createPlayToken(playId1, "playerId2", "jack", false, null);
			const token1p3 = amflowManager.createPlayToken(playId1, "playerId3", "joh", false, null);
			const token2a = amflowManager.createPlayToken(playId2, "playerId0", "john", true, null);
			const token2p = amflowManager.createPlayToken(playId2, "playerId0", "bob", false, null);

			const amflow1a = new SocketIOAMFlowClient(socketA);
			const amflow1p1 = new SocketIOAMFlowClient(socketA);
			const amflow1p2 = new SocketIOAMFlowClient(socketA);
			const amflow1p3 = new SocketIOAMFlowClient(socketB);
			const amflow2a = new SocketIOAMFlowClient(socketA);
			const amflow2p = new SocketIOAMFlowClient(socketA);

			function open(amflow: AMFlow, playId: string): Promise<void> {
				return new Promise((resolve, reject) => amflow.open(playId, (err) => (err ? reject(err) : resolve())));
			}
			function close(amflow: AMFlow): Promise<void> {
				return new Promise((resolve, reject) => amflow.close((err) => (err ? reject(err) : resolve())));
			}
			function authenticate(amflow: AMFlow, token: string): Promise<Permission | undefined> {
				return new Promise((resolve, reject) => amflow.authenticate(token, (e, perm) => (e ? reject(e) : resolve(perm))));
			}
			function getTickList(amflow: AMFlow, begin: number, end: number): Promise<TickList | undefined> {
				return new Promise((resolve, reject) => amflow.getTickList(begin, end, (e, tl) => (e ? reject(e) : resolve(tl))));
			}

			await open(amflow1a, playId1);
			await open(amflow1p1, playId1);
			await open(amflow1p2, playId1);
			await open(amflow1p3, playId1);
			await open(amflow2a, playId2);
			await open(amflow2p, playId2);

			expect(amflow1a.debugGetConnectionId()).toBe("con1");
			expect(amflow1p1.debugGetConnectionId()).toBe("con2");
			expect(amflow1p2.debugGetConnectionId()).toBe("con3");
			expect(amflow1p3.debugGetConnectionId()).toBe("con4");
			expect(amflow2a.debugGetConnectionId()).toBe("con5");
			expect(amflow2p.debugGetConnectionId()).toBe("con6");

			const perm1a = await authenticate(amflow1a, token1a);
			const perm1p1 = await authenticate(amflow1p1, token1p1);
			const perm1p2 = await authenticate(amflow1p2, token1p2);
			const perm1p3 = await authenticate(amflow1p3, token1p3);
			const perm2a = await authenticate(amflow2a, token2a);
			const perm2p = await authenticate(amflow2p, token2p);

			expect(perm1a?.writeTick).toBe(true);
			expect(perm2a?.writeTick).toBe(true);
			expect(perm1p1?.readTick).toBe(true);
			expect(perm1p2?.readTick).toBe(true);
			expect(perm1p3?.readTick).toBe(true);
			expect(perm2p?.readTick).toBe(true);

			const awaitee1 = makeAwaitee();
			const events1a: Event[] = [];
			const onEvent1 = (ev: Event): void => {
				events1a.push(ev);
				if (events1a.length === 3) {
					awaitee1.resolve();
				}
			};
			amflow1a.onEvent(onEvent1);
			amflow2a.onEvent((ev) => {
				throw new Error("should not receive " + ev);
			});

			amflow1p1.sendEvent([0x20, 1, "bob", {}]);
			amflow1p2.sendEvent([0x20, 1, "jack", { data: "foo" }]);

			// amflow1a と別 socket の amflow1p3 による sendEvent() が、amflow1a.onEvent() に先行してしまわないよう間を置く。
			// さらに、amflow1p2 の sendEvent() より後になることを保証することで events1a の順序を固定する。
			// TODO 内部的にonEventにコールバックを取る？
			await new Promise(resolve => setTimeout(resolve, 100));
			amflow1p3.sendEvent([0x20, 1, "joh", { data: "zee" }]);

			await awaitee1.promise;
			amflow1a.offEvent(onEvent1);
			expect(events1a).toEqual([
				[0x20, 1, "bob", {}],
				[0x20, 1, "jack", { data: "foo" }],
				[0x20, 1, "joh", { data: "zee" }]
			]);

			const awaitee2 = await makeAwaitee();
			const ticks1: Tick[] = [];
			const ticks2: Tick[] = [];
			const ticks3: Tick[] = [];
			const onTick1 = (tick: Tick): void => {
				ticks1.push(tick);
				if (ticks1.length >= 3 && ticks2.length >= 3 && ticks3.length >= 3)
					awaitee2.resolve();
			};
			const onTick2 = (tick: Tick): void => {
				ticks2.push(tick);
				if (ticks1.length >= 3 && ticks2.length >= 3 && ticks3.length >= 3)
					awaitee2.resolve();
			};
			const onTick3 = (tick: Tick): void => {
				ticks3.push(tick);
				if (ticks1.length >= 3 && ticks2.length >= 3 && ticks3.length >= 3)
					awaitee2.resolve();
			};
			amflow1p1.onTick(onTick1);
			amflow1p2.onTick(onTick2);
			amflow1p3.onTick(onTick3);
			amflow2p.onTick((t) => {
				throw new Error("should not receive " + t);
			});

			// amflow1p3 と別 socket の amflow1a による sendTick() が、amflow1p3.onTick() に先行してしまわないよう間を置く。
			// TODO 内部的にonTickにコールバックを取る？
			await new Promise(resolve => setTimeout(resolve, 100));

			amflow1a.sendTick([0]);
			amflow1a.sendTick([1]);
			amflow1a.sendTick([2, [[0x20, 1, "foo", {}]]]);

			await awaitee2.promise;
			expect(ticks1).toEqual([
				[0],
				[1],
				[2, [[0x20, 1, "foo", {}]]]
			]);
			expect(ticks2).toEqual(ticks1);
			expect(ticks3).toEqual(ticks1);

			// awaitなし(並列)でリクエストして逆順で待ってみる
			const promiseTickList1 = getTickList(amflow1p1, 1, 3);
			const promiseTickList2 = getTickList(amflow1p2, 0, 1);
			const tl2 = await promiseTickList2;
			const tl1 = await promiseTickList1;

			expect(tl1).toEqual([1, 2, [[2, [[0x20, 1, "foo", {}]]]]]);
			expect(tl2).toEqual([0, 0, []]);

			await close(amflow1a);
			await close(amflow1p1);
			await close(amflow1p2);
			await close(amflow1p3);
			await close(amflow2a);
			await close(amflow2p);

		} finally {
			if (socketA) {
				await socketA.close();
			}
			if (socketB) {
				await socketB.close();
			}
		}
	});
});
