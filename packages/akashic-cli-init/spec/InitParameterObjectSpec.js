var os = require("os");
var path = require("path");
var ConsoleLogger = require("@akashic/akashic-cli-commons/lib/ConsoleLogger").ConsoleLogger;
var target = require("../lib/init/InitParameterObject");
var MockConfigFile = require("./support/mockConfigFile");

describe("InitParameterObject.ts", () => {
	describe("completeInitParameterObject()", () => {
		it("complete InitParameterObject", done => {
			var param = {
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
			target.completeInitParameterObject(param)
			.then(() => {
				expect(param.cwd).toBe(process.cwd());
				expect(param.templateListJsonPath).toBe("template-list.json");
				expect(param.repository).toBe("dummyRepositoryUrl");
				expect(param.localTemplateDirectory).toBe("dummyTemplateDirectory");
				expect(param.type).toBe("dummytemplatetype");
				expect(param.githubHost).toBe("github.com");
				expect(param.githubProtocol).toBe("ssh");
				expect(param.gheHost).toBe("your.company.com");
				expect(param.gheProtocol).toBe("https");
			})
			.then(done, done.fail);
		});

		it("using default values", done => {
			var param = {
				logger: new ConsoleLogger({quiet: true}),
				configFile: new MockConfigFile({})
			};
			target.completeInitParameterObject(param)
			.then(() => {
				expect(param.cwd).toBe(process.cwd());
				expect(param.templateListJsonPath).toBe("template-list.json");
				expect(param.repository).toBe("");
				expect(param.localTemplateDirectory).toBe(path.join(os.homedir(), ".akashic-templates"));
				expect(param.type).toBe("javascript");
				expect(param.githubHost).toBe("github.com");
				expect(param.githubProtocol).toBe("https");
				expect(param.gheHost).toBeUndefined();
				expect(param.gheProtocol).toBe("https");
			})
			.then(done, done.fail);
		});
	});
});
