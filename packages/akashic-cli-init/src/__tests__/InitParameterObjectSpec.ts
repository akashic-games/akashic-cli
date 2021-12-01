import * as os from "os";
import * as  path from "path";
import { ConsoleLogger } from "@akashic/akashic-cli-commons/lib/ConsoleLogger";
import * as target from "../../lib/init/InitParameterObject";
import { MockTemplateFile } from "./support/mockConfigFile";

describe("InitParameterObject.ts", () => {
	describe("completeInitParameterObject()", () => {
		it("complete InitParameterObject", async () => {
			const param = {
				logger: new ConsoleLogger({quiet: true}),
				configFile: new MockTemplateFile({
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
				configFile: new MockTemplateFile({})
			};
			const ret = await target.completeInitParameterObject(param);
			expect(ret.cwd).toBe(process.cwd());
			expect(ret.templateListJsonPath).toBe("template-list.json");
			expect(ret.repository).toBe("https://akashic-contents.github.io/templates/");
			expect(ret.localTemplateDirectory).toBe(path.join(os.homedir(), ".akashic-templates"));
			expect(ret.type).toBe("javascript");
			expect(ret.githubHost).toBe("github.com");
			expect(ret.githubProtocol).toBe("https");
			expect(ret.gheHost).toBeNull();
			expect(ret.gheProtocol).toBe("https");
		});

	});
});
