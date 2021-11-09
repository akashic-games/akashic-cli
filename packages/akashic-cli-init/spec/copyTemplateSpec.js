var fs = require("fs-extra");
var mockfs = require("mock-fs");
var path = require("path");
var ConsoleLogger = require("@akashic/akashic-cli-commons/lib/ConsoleLogger").ConsoleLogger;
var completeTemplateConfig = require("../lib/init/TemplateConfig").completeTemplateConfig;
var _extractFromTemplate = require("../lib/init/init").internals._extractFromTemplate;

describe("copyTemplate.ts", () => {
	describe("copyTemplate()", () => {
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
			var logger = new ConsoleLogger({ quiet: true });
			var src = ".akashic-templates/simple";
			var dest = "home";
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
			var logger = new ConsoleLogger({ quiet: true });
			var src = ".akashic-templates/manual";
			var dest = "home";
			completeTemplateConfig({}, src)
				.then(conf => _extractFromTemplate(conf, src, dest, { logger }))
				.then(() => {
					expect(fs.statSync(path.join("home", "a")).isFile()).toBe(true);
					expect(fs.statSync(path.join("home", "y", "z", "e")).isFile()).toBe(true);
				})
				.then(done, done.fail);
		});

		it("can not copy when file exists", done => {
			var logger = new ConsoleLogger({ quiet: true });
			var src = ".akashic-templates/simple";
			var dest = ".akashic-templates/copyTo";
			completeTemplateConfig({}, src)
				.then(conf => _extractFromTemplate(conf, src, dest, { logger }))
				.then(() => {done.fail();})
				.catch((err) => {
					expect(err.message).toBe("aborted to copy files, because followings already exist. [a, c]");
					done();
				});
		});

		it("can not copy when file exists (specify files)", done => {
			var logger = new ConsoleLogger({ quiet: true });
			var src = ".akashic-templates/simple";
			var dest = ".akashic-templates/copyTo";
			completeTemplateConfig({ files: [{ src: "a" }, { src: "a", dst: "c" }] }, src)
				.then(conf => _extractFromTemplate(conf, src, dest, { logger }))
				.then(() => {done.fail();})
				.catch((err) => {
					expect(err.message).toBe(`aborted to copy files, because followings already exist. [a, c${path.sep}a]`);
					done();
				});
		});

		it("can copy files with force-option even if file exists", done => {
			var logger = new ConsoleLogger({ quiet: true });
			var src = ".akashic-templates/simple";
			var dest = ".akashic-templates/copyTo";
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
			var logger = new ConsoleLogger({ quiet: true });
			var src = ".akashic-templates/simple";
			var dest = ".akashic-templates/copyTo";
			completeTemplateConfig({ files: [{ src: "a" }, { src: "a", dst: "c" }] }, src)
				.then(conf => _extractFromTemplate(conf, src, dest, { logger, forceCopy: true }))
				.then(() => {
					expect(fs.readFileSync(path.join(".akashic-templates", "copyTo", "a")).toString("utf8")).toBe("aaa");
					expect(fs.readFileSync(path.join(".akashic-templates", "copyTo", "c", "a")).toString("utf8")).toBe("aaa");
				}).then(done, done.fail);
		});
	});
});
