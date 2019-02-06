var ConsoleLogger = require("../lib/ConsoleLogger").ConsoleLogger;

describe("ConsoleLogger", function () {
	it("can be instantiated", function () {
		var self = new ConsoleLogger();
		expect(self.quiet).toBe(false);
		expect(self._log instanceof Function).toBe(true);
	});

	it("logs error, warn and info", function () {
		var logged = [];
		var self = new ConsoleLogger({ debugLogMethod: logged.push.bind(logged) });
		var errorCause = {}, warnCause = {}, infoCause = {};
		self.error("error", errorCause);
		self.warn("warning", warnCause);
		self.info("info log", infoCause);
		self.error("another error");
		self.warn("another warn");
		self.info("another info");

		expect(logged.length).toBe(9);
		expect(logged[0]).toBe("ERROR: error");
		expect(logged[1]).toBe(errorCause);
		expect(logged[2]).toBe("WARN: warning");
		expect(logged[3]).toBe(warnCause);
		expect(logged[4]).toBe("INFO: info log");
		expect(logged[5]).toBe(infoCause);
		expect(logged[6]).toBe("ERROR: another error");
		expect(logged[7]).toBe("WARN: another warn");
		expect(logged[8]).toBe("INFO: another info");
	});

	it("suppresses info if quiet", function () {
		var logged = [];
		var self = new ConsoleLogger({ quiet: true, debugLogMethod: logged.push.bind(logged) });
		var errorCause = {}, warnCause = {}, infoCause = {};
		self.error("error", errorCause);
		self.warn("warning", warnCause);
		self.info("info log", infoCause);
		self.error("another error");
		self.warn("another warn");
		self.info("another info");

		expect(logged.length).toBe(6);
		expect(logged[0]).toBe("ERROR: error");
		expect(logged[1]).toBe(errorCause);
		expect(logged[2]).toBe("WARN: warning");
		expect(logged[3]).toBe(warnCause);
		expect(logged[4]).toBe("ERROR: another error");
		expect(logged[5]).toBe("WARN: another warn");
	});
});
