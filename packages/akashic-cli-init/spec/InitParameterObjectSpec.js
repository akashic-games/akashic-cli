var os = require("os");
var path = require("path");
var ConsoleLogger = require("@akashic/akashic-cli-commons/lib/ConsoleLogger").ConsoleLogger;
var target = require("../lib/InitParameterObject");
var MockConfigFile = require("./support/mockConfigFile");

describe("InitParameterObject.ts", () => {
	describe("completeInitParameterObject()", () => {
		it("complete InitParameterObject", done => {
			var param = {
				logger: new ConsoleLogger({quiet: true}),
				configFile: new MockConfigFile({
					"init.repository": "dummyRepositoryUrl",
					"init.localTemplateDirectory": "dummyTemplateDirectory",
					"init.defaultTemplateType": "dummyTemplateType"
				})
			};
			target.completeInitParameterObject(param)
			.then(() => {
				expect(param.cwd).toBe(process.cwd());
				expect(param.templateListJsonPath).toBe("template-list.json");
				expect(param.repository).toBe("dummyRepositoryUrl");
				expect(param.localTemplateDirectory).toBe("dummyTemplateDirectory");
				expect(param.type).toBe("dummytemplatetype");
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
			})
			.then(done, done.fail);
		});
	});
});
