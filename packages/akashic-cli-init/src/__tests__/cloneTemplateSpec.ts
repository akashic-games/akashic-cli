import { exec } from "child_process";
import { ConsoleLogger } from "@akashic/akashic-cli-commons/lib/ConsoleLogger.js";
import * as InitCommonOptions from "../common/InitCommonOptions.js";
import * as ct from "../init/cloneTemplate.js";
import { MockInstance, vi } from "vitest";

vi.mock("child_process", () => ({
	exec: vi.fn((_cmd, _opts, callback) => callback()),
}));

describe("cloneTemplate()", () => {
	let mockConfirm: MockInstance = null!;
	beforeEach(() => {
		vi.clearAllMocks();
	});
	beforeAll(async () => {
		mockConfirm = vi.spyOn(InitCommonOptions, "confirmAccessToUrl").mockResolvedValue(true);
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
		expect(exec).toHaveBeenCalledTimes(1);
		expect(exec).toHaveBeenCalledWith(
			"git clone  git@github.com:akashic-games/akashic-template.git /path/to/dummy/dir",
			expect.anything(),
			expect.anything(),
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

		expect(exec).toHaveBeenCalledTimes(1);
		expect(exec).toHaveBeenCalledWith(
			"git clone --branch beta https://my.another.company.com/my-another-orgs/my-another-repo.git /path/to/another/local/dir",
			expect.anything(),
			expect.anything(),
		);
	});

	it("should reference env.GIT_BIN_PATH", async () => {
		vi.stubEnv("GIT_BIN_PATH", "/path/to/git/bin/git");

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
		expect(exec).toHaveBeenCalledTimes(1);
		expect(exec).toHaveBeenCalledWith(
			"/path/to/git/bin/git clone --depth 1 --branch next https://github.com/akashic-games/akashic-template.git " +
			"/path/to/dummy/dir",
			expect.anything(),
			expect.anything(),
		);

		vi.stubEnv("GIT_BIN_PATH", undefined);
	});
});

describe("parseCloneTargetInfo()", () => {
	it("can parse CloneTargetInfo", () => {
		expect(ct.parseCloneTargetInfo("github:your-orgs/your-repo")).toEqual({
			gitType: "github",
			owner: "your-orgs",
			repo: "your-repo",
			branch: null
		});
		expect(ct.parseCloneTargetInfo("ghe:my-orgs/my-repo#foo")).toEqual({
			gitType: "ghe",
			owner: "my-orgs",
			repo: "my-repo",
			branch: "foo"
		});
		expect(ct.parseCloneTargetInfo("invalid-pattern")).toEqual({
			gitType: null,
			owner: null,
			repo: null,
			branch: null
		});
	});
});
