var fs = require("fs");
var os = require("os");
var path = require("path");
var express = require("express");
var getPort = require("get-port");
var listTemplates = require("../lib/list/listTemplates").listTemplates;
var fetchTemplate = require("../lib/common/TemplateMetadata").fetchTemplate;
var fetchRemoteTemplatesMetadata = require("../lib/common/TemplateMetadata").fetchRemoteTemplatesMetadata;

describe("downloadTemplate.ts", () => {
	let templateServer = null;
	let repositoryUrl = "";
	beforeAll(async () => {
		const port = await getPort();
		const app = express();
		app.use(express.static(path.resolve(__dirname, "support")));
		templateServer = app.listen(port);
		repositoryUrl = `http://127.0.0.1:${port}/fixture/`;
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
				localTemplateDirectory: path.join(os.homedir(), ".akashic-templates")
			}

			listTemplates(param)
				.then(() => {
					expect(printed.length).toBe(2);
					expect(printed.includes("javascript")).toBe(true);
					expect(printed.includes("typescript")).toBe(true);
				})
				.then(done, done.fail);
		});
	});

	describe("downloadTemplate()", () => {
		it("download javascript templates", done => {
			fetchRemoteTemplatesMetadata(
				new URL("template-list.json", repositoryUrl)
			).then((metadataList) => {
				const matched = metadataList.filter(m => m.name === "javascript");
				expect(matched.length).toBe(1);
				fetchTemplate(matched[0])
					.then((dir) => {
						expect(fs.statSync(path.join(dir, "game.json")).isFile()).toBe(true);
						expect(fs.statSync(path.join(dir, "script", "main.js")).isFile()).toBe(true);
					})
					.then(done, done.fail);
				});
		});
	});
});
