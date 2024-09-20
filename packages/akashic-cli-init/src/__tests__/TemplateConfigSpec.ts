import { ConsoleLogger } from "@akashic/akashic-cli-commons/lib/ConsoleLogger.js";
import mockfs from "mock-fs";
import { completeTemplateConfig } from "../init/TemplateConfig.js";
import { vi } from "vitest";

describe("completeTemplateConfig", () => {
	beforeEach(() => {
		mockfs({});
	});

	afterEach(() => {
		mockfs.restore();
	});

	it("can complete TemplateConfig", async () => {
		const logger = new ConsoleLogger({ quiet: true });
		const warn = vi.spyOn(logger, "warn");
		const config = await completeTemplateConfig(
			{
				formatVersion: "0",
				files: [
					{ src: ".hidden" },
					{ src: ".ignore", dst: ".ignore" },
					{ src: "package.json"},
					{ src: "path/to/file.txt", dst: "file.txt" }
				],
				exclude: [
					".hidden"
				]
			},
			"source",
			logger
		);

		expect(config).toEqual({
			formatVersion: "0",
			files: [
				{ src: ".hidden", dst: "" }, // files と同時に指定した場合 exclude は無視される
				{ src: ".ignore", dst: ".ignore" },
				{ src: "package.json", dst: "" },
				{ src: "path/to/file.txt", dst: "file.txt" }
			],
			gameJson: "game.json",
			guideMessage: null
		});
		expect(warn.mock.calls.length).toBe(1);
		expect(
			warn.mock.calls[0][0]
		).toBe("Both \"files\" and \"exclude\" are found in template.json, \"exclude\" is ignored.");
	});

	it("can complete TemplateConfig respecting 'exclude' filed", async () => {
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
		const config = await completeTemplateConfig(
			{
				formatVersion: "0",
				exclude: [
					".akashicinitignore",
					".ignore"
				]
			},
			"source",
			new ConsoleLogger({ quiet: true })
		);

		expect(config).toEqual({
			formatVersion: "0",
			files: [
				{ src: "package.json", dst: "" },
				{ src: ".hidden", dst: "" },
				{ src: "path/to/file.txt", dst: "" }
			],
			gameJson: "game.json",
			guideMessage: null
		});
	});
});
