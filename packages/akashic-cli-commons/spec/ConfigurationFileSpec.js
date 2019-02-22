var mockfs = new require("mock-fs");
var ConfigurationFile = require("../lib/ConfigurationFile").ConfigurationFile;
var ConsoleLogger = require("../lib/ConsoleLogger").ConsoleLogger;

describe("ConfigurationFile", function () {

	var mockFsContent = {
		"dirname": {
			"foo.js": ""
		},
		"game1.json": JSON.stringify({
			width: 320,
			height: 50,
			fps: 45,
		}),
		"invalid-json.json": "hogehoge"
	};

	var logger, loggedResult;
	beforeEach(function () {
		loggedResult = [];
		logger = new ConsoleLogger({ debugLogMethod: loggedResult.push.bind(loggedResult) });
		mockfs(mockFsContent);
	});
	afterEach(function () {
		mockfs.restore();
	});

	describe(".read()", function () {
		it("reads configuration file", function (done) {
			Promise.resolve()
				.then(() => ConfigurationFile.read("./game1.json", logger))
				.then((content) => {
					expect(content).toEqual({
						width: 320,
						height: 50,
						fps: 45
					});
				})
				.then(done, done.fail);
		});
		it("rejects directory", function (done) {
			Promise.resolve()
				.then(() => ConfigurationFile.read("./dirname", logger))
				.then(done.fail)
				.catch((e) => done());
		});
		it("creates empty data unless the file exists", function (done) {
			Promise.resolve()
				.then(() => ConfigurationFile.read("./inexistent.json", logger))
				.then((content) => {
					expect(loggedResult.length).toBe(1);
					expect(content).toEqual({});
				})
				.then(done, done.fail);
		});
		it("rejects invalid JSON", function (done) {
			Promise.resolve()
				.then(() => ConfigurationFile.read("./invalid-json.json", logger))
				.then(done.fail)
				.catch((e) => done());
		});
	});

	describe(".write()", function () {
		it("writes to the file", function (done) {
			var data = { width: 10, height: 5, fps: 30 };
			Promise.resolve()
				.then(() => ConfigurationFile.write(data, "./game1.json", logger))
				.then(() => ConfigurationFile.read("./game1.json", logger))
				.then((content) => {
					expect(content).toEqual(data);
				})
				.then(done, done.fail);
		});
		it("rejects writing to directory", function (done) {
			Promise.resolve()
				.then(() => ConfigurationFile.write({}, "./dirname", logger))
				.then(done.fail)
				.catch((e) => done());
		});
	});
});

