import * as path from "path";
import { ConsoleLogger } from "@akashic/akashic-cli-commons/lib/ConsoleLogger.js";
import fs from "fs-extra";
import { internals } from "../init/init.js";
import { completeTemplateConfig } from "../init/TemplateConfig.js";
import * as testUtil from "../../../akashic-cli-commons/src/__tests__/helpers/TestUtil.js";

const _extractFromTemplate = internals._extractFromTemplate;

describe("init.ts", () => {

	describe("_extractFromTemplate()", async () => {
		const mockFsContent = {
			".akashic-templates": {
					simple: {
						a: "aaa",
						b: "bbb",
						c: {
							d: "ddd"
						}
					},
					copyTo: {
						a: "xxxxxxxxxx",
						c: {
							a: "yyyyyyyy"
						}
					}
			},
			home: {}
		};
		const baseDir = path.resolve(__dirname, "..", "__tests__", "fixture-init-");
		const fixtureContents = testUtil.prepareFsContent(mockFsContent, fs.mkdtempSync(baseDir));

		afterAll(() => {
			fixtureContents.dispose();
		});

		it("copy simple template", async () => {
			const logger = new ConsoleLogger({ quiet: true });
			const src = path.join(fixtureContents.path, ".akashic-templates/simple");
			const dest = path.join(fixtureContents.path, "home");
			const conf = await completeTemplateConfig({}, src);
			await _extractFromTemplate(conf, src, dest, { logger });

			expect(fs.statSync(path.join(dest, "a")).isFile()).toBe(true);
			expect(fs.statSync(path.join(dest, "b")).isFile()).toBe(true);
			expect(fs.statSync(path.join(dest, "c")).isDirectory()).toBe(true);
			expect(fs.statSync(path.join(dest, "c", "d")).isFile()).toBe(true);
		});

		it("reject unsupported formatVersion", async () => {
			const src = ".akashic-templates/never-refered";
			const mockFn = vi.fn<(templateConfig: any, baseDir: string) => Promise<any>>(completeTemplateConfig);
			await expect(mockFn({ formatVersion: "101" }, src))
				.rejects.toThrow(
					"Unsupported formatVersion: \"101\". " +
					"The only valid value for this version is \"0\". " +
					"Newer version of akashic-cli may support this formatVersion."
				);
		});

		it("can not copy when file exists", async () => {
			const logger = new ConsoleLogger({ quiet: true });
			const src = path.join(fixtureContents.path, ".akashic-templates/simple");
			const dest = path.join(fixtureContents.path, ".akashic-templates/copyTo");
			const conf = await completeTemplateConfig({}, src);

			await expect( _extractFromTemplate(conf, src, dest, { logger }))
				.rejects.toThrow(
					"aborted to copy files, because followings already exist. [a, c]"
				);
		});

		it("can not copy when file exists (specify files)", async () => {
			const logger = new ConsoleLogger({ quiet: true });
			const src = path.join(fixtureContents.path, ".akashic-templates/simple");
			const dest = path.join(fixtureContents.path, ".akashic-templates/copyTo");
			const conf = await completeTemplateConfig({ files: [{ src: "a" }, { src: "a", dst: "c/a" }] }, src);

			await expect(_extractFromTemplate(conf, src, dest, { logger }))
				.rejects.toThrow(
					"aborted to copy files, because followings already exist. [a, c/a]"
				);
		});

		it("can copy files with force-option even if file exists", async () => {
			const logger = new ConsoleLogger({ quiet: true });
			const src = path.join(fixtureContents.path, ".akashic-templates/simple");
			const dest = path.join(fixtureContents.path, ".akashic-templates/copyTo");
			const conf = await completeTemplateConfig({}, src);
			await _extractFromTemplate(conf, src, dest, { logger, forceCopy: true });

			expect(fs.readFileSync(path.join(dest, "a")).toString("utf8")).toBe("aaa");
			expect(fs.readFileSync(path.join(dest, "b")).toString("utf8")).toBe("bbb");
			expect(fs.readFileSync(path.join(dest, "c", "a")).toString("utf8")).toBe("yyyyyyyy");
			expect(fs.readFileSync(path.join(dest, "c", "d")).toString("utf8")).toBe("ddd");
		});

		it("can copy files with force-option even if file exists (specify files)", async () => {
			const logger = new ConsoleLogger({ quiet: true });
			const src = path.join(fixtureContents.path, ".akashic-templates/simple");
			const dest = path.join(fixtureContents.path, ".akashic-templates/copyTo");
			const conf = await completeTemplateConfig({ files: [{ src: "a" }, { src: "a", dst: "c/a" }] }, src);
			await _extractFromTemplate(conf, src, dest, { logger, forceCopy: true });

			expect(fs.readFileSync(path.join(dest, "a")).toString("utf8")).toBe("aaa");
			expect(fs.readFileSync(path.join(dest, "c", "a")).toString("utf8")).toBe("aaa");
		});
	});
});
