const Trigger = require("@akashic/trigger").Trigger;

class SubscriberMock {
	constructor(socket) {
		this.onPlayCreate = new Trigger();
		this.onPlayStatusChange = new Trigger();
		this.onPlayerJoin = new Trigger();
		this.onPlayerLeave = new Trigger();
		this.onRunnerCreate = new Trigger();
		this.onRunnerRemove = new Trigger();
		this.onClientInstanceAppear = new Trigger();
		this.onClientInstanceDisappear = new Trigger();
		socket.on("playCreate", function (arg) { this.onPlayCreate.fire(arg); });
		socket.on("playStatusChange", function (arg) { this.onPlayStatusChange.fire(arg); });
		socket.on("playerJoin", function (arg) { this.onPlayerJoin.fire(arg); });
		socket.on("playerLeave", function (arg) { this.onPlayerLeave.fire(arg); });
		socket.on("runnerCreate", function (arg) { this.onRunnerCreate.fire(arg); });
		socket.on("runnerRemove", function (arg) { this.onRunnerRemove.fire(arg); });
		socket.on("clientInstanceAppear", function (arg) { this.onClientInstanceAppear.fire(arg); });
		socket.on("clientInstanceDisappear", function (arg) { this.onClientInstanceDisappear.fire(arg); });
	}
}

exports.SubscreiberMock = SubscriberMock;
