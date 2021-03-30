import { ConsoleLogger } from "@akashic/akashic-cli-commons/lib/ConsoleLogger";
import { LibConfiguration } from "../../lib/LibConfiguration";

describe("LibConfiguration", () => {
	const nullLogger = new ConsoleLogger({ quiet: true, debugLogMethod: () => {/* do nothing */} });

	it("add/remove/clear", () => {
		const conf = new LibConfiguration({
			content: {},
			logger: nullLogger,
			basepath: "./"
		});

		conf.addAsset({
			type: "image",
			path: "dummy-1/image1.png",
			width: 1,
			height: 2
		});
		conf.addAsset({
			type: "image",
			path: "dummy-1/image2.png",
			width: 3,
			height: 4
		});
		conf.addAsset({
			type: "audio",
			path: "dummy-2/audio",
			systemId: "sound",
			duration: 1000
		});
		expect(conf.getContent().assetList).toEqual(
			[
				{
					type: "image",
					path: "dummy-1/image1.png",
					width: 1,
					height: 2
				},
				{
					type: "image",
					path: "dummy-1/image2.png",
					width: 3,
					height: 4
				},
				{
					type: "audio",
					path: "dummy-2/audio",
					systemId: "sound",
					duration: 1000
				}
			],
		);

		conf.removeAssetByPath("dummy-1/image2.png");
		expect(conf.getContent().assetList).toEqual(
			[
				{
					type: "image",
					path: "dummy-1/image1.png",
					width: 1,
					height: 2
				},
				{
					type: "audio",
					path: "dummy-2/audio",
					systemId: "sound",
					duration: 1000
				}
			]
		);

		conf.clearImageAssets();
		expect(conf.getContent().assetList).toEqual(
			[
				{
					type: "audio",
					path: "dummy-2/audio",
					systemId: "sound",
					duration: 1000
				}
			]
		);

		conf.clearAudioAssets();
		expect(conf.getContent().assetList).toBeUndefined();
	});
});
