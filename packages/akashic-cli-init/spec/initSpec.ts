import * as path from "path";
import { ConsoleLogger } from "@akashic/akashic-cli-commons/lib/ConsoleLogger";
import * as fs from "fs-extra";
import * as mockfs from "mock-fs";
import { internals } from "../lib/init/init";
import { completeTemplateConfig } from "../lib/init/TemplateConfig";
// import * as init from "../lib/init/init";
const _extractFromTemplate =  internals._extractFromTemplate;

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

		it("copy simple template", done => {
			const logger = new ConsoleLogger({ quiet: true });
			const src = ".akashic-templates/simple";
			const dest = "home";
			completeTemplateConfig({}, src)
				.then(conf => _extractFromTemplate(conf, src, dest, { logger }))
				.then(() => {
					expect(fs.statSync(path.join("home", "a")).isFile()).toBe(true);
					expect(fs.statSync(path.join("home", "b")).isFile()).toBe(true);
					expect(fs.statSync(path.join("home", "c")).isDirectory()).toBe(true);
					expect(fs.statSync(path.join("home", "c", "d")).isFile()).toBe(true);
				})
				.then(done, done.fail);
		});

		it("copy manual template", done => {
			const logger = new ConsoleLogger({ quiet: true });
			const src = ".akashic-templates/manual";
			const dest = "home";
			completeTemplateConfig({}, src)
				.then(conf => _extractFromTemplate(conf, src, dest, { logger }))
				.then(() => {
					expect(fs.statSync(path.join("home", "a")).isFile()).toBe(true);
					expect(fs.statSync(path.join("home", "y", "z", "e")).isFile()).toBe(true);
				})
				.then(done, done.fail);
		});

		it("can not copy when file exists", done => {
			const logger = new ConsoleLogger({ quiet: true });
			const src = ".akashic-templates/simple";
			const dest = ".akashic-templates/copyTo";
			completeTemplateConfig({}, src)
				.then(conf => _extractFromTemplate(conf, src, dest, { logger }))
				.then(() => {done.fail();})
				.catch((err) => {
					expect(err.message).toBe("aborted to copy files, because followings already exist. [a, c]");
					done();
				});
		});

		it("can not copy when file exists (specify files)", done => {
			const logger = new ConsoleLogger({ quiet: true });
			const src = ".akashic-templates/simple";
			const dest = ".akashic-templates/copyTo";
			completeTemplateConfig({ files: [{ src: "a" }, { src: "a", dst: "c" }] }, src)
				.then(conf => _extractFromTemplate(conf, src, dest, { logger }))
				.then(() => {done.fail();})
				.catch((err) => {
					expect(err.message).toBe(`aborted to copy files, because followings already exist. [a, c${path.sep}a]`);
					done();
				});
		});

		it("can copy files with force-option even if file exists", done => {
			const logger = new ConsoleLogger({ quiet: true });
			const src = ".akashic-templates/simple";
			const dest = ".akashic-templates/copyTo";
			completeTemplateConfig({}, src)
				.then(conf => _extractFromTemplate(conf, src, dest, { logger, forceCopy: true }))
				.then(() => {
					expect(fs.readFileSync(path.join(".akashic-templates", "copyTo", "a")).toString("utf8")).toBe("aaa");
					expect(fs.readFileSync(path.join(".akashic-templates", "copyTo", "b")).toString("utf8")).toBe("bbb");
					expect(fs.readFileSync(path.join(".akashic-templates", "copyTo", "c", "a")).toString("utf8")).toBe("yyyyyyyy");
					expect(fs.readFileSync(path.join(".akashic-templates", "copyTo", "c", "d")).toString("utf8")).toBe("ddd");
				}).then(done, done.fail);
		});

		it("can copy files with force-option even if file exists (specify files)", done => {
			const logger = new ConsoleLogger({ quiet: true });
			const src = ".akashic-templates/simple";
			const dest = ".akashic-templates/copyTo";
			completeTemplateConfig({ files: [{ src: "a" }, { src: "a", dst: "c" }] }, src)
				.then(conf => _extractFromTemplate(conf, src, dest, { logger, forceCopy: true }))
				.then(() => {
					expect(fs.readFileSync(path.join(".akashic-templates", "copyTo", "a")).toString("utf8")).toBe("aaa");
					expect(fs.readFileSync(path.join(".akashic-templates", "copyTo", "c", "a")).toString("utf8")).toBe("aaa");
				}).then(done, done.fail);
		});
	});
});
