// import * as os from "os";
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
		it("list templates", done => {
			const printed: string[] = [];
			const param = {
				logger: {
					error: (_s: string) => { done.fail(); },
					print: (s: string) => { printed.push(s); },
					info: (_s: string) => {},
					warn: (_s: string) => {}
				},
				repository: repositoryUrl,
				templateListJsonPath: "template-list.json",
				localTemplateDirectory: path.join(__dirname, "support", "fixture", "local")
			};

			listTemplates(param)
				.then(() => {
					expect(printed).toEqual(
						expect.arrayContaining([
							"javascript",
							"typescript",
							"javascript-minimal"
						])
					);
				})
				.then(done, done.fail);
		});
	});
});
