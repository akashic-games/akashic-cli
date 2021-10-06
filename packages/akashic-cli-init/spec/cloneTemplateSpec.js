var fs = require("fs-extra");
var path = require("path");
var ConsoleLogger = require("@akashic/akashic-cli-commons/lib/ConsoleLogger").ConsoleLogger;
var ct = require("../lib/cloneTemplate");
var init = require("../lib/init");

const targetDir = path.join(__dirname, "clone_repo_temp");

describe("cloneTemplate.js", () => {
	beforeEach(() => {
		if (fs.existsSync(targetDir)) {
			// TODO: fs.rm() に移行
			fs.rmdirSync(targetDir, { recursive:true, force:true });
		}
		fs.mkdirSync(targetDir);
	});

	afterEach(() => {
		// TODO: fs.rm() に移行
		fs.rmdirSync(targetDir, { recursive:true, force:true });
	});

	it("clone via promiseInit()", async () => {
		var param = {
			logger: new ConsoleLogger({quiet: true}),
			type: "github:akashic-games/akashic-runtime-version-table",
			cwd: targetDir
		};
		await init.promiseInit(param);

		// NOTE: akashic-runtime-version-table 側のファイル構造に依存するがとりあえず
		expect(fs.statSync(path.join(targetDir, "versions.json")).isFile()).toBe(true);
		expect(fs.statSync(path.join(targetDir, "README.md")).isFile()).toBe(true);
		expect(fs.statSync(path.join(targetDir, ".gitignore")).isFile()).toBe(true);
	});

	it("clone via cloneTemplate()", async () => {
		var param = {
			logger: new ConsoleLogger({quiet: true}),
			type: "github:akashic-games/akashic-runtime-version-table",
			cwd: targetDir
		};
		await ct.cloneTemplate(
			{
				owner: "akashic-games",
				repo: "akashic-runtime-version-table",
				targetPath: param.cwd
			},
			param
		);

		// NOTE: akashic-runtime-version-table 側のファイル構造に依存するがとりあえず
		expect(fs.statSync(path.join(targetDir, "versions.json")).isFile()).toBe(true);
		expect(fs.statSync(path.join(targetDir, "README.md")).isFile()).toBe(true);
		expect(fs.statSync(path.join(targetDir, ".gitignore")).isFile()).toBe(true);
	});
});
