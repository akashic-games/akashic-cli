import * as path from "path";
import { ConsoleLogger } from "@akashic/akashic-cli-commons/lib/ConsoleLogger.js";
import fs from "fs-extra";
import mockfs from "mock-fs";
import { internals } from "../init/init.js";
import { completeTemplateConfig } from "../init/TemplateConfig.js";
import { vi } from "vitest";

const _extractFromTemplate = internals._extractFromTemplate;
const _addExtensionToPackageJSON = internals._addExtensionToPackageJSON;
const _setSpawnFn = internals._setSpawnFn;
const _extractVersionPrefix = internals._extractVersionPrefix;

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

	describe("_addExtensionToPackageJSON", () => {
		function createSpawnMock(exitCode: number): any {
			return vi.fn(() => ({
				on: (_event: "close", listener: (code: number | null, signal: unknown) => void) => {
					listener(exitCode, null);
					return {};
				},
			}));
		}

		const onSpawnMock = createSpawnMock(0);
		_setSpawnFn(onSpawnMock);

		beforeEach(() => {
			onSpawnMock.mockClear();
		});

		afterAll(() => {
			_setSpawnFn(undefined);
		});

		it.each([
			["foo", "^3", "^"],
			["@scope/foo", "~2.1.5", "~"],
			["foo", "1.2.3", ""],
			["@scope/foo", "latest", "^"],
		])(
			"resolves and calls spawn correctly for '%s@%s'",
			async (module, version, expectedPrefix) => {
				await expect(_addExtensionToPackageJSON(module, version)).resolves.toBeUndefined();
				expect(onSpawnMock).toHaveBeenCalledWith(
					"npm",
					[
						"install",
						"--save",
						"--package-lock-only",
						"--no-package-lock",
						"--save-prefix",
						expectedPrefix,
						`${module}@${version}`,
					],
					{ stdio: "inherit" },
				);
			},
		);
	});

	describe("_extractVersionPrefix", () => {
		it("returns ^ for versions starting with ^", () => {
			expect(_extractVersionPrefix("^10")).toBe("^");
			expect(_extractVersionPrefix("^5.1.0")).toBe("^");
			expect(_extractVersionPrefix("^0.1.2")).toBe("^");
		});

		it("returns ~ for versions starting with ~", () => {
			expect(_extractVersionPrefix("~5")).toBe("~");
			expect(_extractVersionPrefix("~3.5")).toBe("~");
			expect(_extractVersionPrefix("~2.1.0")).toBe("~");
		});

		it("returns empty string for versions without prefix or empty string", () => {
			expect(_extractVersionPrefix("3")).toBe("");
			expect(_extractVersionPrefix("2.10")).toBe("");
			expect(_extractVersionPrefix("1.2.3")).toBe("");
			expect(_extractVersionPrefix("0.0.1")).toBe("");
			expect(_extractVersionPrefix("")).toBe("");
		});

		it("returns ^ as default for 'latest'", () => {
			expect(_extractVersionPrefix("latest")).toBe("^");
		});
	});
});
