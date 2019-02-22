global.io = require("socket.io-client");

const { spawn } = require("child_process");
const path = require("path");
const ServerConfigMock = require("../helper/SeverConfigMock");
const SubscreiberMock = require("../helper/SubscriberMock");
const ApiRequestMock = require("../helper/ApiRequestMock");

describe("SubscriberSpec", function() {
	const host = ServerConfigMock.hostname;
	const port = ServerConfigMock.port;
	const contentUrl = `http://${host}:${port}/config/content.raw.json`;
	var childProcess;
	var originalTimeout;
	beforeAll(function(done) {
		originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
		jasmine.DEFAULT_TIMEOUT_INTERVAL = 8000; // 一番最初のテストはタイムアウトまで残り2秒の状態で始まるのでタイムアウト時間を3秒延長した
		return new Promise((resolve) => {
			childProcess = spawn(
				"node",
				[path.resolve(__dirname, "../../bin/run"), "-H", host, "-p", port],
				{cwd: path.resolve(__dirname, "../fixture/sample_content")}
			);
			setTimeout(function() {
				resolve();
			}, 3000); // サーバーの起動に時間がかかるため何秒か待つようにした
		}).then(done);
	});
	afterAll(function() {
		jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
		if (childProcess) {
			childProcess.kill("SIGKILL");
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
			SubscreiberMock.onPlayCreate.addOnce(function(arg) {
				pushedData = arg;
				if (apiResponse) {
					assertOnPlayCreateEvent();
				}
			});
			ApiRequestMock.post(`http://${host}:${port}/api/play`, {contentUrl: contentUrl}).then(function(response) {
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
			SubscreiberMock.onPlayStatusChange.addOnce(function(arg) {
				pushedData = arg;
				if (apiResponse) {
					assertOnPlayStatusChangeEvent();
				}
			});
			ApiRequestMock.post(`http://${host}:${port}/api/play`, {contentUrl: contentUrl}).then(function(response) {
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
				SubscreiberMock.onPlayStatusChange.remove(playStatusChangeHandler);
				done();
			};
			playStatusChangeHandler = function(arg) {
				pushedData = arg;
				pushedCount++;
				if (apiResponse) {
					assertOnPlayStatusChangeEvent();
				}
			};
			SubscreiberMock.onPlayStatusChange.add(playStatusChangeHandler);
			ApiRequestMock.post(`http://${host}:${port}/api/play`, {contentUrl: contentUrl}).then(function(response) {
				return ApiRequestMock.del(`http://${host}:${port}/api/play/${response.data.playId}`);
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
			SubscreiberMock.onRunnerCreate.addOnce(function(arg) {
				pushedData = arg;
				if (apiResponse) {
					assertOnRunnerCreateEvent();
				}
			});
			ApiRequestMock.post(`http://${host}:${port}/api/play`, {contentUrl: contentUrl}).then(function(response) {
				currentPlayId = response.data.playId;
				return ApiRequestMock.post(`http://${host}:${port}/api/play/${currentPlayId}/token`, {playerId: "", isActive: "true"});
			}).then(function(response) {
				return ApiRequestMock.post(`http://${host}:${port}/api/runner`, {playId: currentPlayId, isActive: "true", token: response.data.playToken});
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
			SubscreiberMock.onRunnerRemove.addOnce(function(arg) {
				pushedData = arg;
				if (apiResponse) {
					assertOnRunnerRemoveEvent();
				}
			});
			ApiRequestMock.post(`http://${host}:${port}/api/play`, {contentUrl: contentUrl}).then(function(response) {
				currentPlayId = response.data.playId;
				return ApiRequestMock.post(`http://${host}:${port}/api/play/${currentPlayId}/token`, {playerId: "", isActive: "true"});
			}).then(function(response) {
				return ApiRequestMock.post(`http://${host}:${port}/api/runner`, {playId: currentPlayId, isActive: "true", token: response.data.playToken});
			}).then(function(response) {
				return ApiRequestMock.del(`http://${host}:${port}/api/runner/${response.data.runnerId}`);
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
			var socket = io(`ws://${host}:${port}`);
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
			SubscreiberMock.onClientInstanceAppear.addOnce(function(arg) {
				pushedData = arg;
				if (isAppeared) {
					assertOnClientInstanceAppearEvent();
				}
			});
			ApiRequestMock.post(`http://${host}:${port}/api/play`, {contentUrl: contentUrl}).then(function(response) {
				currentPlayId = response.data.playId;
				return ApiRequestMock.post(`http://${host}:${port}/api/play/${currentPlayId}/token`, {playerId: "", isActive: "true"});
			}).then(function(response) {
				return ApiRequestMock.post(`http://${host}:${port}/api/runner`, {playId: currentPlayId, isActive: "true", token: response.data.playToken});
			}).then(function() {
				return ApiRequestMock.post(`http://${host}:${port}/api/play/${currentPlayId}/token`, {playerId: player.id, name: player.name, isActive: "false"});
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
			var socket = io(`ws://${host}:${port}`);
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
			ApiRequestMock.post(`http://${host}:${port}/api/play`, {contentUrl: contentUrl}).then(function(response) {
				currentPlayId = response.data.playId;
				return ApiRequestMock.post(`http://${host}:${port}/api/play/${currentPlayId}/token`, {playerId: "", isActive: "true"});
			}).then(function(response) {
				return ApiRequestMock.post(`http://${host}:${port}/api/runner`, {playId: currentPlayId, isActive: "true", token: response.data.playToken});
			}).then(function() {
				return ApiRequestMock.post(`http://${host}:${port}/api/play/${currentPlayId}/token`, {playerId: player.id, name: player.name, isActive: "false"});
			}).then(function(response) {
				token = response.data.playToken;
				return new Promise(function(resolve) {
					socket.emit("amflow:open", currentPlayId, function() {
						socket.emit("amflow:authenticate", token, function () {
							SubscreiberMock.onClientInstanceDisappear.addOnce(function(arg) {
								pushedData = arg;
								if (isDisAppeared) {
									assertOnClientInstanceDisAppearEvent();
								}
							});
							socket.disconnect();
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
			var socket = io(`ws://${host}:${port}`);
			var token;
			var isJoined = false;
			var pushedData;
			var assertOnPlayerJoinEvent = function() {
				expect(pushedData.playId).toBe(currentPlayId);
				expect(pushedData.player).toEqual(player);
				done();
			};
			SubscreiberMock.onPlayerJoin.addOnce(function(arg) {
				pushedData = arg;
				if (isJoined) {
					assertOnPlayerJoinEvent();
				}
			});
			ApiRequestMock.post(`http://${host}:${port}/api/play`, {contentUrl: contentUrl}).then(function(response) {
				currentPlayId = response.data.playId;
				return ApiRequestMock.post(`http://${host}:${port}/api/play/${currentPlayId}/token`, {playerId: "", isActive: "true"});
			}).then(function(response) {
				return ApiRequestMock.post(`http://${host}:${port}/api/runner`, {playId: currentPlayId, isActive: "true", token: response.data.playToken});
			}).then(function() {
				return ApiRequestMock.post(`http://${host}:${port}/api/play/${currentPlayId}/token`, {playerId: player.id, name: player.name, isActive: "false"});
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
			SubscreiberMock.onPlayerLeave.add(onPlayerLeaveEvent);
		});
		beforeEach(function() {
			firedCount = 0;
			playerLeaveParams = undefined;
		});
		afterAll(function() {
			SubscreiberMock.onPlayerLeave.remove(onPlayerLeaveEvent);
		});
		it("is sent from server, when send amflow:sendEvent as leave-event", function(done) {
			var player = {id: 0, name: "test"};
			var currentPlayId;
			var socket = io(`ws://${host}:${port}`);
			var token;
			var isLeaved = false;
			var pushedData;
			var assertOnPlayerLeaveEvent = function() {
				expect(pushedData.playId).toBe(currentPlayId);
				expect(pushedData.playerId).toBe(player.id);
				done();
			};
			SubscreiberMock.onPlayerLeave.addOnce(function(arg) {
				pushedData = arg;
				if (isLeaved) {
					assertOnPlayerLeaveEvent();
				}
			});
			ApiRequestMock.post(`http://${host}:${port}/api/play`, {contentUrl: contentUrl}).then(function(response) {
				currentPlayId = response.data.playId;
				return ApiRequestMock.post(`http://${host}:${port}/api/play/${currentPlayId}/token`, {playerId: "", isActive: "true"});
			}).then(function(response) {
				return ApiRequestMock.post(`http://${host}:${port}/api/runner`, {playId: currentPlayId, isActive: "true", token: response.data.playToken});
			}).then(function() {
				return ApiRequestMock.post(`http://${host}:${port}/api/play/${currentPlayId}/token`, {playerId: player.id, name: player.name, isActive: "false"});
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
