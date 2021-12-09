var os = require("os");
var path = require("path");
var express = require("express");
var getPort = require("get-port");
var listTemplates = require("../lib/list/listTemplates").listTemplates;
var Prompt = require("prompt");

describe("list.ts", () => {
	let templateServer = null;
	let repositoryUrl = "";
	let mockPromptGet = null;
	beforeAll(async () => {
		const port = await getPort();
		const app = express();
		app.use(express.static(path.resolve(__dirname, "support", "fixture")));
		templateServer = app.listen(port);
		repositoryUrl = `http://127.0.0.1:${port}/remote/`;

		mockPromptGet = jest.spyOn(Prompt, "get").mockImplementation((_schema, func) => {
			func(undefined, { confirm: "y" });
		});
	});
	afterAll(() => {
		if (templateServer) {
			templateServer.close();
			templateServer = null;
			repositoryUrl = "";
		}
		mockPromptGet.mockRestore();
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
				localTemplateDirectory: path.join(__dirname, "support", "fixture", "local")
			}

			listTemplates(param)
				.then(() => {
					expect(printed).toEqual(
						expect.arrayContaining([
							"javascript",
							"typescript",
							"javascript-minimal"
						])
					);
				})
				.then(done, done.fail);
		});
	});
});
