import * as fs from "fs";
import * as path from "path";
import { ConsoleLogger } from "@akashic/akashic-cli-commons/lib/ConsoleLogger";
import * as mockfs from "mock-fs";
import { copyTemplate } from "../init/copyTemplate";

describe("copyTemplate", () => {
	beforeEach(() => {
		mockfs({});
	});

	afterEach(() => {
		mockfs.restore();
	});

	it("can copy template files", async () => {
		mockfs({
			"source": {
				".akashicinitignore": "",
				".hidden": "",
				".ignore": {
					"file": "this is ignored file."
				},
				"package.json": "{}",
				"path": {
					"to": {
						"file.txt": "this is text file."
					}
				}
			},
			"destination": {}
		});
		await copyTemplate(
			"source",
			"destination",
			{
				logger: new ConsoleLogger({ quiet: true })
			}
		);

		expect(fs.existsSync(path.join("destination", ".akashicinitignore"))).toBe(false);
		expect(fs.readFileSync(path.join("destination", ".hidden"), { encoding: "utf-8" })).toBe("");
		expect(fs.readFileSync(path.join("destination", "package.json"), { encoding: "utf-8" })).toBe("{}");
		expect(fs.readFileSync(path.join("destination", ".ignore", "file"), { encoding: "utf-8" })).toBe("this is ignored file.");
		expect(fs.readFileSync(path.join("destination", "path", "to", "file.txt"), { encoding: "utf-8" })).toBe("this is text file.");
	});

	it("can copy template files while respecting .akashicinitignore", async () => {
		mockfs({
			"source": {
				".akashicinitignore": ".akashicinitignore\n.ignore",
				".hidden": "",
				".ignore": {
					"file": "this is ignored file."
				},
				"package.json": "{}",
				"path": {
					"to": {
						"file.txt": "this is text file."
					}
				}
			},
			"destination": {}
		});
		await copyTemplate(
			"source",
			"destination",
			{
				logger: new ConsoleLogger({ quiet: true })
			}
		);

		expect(fs.existsSync(path.join("destination", ".akashicinitignore"))).toBe(false);
		expect(fs.existsSync(path.join("destination", ".ignore"))).toBe(false);
		expect(fs.readFileSync(path.join("destination", ".hidden"), { encoding: "utf-8" })).toBe("");
		expect(fs.readFileSync(path.join("destination", "package.json"), { encoding: "utf-8" })).toBe("{}");
		expect(fs.readFileSync(path.join("destination", "path", "to", "file.txt"), { encoding: "utf-8" })).toBe("this is text file.");
	});
});
