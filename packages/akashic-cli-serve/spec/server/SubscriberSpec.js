// TODO globalに依存しないようにする
global.io = require("socket.io-client");

const { spawn } = require("child_process");
const path = require("path");
const getPort = require('get-port');
const SubscriberMock = require("../helper/SubscriberMock");
const ApiRequestMock = require("../helper/ApiRequestMock");

// TODO: このテストは安定化のため無効化し続けていたところ通らなくなってしまったので、有効化の際はテストを修正する必要がある
xdescribe("SubscriberSpec", function() {
	var host;
	var port;
	var contentUrl;
	var childProcess;
	var originalTimeout;
	var subscriberMock;
	var socket;
	beforeAll(async function(done) {
		host = "localhost";
		port = await getPort();
		contentUrl = `http://${host}:${port}/config/content.raw.json`;
		socket = io(`ws://${host}:${port}`);
		subscriberMock = new SubscriberMock.SubscriberMock(socket);
		originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
		jasmine.DEFAULT_TIMEOUT_INTERVAL = 8000; // 一番最初のテストはタイムアウトまで残り2秒の状態で始まるのでタイムアウト時間を3秒延長した
		childProcess = spawn(
			"node",
			[path.resolve(__dirname, "../../bin/run"), "-H", host, "-p", port],
			{cwd: path.resolve(__dirname, "../fixture/sample_content")}
		);
		setTimeout(function() {
			done();
		}, 3000); // サーバーの起動に時間がかかるため何秒か待つようにした
	});
	afterAll(function() {
		jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
		if (childProcess) {
			childProcess.kill("SIGKILL");
		}
		if (socket) {
			socket.close();
		}
	});
	describe("playCreate-event", function() {
		it("is sent from server, when access to create-play api", function(done) {
			var apiResponse;
			var pushedData;
			var assertOnPlayCreateEvent = function() {
				expect(pushedData.playId).toBe(apiResponse.data.playId);
				done();
			};
			subscriberMock.onPlayCreate.addOnce(function(arg) {
				pushedData = arg;
				if (apiResponse) {
					assertOnPlayCreateEvent();
				}
			});
			ApiRequestMock.post(`http://${host}:${port}/api/plays`, {contentUrl: contentUrl}).then(function(response) {
				apiResponse = response;
				if (pushedData) {
					assertOnPlayCreateEvent();
				}
			});
		});
	});
	describe("playStatusChange-event", function () {
		it("is sent from server, when access to create-play api", function(done) {
			var apiResponse;
			var pushedData;
			var assertOnPlayStatusChangeEvent = function() {
				expect(pushedData.playId).toBe(apiResponse.data.playId);
				expect(pushedData.playStatus).toBe("running");
				done();
			};
			subscriberMock.onPlayStatusChange.addOnce(function(arg) {
				pushedData = arg;
				if (apiResponse) {
					assertOnPlayStatusChangeEvent();
				}
			});
			ApiRequestMock.post(`http://${host}:${port}/api/plays`, {contentUrl: contentUrl}).then(function(response) {
				apiResponse = response;
				if (pushedData) {
					assertOnPlayStatusChangeEvent();
				}
			});
		});
		it("is sent from server, when access to suspend-play api", function(done) {
			var apiResponse;
			var pushedData;
			var pushedCount = 0;
			var playStatusChangeHandler;
			var assertOnPlayStatusChangeEvent = function() {
				expect(pushedData.playId).toBe(apiResponse.data.playId);
				expect(pushedData.playStatus).toBe("suspending");
				subscriberMock.onPlayStatusChange.remove(playStatusChangeHandler);
				done();
			};
			playStatusChangeHandler = function(arg) {
				pushedData = arg;
				pushedCount++;
				if (apiResponse) {
					assertOnPlayStatusChangeEvent();
				}
			};
			subscriberMock.onPlayStatusChange.add(playStatusChangeHandler);
			ApiRequestMock.post(`http://${host}:${port}/api/plays`, {contentUrl: contentUrl}).then(function(response) {
				return ApiRequestMock.del(`http://${host}:${port}/api/plays/${response.data.playId}`);
			}).then(function(response) {
				apiResponse = response;
				if (pushedData && pushedCount === 2) { // create-play実行時にもEVENTが実行されてしまうので、呼び出し回数も見るようにした
					assertOnPlayStatusChangeEvent();
				}
			});
		});
	});
	describe("runnerCreate-event", function () {
		it("is sent from server, when access to create-runner api", function(done) {
			var currentPlayId;
			var apiResponse;
			var pushedData;
			var assertOnRunnerCreateEvent = function() {
				expect(pushedData.playId).toBe(currentPlayId);
				expect(pushedData.runnerId).toBe(apiResponse.data.runnerId);
				done();
			};
			subscriberMock.onRunnerCreate.addOnce(function(arg) {
				pushedData = arg;
				if (apiResponse) {
					assertOnRunnerCreateEvent();
				}
			});
			ApiRequestMock.post(`http://${host}:${port}/api/plays`, {contentUrl: contentUrl}).then(function(response) {
				currentPlayId = response.data.playId;
				return ApiRequestMock.post(`http://${host}:${port}/api/plays/${currentPlayId}/token`, {playerId: "", isActive: "true"});
			}).then(function(response) {
				return ApiRequestMock.post(`http://${host}:${port}/api/runners`, {playId: currentPlayId, isActive: "true", token: response.data.playToken});
			}).then(function(response) {
				apiResponse = response;
				if (pushedData) {
					assertOnRunnerCreateEvent();
				}
			});
		});
	});
	describe("removeRunner-event", function () {
		it("is sent from server, when access to delete-runner api", function(done) {
			var currentPlayId;
			var apiResponse;
			var pushedData;
			var assertOnRunnerRemoveEvent = function() {
				expect(pushedData.runnerId).toBe(apiResponse.data.runnerId);
				done();
			};
			subscriberMock.onRunnerRemove.addOnce(function(arg) {
				pushedData = arg;
				if (apiResponse) {
					assertOnRunnerRemoveEvent();
				}
			});
			ApiRequestMock.post(`http://${host}:${port}/api/play`, {contentUrl: contentUrl}).then(function(response) {
				currentPlayId = response.data.playId;
				return ApiRequestMock.post(`http://${host}:${port}/api/plays/${currentPlayId}/token`, {playerId: "", isActive: "true"});
			}).then(function(response) {
				return ApiRequestMock.post(`http://${host}:${port}/api/runners`, {playId: currentPlayId, isActive: "true", token: response.data.playToken});
			}).then(function(response) {
				return ApiRequestMock.del(`http://${host}:${port}/api/runners/${response.data.runnerId}`);
			}).then(function(response) {
				apiResponse = response;
				if (pushedData) {
					assertOnRunnerRemoveEvent();
				}
			});
		});
	});
	describe("clientInstanceAppear-event", function () {
		it("is sent from server, when send amflow:open-event and amflow:authenticate-event", function(done) {
			var player = {id: 0, name: "test"};
			var currentPlayId;
			var token;
			var isAppeared = false;
			var pushedData;
			var assertOnClientInstanceAppearEvent = function() {
				expect(pushedData.playId).toBe(currentPlayId);
				expect(pushedData.playerId).toBe(player.id);
				expect(pushedData.name).toBe(player.name);
				expect(pushedData.isActive).toBe(false);
				done();
			};
			subscriberMock.onClientInstanceAppear.addOnce(function(arg) {
				pushedData = arg;
				if (isAppeared) {
					assertOnClientInstanceAppearEvent();
				}
			});
			ApiRequestMock.post(`http://${host}:${port}/api/plays`, {contentUrl: contentUrl}).then(function(response) {
				currentPlayId = response.data.playId;
				return ApiRequestMock.post(`http://${host}:${port}/api/plays/${currentPlayId}/token`, {playerId: "", isActive: "true"});
			}).then(function(response) {
				return ApiRequestMock.post(`http://${host}:${port}/api/runners`, {playId: currentPlayId, isActive: "true", token: response.data.playToken});
			}).then(function() {
				return ApiRequestMock.post(`http://${host}:${port}/api/plays/${currentPlayId}/token`, {playerId: player.id, name: player.name, isActive: "false"});
			}).then(function(response) {
				token = response.data.playToken;
				return new Promise(function(resolve) {
					socket.emit("amflow:open", currentPlayId, function () {
						socket.emit("amflow:authenticate", token, function () {
							resolve();
						});
					});
				});
			}).then(function() {
				isAppeared = true;
				if (pushedData) {
					assertOnClientInstanceAppearEvent();
				}
			});
		});
	});
	describe("clientInstanceDisappear-event", function () {
		it("is sent from server, when send amflow:open-event and disconnect-evnet", function(done) {
			var player = {id: 0, name: "test"};
			var currentPlayId;
			var anotherSocket = io(`ws://${host}:${port}`); // disconnectする必要があるのでsocketとは別の変数を用意する
			var token;
			var isDisAppeared = false;
			var pushedData;
			var assertOnClientInstanceDisAppearEvent = function() {
				expect(pushedData.playId).toBe(currentPlayId);
				expect(pushedData.playerId).toBe(player.id);
				expect(pushedData.name).toBe(player.name);
				expect(pushedData.isActive).toBe(false);
				done();
			};
			ApiRequestMock.post(`http://${host}:${port}/api/plays`, {contentUrl: contentUrl}).then(function(response) {
				currentPlayId = response.data.playId;
				return ApiRequestMock.post(`http://${host}:${port}/api/plays/${currentPlayId}/token`, {playerId: "", isActive: "true"});
			}).then(function(response) {
				return ApiRequestMock.post(`http://${host}:${port}/api/runners`, {playId: currentPlayId, isActive: "true", token: response.data.playToken});
			}).then(function() {
				return ApiRequestMock.post(`http://${host}:${port}/api/plays/${currentPlayId}/token`, {playerId: player.id, name: player.name, isActive: "false"});
			}).then(function(response) {
				token = response.data.playToken;
				return new Promise(function(resolve) {
					anotherSocket.emit("amflow:open", currentPlayId, function() {
						anotherSocket.emit("amflow:authenticate", token, function () {
							subscriberMock.onClientInstanceDisappear.addOnce(function(arg) {
								pushedData = arg;
								if (isDisAppeared) {
									assertOnClientInstanceDisAppearEvent();
								}
							});
							anotherSocket.disconnect();
							resolve();
						});
					});
				});
			}).then(function() {
				isDisAppeared = true;
				if (pushedData) {
					assertOnClientInstanceDisAppearEvent();
				}
			});
		});
	});
	describe("playerJoin-event", function () {
		it("is sent from server, when send amflow:sendEvent as join-event", function(done) {
			var player = {id: 0, name: "test"};
			var currentPlayId;
			var token;
			var isJoined = false;
			var pushedData;
			var assertOnPlayerJoinEvent = function() {
				expect(pushedData.playId).toBe(currentPlayId);
				expect(pushedData.player).toEqual(player);
				done();
			};
			subscriberMock.onPlayerJoin.addOnce(function(arg) {
				pushedData = arg;
				if (isJoined) {
					assertOnPlayerJoinEvent();
				}
			});
			ApiRequestMock.post(`http://${host}:${port}/api/plays`, {contentUrl: contentUrl}).then(function(response) {
				currentPlayId = response.data.playId;
				return ApiRequestMock.post(`http://${host}:${port}/api/plays/${currentPlayId}/token`, {playerId: "", isActive: "true"});
			}).then(function(response) {
				return ApiRequestMock.post(`http://${host}:${port}/api/runners`, {playId: currentPlayId, isActive: "true", token: response.data.playToken});
			}).then(function() {
				return ApiRequestMock.post(`http://${host}:${port}/api/plays/${currentPlayId}/token`, {playerId: player.id, name: player.name, isActive: "false"});
			}).then(function(response) {
				token = response.data.playToken;
				return new Promise(function(resolve) {
					socket.emit("amflow:open", currentPlayId, function() {
						socket.emit("amflow:authenticate", token, function () {
							socket.emit("amflow:sendEvent", [0, 3, player.id, player.name]);
							resolve();
						});
					});
				});
			}).then(function() {
				isJoined = true;
				if (pushedData) {
					assertOnPlayerJoinEvent();
				}
			});
		});
	});
	describe("playerLeave-event", function () {
		var firedCount = 0;
		var playerLeaveParams;
		var onPlayerLeaveEvent = function(arg) {
			playerLeaveParams = arg;
			firedCount++;
		};
		beforeAll(function() {
			subscriberMock.onPlayerLeave.add(onPlayerLeaveEvent);
		});
		beforeEach(function() {
			firedCount = 0;
			playerLeaveParams = undefined;
		});
		afterAll(function() {
			subscriberMock.onPlayerLeave.remove(onPlayerLeaveEvent);
		});
		it("is sent from server, when send amflow:sendEvent as leave-event", function(done) {
			var player = {id: 0, name: "test"};
			var currentPlayId;
			var token;
			var isLeaved = false;
			var pushedData;
			var assertOnPlayerLeaveEvent = function() {
				expect(pushedData.playId).toBe(currentPlayId);
				expect(pushedData.playerId).toBe(player.id);
				done();
			};
			subscriberMock.onPlayerLeave.addOnce(function(arg) {
				pushedData = arg;
				if (isLeaved) {
					assertOnPlayerLeaveEvent();
				}
			});
			ApiRequestMock.post(`http://${host}:${port}/api/plays`, {contentUrl: contentUrl}).then(function(response) {
				currentPlayId = response.data.playId;
				return ApiRequestMock.post(`http://${host}:${port}/api/plays/${currentPlayId}/token`, {playerId: "", isActive: "true"});
			}).then(function(response) {
				return ApiRequestMock.post(`http://${host}:${port}/api/runners`, {playId: currentPlayId, isActive: "true", token: response.data.playToken});
			}).then(function() {
				return ApiRequestMock.post(`http://${host}:${port}/api/plays/${currentPlayId}/token`, {playerId: player.id, name: player.name, isActive: "false"});
			}).then(function(response) {
				token = response.data.playToken;
				return new Promise(function(resolve) {
					socket.emit("amflow:open", currentPlayId, function() {
						socket.emit("amflow:authenticate", token, function(){
							socket.emit("amflow:sendEvent", [0, 3, player.id, player.name]);
							socket.emit("amflow:sendEvent", [1, 3, player.id]);
							resolve();
						});
					});
				});
			}).then(function() {
				isLeaved = true;
				if (pushedData) {
					assertOnPlayerLeaveEvent();
				}
			});
		});
	});
});
