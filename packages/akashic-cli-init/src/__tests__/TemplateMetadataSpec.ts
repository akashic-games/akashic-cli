import * as fs from "fs";
import * as path from "path";
import express from "express";
import getPort from "get-port";
import { fetchTemplate, fetchRemoteTemplatesMetadata } from "../common/TemplateMetadata.js";

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
		it("fetch templates metadata", async () => {
			const metadataList = await fetchRemoteTemplatesMetadata(
				new URL("template-list.json", repositoryUrl).toString()
			);
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
		});

		it("rejects unsupported formatVersion", async () => {
			const templateListJsonUri = new URL("template-list.unsupported.json", repositoryUrl).toString();
			await expect(fetchRemoteTemplatesMetadata(templateListJsonUri))
				.rejects.toThrow(
					`Unsupported formatVersion "42" found in ${templateListJsonUri}. ` +
					"The only valid value for this version is \"0\". " +
					"Newer version of akashic-cli may support this formatVersion."
				);
		});
	});

	describe("fetchTemplate()", () => {
		it("fetch a remote template", async () => {
			const dir = await fetchTemplate({
				sourceType: "remote",
				name: "javascript",
				url: (new URL("javascript.zip", repositoryUrl)).toString()
			});

			expect(fs.statSync(path.join(dir, "game.json")).isFile()).toBe(true);
			expect(fs.statSync(path.join(dir, "script", "main.js")).isFile()).toBe(true);
		});

		it("fetch a local template", async () => {
			const dir = await fetchTemplate({
				sourceType: "local",
				name: "javascript-minimal",
				path: path.join(__dirname, "support", "fixture", "local", "javascript-minimal")
			});

			expect(fs.statSync(path.join(dir, "game.json")).isFile()).toBe(true);
			expect(fs.statSync(path.join(dir, "package.json")).isFile()).toBe(true);
			expect(fs.statSync(path.join(dir, "script", "main.js")).isFile()).toBe(true);
		});
	});
});
