import { AssetModule } from "../../lib/AssetModule";

describe("AssetManagerSpec", () => {
	it("toArray()", async () => {
		expect(
			AssetModule.toArray({
				"dummy-1": {
					type: "image",
					path: "path/to/path1",
					width: 120,
					height: 240
				},
				"dummy-2": {
					type: "audio",
					path: "path/to/path2",
					duration: 10,
					systemId: "sound"
				},
				"dummy-3": {
					type: "script",
					path: "path/to/path3"
				},
				"dummy-4": {
					type: "text",
					path: "path/to/path4"
				}
			})
		).toEqual([
			{
				id: "dummy-1",
				type: "image",
				path: "path/to/path1",
				width: 120,
				height: 240
			},
			{
				id: "dummy-2",
				type: "audio",
				path: "path/to/path2",
				duration: 10,
				systemId: "sound"
			},
			{
				id: "dummy-3",
				type: "script",
				path: "path/to/path3"
			},
			{
				id: "dummy-4",
				type: "text",
				path: "path/to/path4"
			}
		]);
	});

	it("toObject()", () => {
		expect(
			AssetModule.toObject(
				[
					{
						id: "dummy-1",
						type: "image",
						path: "path/to/path1",
						width: 120,
						height: 240
					},
					{
						type: "audio",
						path: "path/to/path2",
						duration: 10,
						systemId: "sound"
					},
					{
						type: "script",
						path: "path/to/path3"
					},
					{
						type: "text",
						path: "path/to/path4"
					}
				],
				AssetModule.createAssetIdResolver({
					resolveAssetIdsFromPath: false,
					includeExtensionToAssetId: false
				})
			)
		).toEqual({
			"dummy-1": {
				type: "image",
				path: "path/to/path1",
				width: 120,
				height: 240
			},
			"path2": {
				type: "audio",
				path: "path/to/path2",
				duration: 10,
				systemId: "sound"
			},
			"path3": {
				type: "script",
				path: "path/to/path3"
			},
			"path4": {
				type: "text",
				path: "path/to/path4"
			}
		});
	});

	it("merge()", () => {
		expect(
			AssetModule.merge(
				[
					{
						type: "script",
						path: "path/to/script1.js",
						global: true
					},
					{
						type: "image",
						path: "path/to/image1.png",
						width: 100,
						height: 200,
						hint: {
							untainted: true
						}
					},
					{
						type: "audio",
						path: "path/to/audio1",
						duration: 340,
						systemId: "music",
						global: true
					},
					{
						type: "text",
						path: "path/to/text1.txt",
						global: true
					}
				],
				[
					{
						type: "script",
						path: "path/to/script1.js",
					},
					{
						type: "image",
						path: "path/to/image1.png",
						width: 300,
						height: 400
					},
					{
						type: "audio",
						path: "path/to/audio1",
						duration: 120,
						systemId: "sound"
					},
					{
						type: "text",
						path: "path/to/text1.txt"
					},
					{
						type: "text",
						path: "path/to/text2.txt"
					}
				],
				AssetModule.createDefaultMergeCustomizer()
			)
		).toEqual([
			{
				type: "script",
				path: "path/to/script1.js",
				global: true
			},
			{
				type: "image",
				path: "path/to/image1.png",
				width: 300,
				height: 400,
				hint: {
					untainted: true
				}
			},
			{
				type: "audio",
				path: "path/to/audio1",
				duration: 120,
				systemId: "music",
				global: true
			},
			{
				type: "text",
				path: "path/to/text1.txt",
				global: true
			},
			{
				type: "text",
				path: "path/to/text2.txt"
			}
		])
	});
});
