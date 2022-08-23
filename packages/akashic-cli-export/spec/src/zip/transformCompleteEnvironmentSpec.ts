import { GameConfiguration } from "@akashic/akashic-cli-commons";
import * as gfhRaw from "../../../lib/zip/getFromHttps";
import { transformCompleteEnvrironment } from "../../../lib/zip/transformCompleteEnvironment";

const MOCK_RUNTIME_VERSION_TABLE = {
	latest: {
		"1": "1.101.102-103",
		"2": "2.201.202-203",
		"3": "3.301.302-303"
	}
};

jest.mock("../../../lib/zip/getFromHttps");
const gfh = gfhRaw as jest.Mocked<typeof gfhRaw>;
gfh.getFromHttps.mockReturnValue(Promise.resolve(JSON.stringify(MOCK_RUNTIME_VERSION_TABLE)));

describe("transformCompleteEnvironment", function () {
	it("completes environment from the minimal state", async () => {
		const gamejson: GameConfiguration = {
			width: 320,
			height: 240,
			fps: 60,
			assets: {},
			main: "./script/main.js"
		};
		await transformCompleteEnvrironment(gamejson);
		expect(gamejson.environment).toEqual({
			external: {
				send: "0",
			},
			"sandbox-runtime": "1",
			"akashic-runtime": {
				version: "~1.101.102-103"
			}
		});
	});

	it("completes based on sandbox-runtime", async () => {
		const gamejson: GameConfiguration = {
			width: 320,
			height: 240,
			fps: 60,
			assets: {},
			main: "./script/main.js",
			environment: {
				"sandbox-runtime": "2"
			}
		};
		await transformCompleteEnvrironment(gamejson);
		expect(gamejson.environment).toEqual({
			external: {
				send: "0",
			},
			"sandbox-runtime": "2",
			"akashic-runtime": {
				version: "~2.201.202-203",
				flavor: "-canvas"
			}
		});
	});

	it("does nothing if the value is already given", async () => {
		const gamejson: GameConfiguration = {
			width: 320,
			height: 240,
			fps: 60,
			assets: {},
			main: "./script/main.js",
			environment: {
				external: {
					send: "0",
				},
				"sandbox-runtime": "3",
				"akashic-runtime": "~3.110.111-112"
			}
		};
		await transformCompleteEnvrironment(gamejson);
		expect(gamejson.environment).toEqual({
			external: {
				send: "0",
			},
			"sandbox-runtime": "3",
			"akashic-runtime": "~3.110.111-112"
		});
	});
});
