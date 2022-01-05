import * as path from "path";
import { ConsoleLogger } from "@akashic/akashic-cli-commons/lib/ConsoleLogger";
import * as fs from "fs-extra";
import * as mockfs from "mock-fs";
import { internals } from "../../lib/init/init";
import { completeTemplateConfig } from "../../lib/init/TemplateConfig";
const _extractFromTemplate = internals._extractFromTemplate;

describe("init.ts", () => {
	describe("_extractFromTemplate()", () => {
		beforeEach(() => {
			mockfs({
				".akashic-templates": {
					simple: {
						a: "aaa",
						b: "bbb",
						c: {
							d: "ddd"
						}
					},
					manual: {
						"template.json": JSON.stringify({
							formatVersion: "0",
							files: [
								{src: "a", dst: "a"},
								{src: "b", dst: "y/z/e"}
							],
							gameJson: "a"
						}),
						a: "aaa",
						b: "bbb",
						"y": {
							"z": {
								"e": ""
							}
						}
					},
					copyTo: {
						a: "xxxxxxxxxx",
						c: {
							a: "yyyyyyyy"
						}
					}
				}
			});
		});

		afterEach(() => {
			mockfs.restore();
		});

		it("copy simple template", async () => {
			const logger = new ConsoleLogger({ quiet: true });
			const src = ".akashic-templates/simple";
			const dest = "home";
			const conf = await completeTemplateConfig({}, src);
			await _extractFromTemplate(conf, src, dest, { logger });

			expect(fs.statSync(path.join("home", "a")).isFile()).toBe(true);
			expect(fs.statSync(path.join("home", "b")).isFile()).toBe(true);
			expect(fs.statSync(path.join("home", "c")).isDirectory()).toBe(true);
			expect(fs.statSync(path.join("home", "c", "d")).isFile()).toBe(true);
		});

		it("reject unsupported formatVersion", async () => {
			const src = ".akashic-templates/never-refered";
			const mockFn = jest.fn<Promise<any>, [any, string]>(completeTemplateConfig);
			await expect(mockFn({ formatVersion: "101" }, src))
				.rejects.toThrow(
					"Unsupported formatVersion: \"101\". " +
					"The only valid value for this version is \"0\". " +
					"Newer version of akashic-cli may support this formatVersion."
				);
		});

		it("copy manual template", async () => {
			const logger = new ConsoleLogger({ quiet: true });
			const src = ".akashic-templates/manual";
			const dest = "home";
			const conf = await completeTemplateConfig({}, src);
			await _extractFromTemplate(conf, src, dest, { logger });

			expect(fs.statSync(path.join("home", "a")).isFile()).toBe(true);
			expect(fs.statSync(path.join("home", "y", "z", "e")).isFile()).toBe(true);
		});

		it("can not copy when file exists", async () => {
			const logger = new ConsoleLogger({ quiet: true });
			const src = ".akashic-templates/simple";
			const dest = ".akashic-templates/copyTo";
			const conf = await completeTemplateConfig({}, src);

			await expect( _extractFromTemplate(conf, src, dest, { logger }))
				.rejects.toThrow(
					"aborted to copy files, because followings already exist. [a, c]"
				);
		});

		it("can not copy when file exists (specify files)", async () => {
			const logger = new ConsoleLogger({ quiet: true });
			const src = ".akashic-templates/simple";
			const dest = ".akashic-templates/copyTo";
			const conf = await completeTemplateConfig({ files: [{ src: "a" }, { src: "a", dst: "c/a" }] }, src);

			await expect(_extractFromTemplate(conf, src, dest, { logger }))
				.rejects.toThrow(
					"aborted to copy files, because followings already exist. [a, c/a]"
				);
		});

		it("can copy files with force-option even if file exists", async () => {
			const logger = new ConsoleLogger({ quiet: true });
			const src = ".akashic-templates/simple";
			const dest = ".akashic-templates/copyTo";
			const conf = await completeTemplateConfig({}, src);
			await _extractFromTemplate(conf, src, dest, { logger, forceCopy: true });

			expect(fs.readFileSync(path.join(".akashic-templates", "copyTo", "a")).toString("utf8")).toBe("aaa");
			expect(fs.readFileSync(path.join(".akashic-templates", "copyTo", "b")).toString("utf8")).toBe("bbb");
			expect(fs.readFileSync(path.join(".akashic-templates", "copyTo", "c", "a")).toString("utf8")).toBe("yyyyyyyy");
			expect(fs.readFileSync(path.join(".akashic-templates", "copyTo", "c", "d")).toString("utf8")).toBe("ddd");
		});

		it("can copy files with force-option even if file exists (specify files)", async () => {
			const logger = new ConsoleLogger({ quiet: true });
			const src = ".akashic-templates/simple";
			const dest = ".akashic-templates/copyTo";
			const conf = await completeTemplateConfig({ files: [{ src: "a" }, { src: "a", dst: "c/a" }] }, src);
			await _extractFromTemplate(conf, src, dest, { logger, forceCopy: true });

			expect(fs.readFileSync(path.join(".akashic-templates", "copyTo", "a")).toString("utf8")).toBe("aaa");
			expect(fs.readFileSync(path.join(".akashic-templates", "copyTo", "c", "a")).toString("utf8")).toBe("aaa");
		});
	});
});
