import * as fs from "fs";
import * as path from "path";
import * as express from "express";
import * as getPort from "get-port";
import { fetchTemplate } from  "../lib/common/TemplateMetadata";
import { fetchRemoteTemplatesMetadata } from "../lib/common/TemplateMetadata";

describe("TemplateMetadata.ts", () => {
	let templateServer: any = null;
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
				new URL("template-list.json", repositoryUrl).toString()
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
			});
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
