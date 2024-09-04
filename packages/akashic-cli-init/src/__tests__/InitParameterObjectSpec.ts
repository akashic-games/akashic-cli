import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { ConsoleLogger } from "@akashic/akashic-cli-commons/lib/ConsoleLogger";
import * as config from "@akashic/akashic-cli-extra/lib/config";
import * as Prompt from "prompt";
import * as target from "../../lib/init/InitParameterObject";
import { MockConfigFile } from "./support/mockConfigFile";

const raw = jest.requireActual("@akashic/akashic-cli-extra/lib/config");
const rawConfig = raw.AkashicConfigFile;
jest.mock("@akashic/akashic-cli-extra/lib/config");
const mockConfig = config.AkashicConfigFile as jest.Mock;

describe("InitParameterObject.ts", () => {
	describe("completeInitParameterObject()", () => {
		it("complete InitParameterObject", async () => {
			const param = {
				logger: new ConsoleLogger({quiet: true}),
				configFile: new MockConfigFile({
					"init.repository": "dummyRepositoryUrl",
					"init.localTemplateDirectory": "dummyTemplateDirectory",
					"init.defaultTemplateType": "dummyTemplateType",
					"init.github.host": "github.com",
					"init.github.protocol": "ssh",
					"init.ghe.host": "your.company.com",
					"init.ghe.protocol": "https"
				})
			};

			const ret = await target.completeInitParameterObject(param);
			expect(ret.cwd).toBe(process.cwd());
			expect(ret.templateListJsonPath).toBe("template-list.json");
			expect(ret.repository).toBe("dummyRepositoryUrl");
			expect(ret.localTemplateDirectory).toBe("dummyTemplateDirectory");
			expect(ret.type).toBe("dummytemplatetype");
			expect(ret.githubHost).toBe("github.com");
			expect(ret.githubProtocol).toBe("ssh");
			expect(ret.gheHost).toBe("your.company.com");
			expect(ret.gheProtocol).toBe("https");
		});

		it("using default values", async () => {
			const param = {
				logger: new ConsoleLogger({quiet: true}),
				configFile: new MockConfigFile({})
			};
			const ret = await target.completeInitParameterObject(param);
			expect(ret.cwd).toBe(process.cwd());
			expect(ret.templateListJsonPath).toBe("template-list.json");
			expect(ret.repository).toBe("https://akashic-contents.github.io/templates/");
			expect(ret.localTemplateDirectory).toBe(path.join(os.homedir(), ".akashic-templates"));
			expect(ret.type).toBe("javascript");
			expect(ret.githubHost).toBe("github.com");
			expect(ret.githubProtocol).toBe("https");
			expect(ret.gheHost).toBe("");
			expect(ret.gheProtocol).toBe("https");
		});
	});

	describe("save the allowed URL in .akashicrc", () => {
		// beforeAll() で必ず代入するので非 null 型とする
		let mockConfigfile: config.AkashicConfigFile = null!;
		let mockPromptGet: jest.SpyInstance = null!;
		const ITEM_KEY = "cache.initKnownUrl";
		const tempPath = path.join(__dirname, "support", "fixture", ".akashicrc");

		beforeAll(() => {
			mockConfig.mockImplementation((validator: {[key: string]: string}, _configPath?: string) => {
				const ret = Object.keys(validator).some((key) => /^init./.test(key));
				const target = ret ? undefined : tempPath;
				if (!ret) return new rawConfig(validator, target);
			});

			mockPromptGet = jest.spyOn(Prompt, "get").mockImplementation((_schema, func) => {
				func(undefined, { confirm: "y" });
			});

			fs.writeFileSync(tempPath, "");
			mockConfigfile = new config.AkashicConfigFile({ "cache.initKnownUrl": ""});
		});
		afterAll(() => {
			mockPromptGet.mockRestore();
			fs.unlinkSync(tempPath);
		});

		it("save repository URL", async () => {
			const param = {
				repository: "https://hoge.com"
			};
			await target.completeInitParameterObject(param);

			await mockConfigfile.load();
			const items = await mockConfigfile.getItem(ITEM_KEY);
			const itemArray = items ? JSON.parse(items) : [];
			expect(itemArray.includes(param.repository));
			expect(mockPromptGet).toHaveBeenCalledTimes(1);
		});

		it("Do not save the same URL", async () => {
			const param = {
				repository: "https://hoge.com"
			};
			await target.completeInitParameterObject(param);

			await mockConfigfile.load();
			const items = await mockConfigfile.getItem(ITEM_KEY);
			const itemArray = items ? JSON.parse(items) : [];
			expect(itemArray.length).toBe(1);
			expect(itemArray.includes(param.repository));
			expect(mockPromptGet).toHaveBeenCalledTimes(1); // 同じ値のため 確認の Prompt は呼ばれず前のテストで呼ばれた 1 回のままとなる。
		});

		it("save github URL", async () => {
			const param = {
				type: "github:my-orgs/my-repo"
			};
			const ret = await target.completeInitParameterObject(param);
			const targetUrl = `${ret.githubProtocol}://${ret.githubHost}/my-orgs/my-repo.git`;

			await mockConfigfile.load();
			const items = await mockConfigfile.getItem(ITEM_KEY);
			const itemArray = items ? JSON.parse(items) : [];
			expect(itemArray.includes(targetUrl));
			expect(mockPromptGet).toHaveBeenCalledTimes(2);
		});

		it("save ghe URL", async () => {
			const param = {
				type: "ghe:my-orgs/my-repo",
				configFile: new MockConfigFile({
					"init.ghe.host": "your.company.com",
					"init.ghe.protocol": "https"
				})
			};
			const ret = await target.completeInitParameterObject(param);
			const targetUrl = `${ret.gheProtocol}://${ret.gheHost}/my-orgs/my-repo.git`;

			await mockConfigfile.load();
			const items = await mockConfigfile.getItem(ITEM_KEY);
			const itemArray = items ? JSON.parse(items) : [];
			expect(itemArray.includes(targetUrl));
		});

		it("4 URLs can be saved", async () => {
			await mockConfigfile.load();
			let items = await mockConfigfile.getItem(ITEM_KEY);
			let itemArray = items ? JSON.parse(items) : [];
			expect(itemArray.length).toBe(3); // 上3つのテストで保存した URL が保存されている
			const firstUrl = itemArray[0];

			// 4個目の URL を保存
			const param = {
				repository: "https://foo.com"
			};
			await target.completeInitParameterObject(param);
			await mockConfigfile.load();
			items = await mockConfigfile.getItem(ITEM_KEY);
			itemArray = items ? JSON.parse(items) : [];
			expect(itemArray.length).toBe(4);

			// 5 個目の URL を保存。最大保存数:4 のため、超える場合は最初の item をpop する。
			param.repository = "https://test,com";
			await target.completeInitParameterObject(param);
			await mockConfigfile.load();
			items = await mockConfigfile.getItem(ITEM_KEY);
			itemArray = items ? JSON.parse(items) : [];
			expect(itemArray.length).toBe(4);
			expect(!itemArray.includes(firstUrl));
			expect(itemArray[3]).toBe("https://test,com");
		});
	});
});
