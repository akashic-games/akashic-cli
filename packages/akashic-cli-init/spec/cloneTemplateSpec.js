var ConsoleLogger = require("@akashic/akashic-cli-commons/lib/ConsoleLogger").ConsoleLogger;
var ct = require("../lib/cloneTemplate");
var init = require("../lib/init");

jest.mock("child_process");
const mockExec = require("child_process").exec;
mockExec.mockImplementation((_command, _opts, callback) => {
	callback();
});

describe("cloneTemplate.js", () => {
	beforeEach(() => {
		mockExec.mockClear();
	});

	it("can execute a command to clone repository from github.com via promiseInit()", async () => {
		await init.promiseInit({
			logger: new ConsoleLogger({quiet: true}),
			type: "github:akashic-games/akashic-template",
			cwd: "/path/to/dummy/dir"
		});

		expect(mockExec.mock.calls[0][0]).toEqual(
			"git clone --depth 1 https://github.com/akashic-games/akashic-template.git /path/to/dummy/dir"
		);
	});

	it("can execute a command to clone repository from github.com via cloneTemplate()", async () => {
		await ct.cloneTemplate(
			"github.com",
			"ssh",
			{
				owner: "akashic-games",
				repo: "akashic-template",
				targetPath: "/path/to/dummy/dir",
				shallow: false
			},
			{
				logger: new ConsoleLogger({quiet: true}),
				type: "github:akashic-games/akashic-template",
				cwd: "/path/to/dummy/dir"
			}
		);

		// NOTE: clone の後の半角スペース2つは実装上の都合
		expect(mockExec.mock.calls[0][0]).toEqual(
			"git clone  git@github.com:akashic-games/akashic-template.git /path/to/dummy/dir"
		);
	});

	it("can execute a command to clone repository from GitHub Enterprise via promiseInit()", async () => {
		await init.promiseInit({
			logger: new ConsoleLogger({quiet: true}),
			type: "ghe:my-orgs/my-repo",
			gheHost: "my.company.com",
			gheProtocol: "ssh",
			cwd: "/path/to/local/dir"
		});

		expect(mockExec.mock.calls[0][0]).toEqual(
			"git clone --depth 1 git@my.company.com:my-orgs/my-repo.git /path/to/local/dir"
		);
	});

	it("can execute a command to clone repository from GitHub Enterprise via cloneTemplate()", async () => {
		await ct.cloneTemplate(
			"my.another.company.com",
			"https",
			{
				owner: "my-another-orgs",
				repo: "my-another-repo",
				targetPath: "/path/to/another/local/dir",
				shallow: false
			},
			{
				logger: new ConsoleLogger({quiet: true}),
				type: "ghe:my-orgs/my-repo",
				gheHost: "my.another.company.com",
				cwd: "/path/to/another/local/dir"
			}
		);

		// NOTE: clone の後の半角スペース2つは実装上の都合
		expect(mockExec.mock.calls[0][0]).toEqual(
			"git clone  https://my.another.company.com/my-another-orgs/my-another-repo.git " +
			"/path/to/another/local/dir"
		);
	});

	it("should reference env.GIT_BIN_PATH", async () => {
		process.env.GIT_BIN_PATH = "/path/to/git/bin/git";

		await init.promiseInit({
			logger: new ConsoleLogger({quiet: true}),
			type: "github:akashic-games/akashic-template",
			cwd: "/path/to/dummy/dir"
		});

		expect(mockExec.mock.calls[0][0]).toEqual(
			"/path/to/git/bin/git clone --depth 1 https://github.com/akashic-games/akashic-template.git " +
			"/path/to/dummy/dir"
		);

		process.env.GIT_BIN_PATH = undefined;
	});
});
