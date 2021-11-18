var fs = require("fs");
var path = require("path");
var express = require("express");
var getPort = require("get-port");
var fetchTemplate = require("../lib/common/TemplateMetadata").fetchTemplate;
var fetchRemoteTemplatesMetadata = require("../lib/common/TemplateMetadata").fetchRemoteTemplatesMetadata;

describe("TemplateMetadata.ts", () => {
	let templateServer = null;
	let repositoryUrl = "";
	beforeAll(async () => {
		const port = await getPort();
		const app = express();
		app.use(express.static(path.resolve(__dirname, "support", "fixture")));
		templateServer = app.listen(port);
		repositoryUrl = `http://127.0.0.1:${port}/remote/`;
	});
	afterAll(() => {
		if (templateServer) {
			templateServer.close();
			templateServer = null;
			repositoryUrl = "";
		}
	});

	describe("fetchRemoteTemplateMetadata()", () => {
		it("fetch templates metadata", done => {
			fetchRemoteTemplatesMetadata(
				new URL("template-list.json", repositoryUrl)
			).then((metadataList) => {
				expect(metadataList).toEqual(
					expect.arrayContaining([
						expect.objectContaining({
							sourceType: "remote",
							name: "javascript",
							url: (new URL("javascript.zip", repositoryUrl)).toString()
						}),
						expect.objectContaining({
							sourceType: "remote",
							name: "typescript",
							url: (new URL("typescript.zip", repositoryUrl)).toString()
						})
					])
				);
				done();
			})
		});

		it("rejects unsupported formatVersion", done => {
			fetchRemoteTemplatesMetadata(
				new URL("template-list.unsupported.json", repositoryUrl)
			).then(
				() => done.fail("unexpectedly succeed for unsuppoted formatVersion"),
				(err) => {
					expect(err?.message).toBe(
						`Unsupported formatVersion: "42". ` +
						`The only valid value for this version is "0". ` +
						`Newer version of akashic-cli may support this formatVersion.`
					);
					done();
				}
			)
		});
	});

	describe("fetchTemplate()", () => {
		it("fetch a remote template", done => {
			fetchTemplate({
				sourceType: "remote",
				name: "javascript",
				url: (new URL("javascript.zip", repositoryUrl)).toString()
			})
				.then((dir) => {
					expect(fs.statSync(path.join(dir, "game.json")).isFile()).toBe(true);
					expect(fs.statSync(path.join(dir, "script", "main.js")).isFile()).toBe(true);
				})
				.then(done, done.fail);
		});

		it("fetch a local template", done => {
			fetchTemplate({
				sourceType: "local",
				name: "javascript-minimal",
				path: path.join(__dirname, "support", "fixture", "local", "javascript-minimal")
			})
				.then((dir) => {
					expect(fs.statSync(path.join(dir, "game.json")).isFile()).toBe(true);
					expect(fs.statSync(path.join(dir, "package.json")).isFile()).toBe(true);
					expect(fs.statSync(path.join(dir, "script", "main.js")).isFile()).toBe(true);
				})
				.then(done, done.fail);
		});
	});
});
