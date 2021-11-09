var fs = require("fs");
var os = require("os");
var path = require("path");
var express = require("express");
var getPort = require("get-port");
var ConsoleLogger = require("@akashic/akashic-cli-commons/lib/ConsoleLogger").ConsoleLogger;
var dt = require("../lib/init/downloadTemplate");
var lt = require("../lib/list/listTemplates");

describe("downloadTemplate.ts", () => {
	let templateServer = null;
	let repositoryUrl = "";
	beforeAll(async () => {
		const port = await getPort();
		const app = express();
		app.use(express.static(path.resolve(__dirname, "..")));
		templateServer = app.listen(port);
		repositoryUrl = `http://127.0.0.1:${port}/templates/`;
	});
	afterAll(() => {
		if (templateServer) {
			templateServer.close();
			templateServer = null;
			repositoryUrl = "";
		}
	});

	describe("listTemplates()", () => {
		it("list templates", done => {
			var printed = [];
			var param = {
				logger: {
					error: s => { done.fail(); },
					print: s => { printed.push(s); },
					info: s => { }
				},
				repository: repositoryUrl,
				templateListJsonPath: "template-list.json",
				type: "javascript",
				_realTemplateDirectory: path.join(os.homedir(), ".akashic-templates")
			};

			lt.listTemplates(param)
				.then(() => {
					expect(printed.length).toBe(6);
					expect(printed.includes("javascript-minimal")).toBe(true);
					expect(printed.includes("javascript-shin-ichiba-ranking")).toBe(true);
					expect(printed.includes("javascript")).toBe(true);
					expect(printed.includes("typescript-minimal")).toBe(true);
					expect(printed.includes("typescript-shin-ichiba-ranking")).toBe(true);
					expect(printed.includes("typescript")).toBe(true);
				})
				.then(done, done.fail);
		});
	});

	describe("downloadTemplate()", () => {
		it("download javascript templates", done => {
			new Promise((resolve, reject) => {
				fs.mkdtemp(path.join(os.tmpdir(), "init-test"), (err, dir) => {
					if (err) done.fail();
					return resolve(dir);
				})
			}).then((dir) => {
				var param = {
					logger: new ConsoleLogger({quiet: true}),
					_realTemplateDirectory: dir,
					repository: repositoryUrl,
					templateListJsonPath: "template-list.json",
					type: "javascript",
				};
				dt.downloadTemplateIfNeeded(param)
					.then(() => {
						expect(fs.statSync(path.join(
							dir,
							"javascript",
							"game.json"
						)).isFile()).toBe(true);
						expect(fs.statSync(path.join(
							dir,
							"javascript",
							"script",
							"main.js"
						)).isFile()).toBe(true);
					})
					.then(done, done.fail);
				});
		});

		it("It works even if params.repository is empty", done => {
			var param = {};
			new Promise((resolve, reject) => {
				fs.mkdtemp(path.join(os.tmpdir(), "init-test"), (err, dir) => {
					if (err) done.fail();
					return resolve(dir);
				})
			})
			.then((dir) =>{
				param = {
					logger: new ConsoleLogger({ quiet: true }),
					_realTemplateDirectory: dir,
					repository: repositoryUrl,
					templateListJsonPath: "template-list.json",
					type: "javascript",
				};
				return dt.downloadTemplateIfNeeded(param);
			})
			.then(()=> {
				param.repository = "";
				dt.downloadTemplateIfNeeded(param)
					.then(() => {
						expect(fs.statSync(path.join(
							param._realTemplateDirectory,
							"javascript",
							"game.json"
						)).isFile()).toBe(true);
					})
					.then(done, done.fail);
			});
		});
	});
});
