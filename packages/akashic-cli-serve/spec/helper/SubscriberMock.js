const Trigger = require("@akashic/trigger").Trigger;
const ServerConfigMock = require("./SeverConfigMock");

class SubscriberMock {
	constructor() {
		this.onPlayCreate = new Trigger();
		this.onPlayStatusChange = new Trigger();
		this.onPlayerJoin = new Trigger();
		this.onPlayerLeave = new Trigger();
		this.onRunnerCreate = new Trigger();
		this.onRunnerRemove = new Trigger();
		this.onClientInstanceAppear = new Trigger();
		this.onClientInstanceDisappear = new Trigger();
		this.socket = io(`ws://${ServerConfigMock.hostname}:${ServerConfigMock.port}`);
		this.socket.on("playCreate", function (arg) { this.onPlayCreate.fire(arg); });
		this.socket.on("playStatusChange", function (arg) { this.onPlayStatusChange.fire(arg); });
		this.socket.on("playerJoin", function (arg) { this.onPlayerJoin.fire(arg); });
		this.socket.on("playerLeave", function (arg) { this.onPlayerLeave.fire(arg); });
		this.socket.on("runnerCreate", function (arg) { this.onRunnerCreate.fire(arg); });
		this.socket.on("runnerRemove", function (arg) { this.onRunnerRemove.fire(arg); });
		this.socket.on("clientInstanceAppear", function (arg) { this.onClientInstanceAppear.fire(arg); });
		this.socket.on("clientInstanceDisappear", function (arg) { this.onClientInstanceDisappear.fire(arg); });
	}
}

exports.SubscreiberMock = SubscriberMock;
