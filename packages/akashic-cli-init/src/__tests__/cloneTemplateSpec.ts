import * as child_process from "child_process";
import { ConsoleLogger } from "@akashic/akashic-cli-commons/lib/ConsoleLogger";
import * as InitCommonOptions from "../common/InitCommonOptions";
import * as ct from "../init/cloneTemplate";

jest.mock("child_process");
const mockExec = child_process.exec as unknown as jest.Mock;
mockExec.mockImplementation((_command: any, _opts: any, callback: Function) => {
	callback();
});

describe("cloneTemplate.js", () => {
	let mockConfirm: jest.SpyInstance = null!; // beforeAll() で必ず代入するので非 null 型とする
	beforeEach(() => {
		mockExec.mockClear();
	});
	beforeAll(async () => {
		mockConfirm = jest.spyOn(InitCommonOptions, "confirmAccessToUrl").mockResolvedValue(true);
	});
	afterAll(() => {
		mockConfirm.mockRestore();
	});

	it("can execute a command to clone repository from github.com via cloneTemplate()", async () => {
		await ct.cloneTemplate(
			"github.com",
			"ssh",
			{
				owner: "akashic-games",
				repo: "akashic-template",
				targetPath: "/path/to/dummy/dir",
				branch: null,
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

	it("can execute a command to clone repository from GitHub Enterprise via cloneTemplate()", async () => {
		await ct.cloneTemplate(
			"my.another.company.com",
			"https",
			{
				owner: "my-another-orgs",
				repo: "my-another-repo",
				targetPath: "/path/to/another/local/dir",
				branch: "beta",
				shallow: false
			},
			{
				logger: new ConsoleLogger({quiet: true}),
				type: "ghe:my-orgs/my-repo",
				gheHost: "my.another.company.com",
				cwd: "/path/to/another/local/dir"
			}
		);

		expect(mockExec.mock.calls[0][0]).toEqual(
			"git clone --branch beta https://my.another.company.com/my-another-orgs/my-another-repo.git " +
			"/path/to/another/local/dir"
		);
	});

	it("should reference env.GIT_BIN_PATH", async () => {
		process.env.GIT_BIN_PATH = "/path/to/git/bin/git";

		await ct.cloneTemplate(
			"github.com",
			"https",
			{
				owner: "akashic-games",
				repo: "akashic-template",
				targetPath: "/path/to/dummy/dir",
				branch: "next",
				shallow: true
			},
			{
				logger: new ConsoleLogger({quiet: true}),
				type: "github:akashic-games/akashic-template",
				cwd: "/path/to/dummy/dir"
			}
		);

		// NOTE: --depth と --branch の順は実装上の都合
		expect(mockExec.mock.calls[0][0]).toEqual(
			"/path/to/git/bin/git clone --depth 1 --branch next https://github.com/akashic-games/akashic-template.git " +
			"/path/to/dummy/dir"
		);

		process.env.GIT_BIN_PATH = undefined;
	});
});
