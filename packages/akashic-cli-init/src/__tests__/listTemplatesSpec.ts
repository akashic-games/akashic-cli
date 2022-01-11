import * as path from "path";
import { ConsoleLogger } from "@akashic/akashic-cli-commons";
import * as express from "express";
import * as getPort from "get-port";
import * as InitCommonOptions from "../../lib/common/InitCommonOptions.js";
import { listTemplates } from "../../lib/list/listTemplates";
import { MockConfigFile } from "./support/mockConfigFile";

describe("list.ts", () => {
	let templateServer: any = null;
	let repositoryUrl = "";
	let mockInitCommonOptions: jest.SpyInstance | null = null;
	beforeAll(async () => {
		const port = await getPort();
		const app = express();
		app.use(express.static(path.resolve(__dirname, "support", "fixture")));
		templateServer = app.listen(port);
		repositoryUrl = `http://127.0.0.1:${port}/remote/`;

		mockInitCommonOptions = jest.spyOn(InitCommonOptions, "completeInitCommonOptions").mockImplementation((opts) => {
			const ret = {
				logger: opts.logger || new ConsoleLogger(),
				configFile: new MockConfigFile({}),
				templateListJsonPath: opts.templateListJsonPath || "templateListJsonPath",
				repository: opts.repository || "repo",
				localTemplateDirectory: opts.localTemplateDirectory || "localTemplateDirectory",
			};
			return Promise.resolve(ret);
		});
	});
	afterAll(() => {
		if (templateServer) {
			templateServer.close();
			templateServer = null;
			repositoryUrl = "";
		}
		mockInitCommonOptions!.mockRestore();
	});

	describe("listTemplates()", () => {
		it("list templates", async () => {
			const printed: string[] = [];
			const param = {
				logger: {
					error: (_s: string) => {
						throw new Error("logger error");
					},
					print: (s: string) => {
						printed.push(s);
					},
					info: (_s: string) => {},
					warn: (_s: string) => {}
				},
				repository: repositoryUrl,
				templateListJsonPath: "template-list.json",
				localTemplateDirectory: path.join(__dirname, "support", "fixture", "local")
			};

			await listTemplates(param);
			expect(printed).toEqual(
				expect.arrayContaining([
					"javascript",
					"typescript",
					"javascript-minimal"
				])
			);
		});
	});
});
