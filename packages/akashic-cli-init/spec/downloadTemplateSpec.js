var dt = require("../lib/downloadTemplate");
var lt = require("../lib/listTemplates");
var commons = require("@akashic/akashic-cli-commons");
var fs = require("fs");
var os = require("os");
var path = require("path");
var MockConfigFile = require("./support/mockConfigFile");

describe("downloadTemplate.ts", () => {

	describe("listTemplates()", () => {
		it("list templates", done => {
			var str = "";
			var param = {
				logger: {
					error: s => { done.fail(); },
					print: s => { str = str + s + "\n"; },
					info: s => { }
				},
				repository: "http://127.0.0.1:18080/templates/",
				templateListJsonPath: "template-list.json",
				type: "javascript",
				_realTemplateDirectory: path.join(os.homedir(), ".akashic-templates")
			};

			lt.listTemplates(param)
				.then(() => {
					expect(str).toBe("javascript\ntypescript\n");
				})
				.then(done, done.fail);
		});
	});

	describe("downloadTemplate()", () => {
		it("download javascript templates", done => {
			var tmpDir = os.tmpdir();
			var param = {
				logger: new commons.ConsoleLogger({quiet: true}),
				_realTemplateDirectory: tmpDir,
				repository: "http://127.0.0.1:18080/templates/",
				templateListJsonPath: "template-list.json",
				type: "javascript",
			};
			dt.downloadTemplateIfNeeded(param)
				.then(() => {
					expect(fs.statSync(path.join(
						tmpDir,
						"javascript/javascript",
						"game.json"
					)).isFile()).toBe(true);
					expect(fs.statSync(path.join(
						tmpDir,
						"javascript/javascript",
						"script",
						"main.js"
					)).isFile()).toBe(true);
				})
				.then(done, done.fail);
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
					logger: new commons.ConsoleLogger({ quiet: true }),
					_realTemplateDirectory: dir,
					repository: "http://127.0.0.1:18080/templates/",
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
							"javascript/javascript",
							"game.json"
						)).isFile()).toBe(true);
					})
					.then(done, done.fail);
			});
		});
	});
});
