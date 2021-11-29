import * as path from "path";
import * as express from "express";
import * as getPort from "get-port";
import { listTemplates } from "../lib/list/listTemplates";

describe("list.ts", () => {
	let templateServer: any = null;
	let repositoryUrl = "";
	beforeAll(async () => {
		const port = await getPort();
		const app = express();
		app.use(express.static(path.resolve(__dirname, "support", "fixture")));
		templateServer = app.listen(port);
		repositoryUrl = `http://127.0.0.1:${port}/remote/`;
	});
	afterAll(() => {
		if (templateServer) {
			templateServer.close();
			templateServer = null;
			repositoryUrl = "";
		}
	});

	describe("listTemplates()", () => {
		it("list templates", async () => {
			const printed: string[] = [];
			const param = {
				logger: {
					error: (_s: string) => { throw new Error("logger error"); },
					print: (s: string) => { printed.push(s); },
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
