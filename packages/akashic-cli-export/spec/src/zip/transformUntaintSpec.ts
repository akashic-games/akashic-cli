
import { GameConfiguration } from "@akashic/akashic-cli-commons";
import { ImageAssetConfigurationBase } from "@akashic/game-configuration";
import { transformUntaint } from "../../../lib/zip/transformUntaint";

describe("addUntaintedToImageAssets", function () {
	it("add 'untainted: true' to image asset on specified gamejson", async function () {
		const gamejson: GameConfiguration = {
			"width": 320,
			"height": 320,
			"fps": 30,
			"main": "./script/main.js",
			"assets": {
				"main": {
					"type": "script",
					"path": "script/main.js",
					"global": true
				},
				"sample_image1": {
					"type": "image",
					"width": 150,
					"height": 149,
					"path": "image/sample_image1.png"
				},
				"sample_image2": {
					"type": "image",
					"width": 150,
					"height": 149,
					"path": "image/sample_image2.png"
				},
				"sample_text1": {
					"type": "text",
					"path": "texte/sample_text1.png"
				}
			}
		};
		await transformUntaint(gamejson);
		// ImageAssetには "untainted: true" が付与される
		const sampleImage1 = gamejson.assets.sample_image1 as ImageAssetConfigurationBase;
		const sampleImage2 = gamejson.assets.sample_image2 as ImageAssetConfigurationBase;
		expect(sampleImage1.hint!.untainted).toBeTruthy();
		expect(sampleImage2.hint!.untainted).toBeTruthy();
		// ImageAsset以外には "untainted: true" が付与されない
		expect(gamejson.assets.main.hasOwnProperty("hint")).toBeFalsy();
		expect(gamejson.assets.sample_text1.hasOwnProperty("hint")).toBeFalsy();
	});
});
