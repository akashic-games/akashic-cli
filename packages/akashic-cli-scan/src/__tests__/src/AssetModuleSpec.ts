import type { AssetConfiguration } from "@akashic/game-configuration";
import { AssetModule } from "../../../lib/AssetModule.js";

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

	describe("merge()", () => {
		const definedAssets: AssetConfiguration[] = [
			{
				type: "audio",
				path: "path/to/already_exists",
				duration: 340,
				systemId: "music",
				global: true
			},
			{
				type: "audio",
				path: "path/to/not_exists",
				duration: 560,
				systemId: "sound"
			},
			{
				type: "image",
				path: "path/to/already_exists.png",
				width: 100,
				height: 200,
				hint: {
					untainted: true
				}
			},
			{
				type: "image",
				path: "path/to/not_exists.png",
				width: 300,
				height: 400
			},
			{
				type: "script",
				path: "path/to/already_exists.js",
				global: true
			},
			{
				type: "script",
				path: "path/to/not_exists.js",
				global: true
			},
			{
				type: "text",
				path: "path/to/already_exists.txt",
				global: true
			},
			{
				type: "text",
				path: "path/to/not_exists.txt",
				global: true
			}
		];

		const scannedAssets: AssetConfiguration[] = [
			{
				type: "audio",
				path: "path/to/already_exists",
				duration: 340,
				systemId: "music"
			},
			{
				type: "audio",
				path: "path/to/new_one",
				duration: 1234,
				systemId: "sound",
				global: true
			},
			{
				type: "image",
				path: "path/to/already_exists.png",
				width: 100,
				height: 200,
				hint: {
					untainted: false
				}
			},
			{
				type: "image",
				path: "path/to/new_one.png",
				width: 500,
				height: 600
			},
			{
				type: "script",
				path: "path/to/already_exists.js",
				global: true
			},
			{
				type: "script",
				path: "path/to/new_one.js",
				global: true
			},
			{
				type: "text",
				path: "path/to/already_exists.txt",
				global: true
			},
			{
				type: "text",
				path: "path/to/new_one.txt"
			}
		];

		it("merge all assets", () => {
			expect(
				AssetModule.merge(
					definedAssets,
					scannedAssets,
					{
						audio: ["path/to"],
						image: ["path/to"],
						script: ["path/to"],
						text: ["path/to"]
					},
					AssetModule.createDefaultMergeCustomizer()
				)
			).toEqual([
				{
					type: "audio",
					path: "path/to/already_exists",
					duration: 340,
					systemId: "music",
					global: true
				},
				{
					type: "image",
					path: "path/to/already_exists.png",
					width: 100,
					height: 200,
					hint: {
						untainted: true
					}
				},
				{
					type: "script",
					path: "path/to/already_exists.js",
					global: true
				},
				{
					type: "text",
					path: "path/to/already_exists.txt",
					global: true
				},
				{
					type: "audio",
					path: "path/to/new_one",
					duration: 1234,
					systemId: "sound",
					global: true
				},
				{
					type: "image",
					path: "path/to/new_one.png",
					width: 500,
					height: 600
				},
				{
					type: "script",
					path: "path/to/new_one.js",
					global: true
				},
				{
					type: "text",
					path: "path/to/new_one.txt"
				}
			]);
		});

		it("merge audio assets", () => {
			expect(
				AssetModule.merge(
					definedAssets,
					scannedAssets,
					{
						audio: ["path/to"],
						image: [],
						script: [],
						text: []
					},
					AssetModule.createDefaultMergeCustomizer()
				)
			).toEqual([
				{
					type: "audio",
					path: "path/to/already_exists",
					duration: 340,
					systemId: "music",
					global: true
				},
				{
					type: "image",
					path: "path/to/already_exists.png",
					width: 100,
					height: 200,
					hint: {
						untainted: true
					}
				},
				{
					type: "image",
					path: "path/to/not_exists.png",
					width: 300,
					height: 400
				},
				{
					type: "script",
					path: "path/to/already_exists.js",
					global: true
				},
				{
					type: "script",
					path: "path/to/not_exists.js",
					global: true
				},
				{
					type: "text",
					path: "path/to/already_exists.txt",
					global: true
				},
				{
					type: "text",
					path: "path/to/not_exists.txt",
					global: true
				},
				{
					type: "audio",
					path: "path/to/new_one",
					duration: 1234,
					systemId: "sound",
					global: true
				},
				{
					type: "image",
					path: "path/to/new_one.png",
					width: 500,
					height: 600
				},
				{
					type: "script",
					path: "path/to/new_one.js",
					global: true
				},
				{
					type: "text",
					path: "path/to/new_one.txt"
				}
			]);
		});

		it("merge image assets", () => {
			expect(
				AssetModule.merge(
					definedAssets,
					scannedAssets,
					{
						audio: [],
						image: ["path/to"],
						script: [],
						text: []
					},
					AssetModule.createDefaultMergeCustomizer()
				)
			).toEqual([
				{
					type: "audio",
					path: "path/to/already_exists",
					duration: 340,
					systemId: "music",
					global: true
				},
				{
					type: "audio",
					path: "path/to/not_exists",
					duration: 560,
					systemId: "sound"
				},
				{
					type: "image",
					path: "path/to/already_exists.png",
					width: 100,
					height: 200,
					hint: {
						untainted: true
					}
				},
				{
					type: "script",
					path: "path/to/already_exists.js",
					global: true
				},
				{
					type: "script",
					path: "path/to/not_exists.js",
					global: true
				},
				{
					type: "text",
					path: "path/to/already_exists.txt",
					global: true
				},
				{
					type: "text",
					path: "path/to/not_exists.txt",
					global: true
				},
				{
					type: "audio",
					path: "path/to/new_one",
					duration: 1234,
					systemId: "sound",
					global: true
				},
				{
					type: "image",
					path: "path/to/new_one.png",
					width: 500,
					height: 600
				},
				{
					type: "script",
					path: "path/to/new_one.js",
					global: true
				},
				{
					type: "text",
					path: "path/to/new_one.txt"
				}
			]);
		});

		it("merge script assets", () => {
			expect(
				AssetModule.merge(
					definedAssets,
					scannedAssets,
					{
						audio: [],
						image: [],
						script: ["path/to"],
						text: []
					},
					AssetModule.createDefaultMergeCustomizer()
				)
			).toEqual([
				{
					type: "audio",
					path: "path/to/already_exists",
					duration: 340,
					systemId: "music",
					global: true
				},
				{
					type: "audio",
					path: "path/to/not_exists",
					duration: 560,
					systemId: "sound"
				},
				{
					type: "image",
					path: "path/to/already_exists.png",
					width: 100,
					height: 200,
					hint: {
						untainted: true
					}
				},
				{
					type: "image",
					path: "path/to/not_exists.png",
					width: 300,
					height: 400
				},
				{
					type: "script",
					path: "path/to/already_exists.js",
					global: true
				},
				{
					type: "text",
					path: "path/to/already_exists.txt",
					global: true
				},
				{
					type: "text",
					path: "path/to/not_exists.txt",
					global: true
				},
				{
					type: "audio",
					path: "path/to/new_one",
					duration: 1234,
					systemId: "sound",
					global: true
				},
				{
					type: "image",
					path: "path/to/new_one.png",
					width: 500,
					height: 600
				},
				{
					type: "script",
					path: "path/to/new_one.js",
					global: true
				},
				{
					type: "text",
					path: "path/to/new_one.txt"
				}
			]);
		});

		it("merge text assets", () => {
			expect(
				AssetModule.merge(
					definedAssets,
					scannedAssets,
					{
						audio: [],
						image: [],
						script: [],
						text: ["path/to"]
					},
					AssetModule.createDefaultMergeCustomizer()
				)
			).toEqual([
				{
					type: "audio",
					path: "path/to/already_exists",
					duration: 340,
					systemId: "music",
					global: true
				},
				{
					type: "audio",
					path: "path/to/not_exists",
					duration: 560,
					systemId: "sound"
				},
				{
					type: "image",
					path: "path/to/already_exists.png",
					width: 100,
					height: 200,
					hint: {
						untainted: true
					}
				},
				{
					type: "image",
					path: "path/to/not_exists.png",
					width: 300,
					height: 400
				},
				{
					type: "script",
					path: "path/to/already_exists.js",
					global: true
				},
				{
					type: "script",
					path: "path/to/not_exists.js",
					global: true
				},
				{
					type: "text",
					path: "path/to/already_exists.txt",
					global: true
				},
				{
					type: "audio",
					path: "path/to/new_one",
					duration: 1234,
					systemId: "sound",
					global: true
				},
				{
					type: "image",
					path: "path/to/new_one.png",
					width: 500,
					height: 600
				},
				{
					type: "script",
					path: "path/to/new_one.js",
					global: true
				},
				{
					type: "text",
					path: "path/to/new_one.txt"
				}
			]);
		});

		it("merge audio assets with update hint.extensions", () => {
			const definedAssets: AssetConfiguration[] = [
				{
					type: "audio",
					path: "path/to/music1",
					duration: 340,
					systemId: "music",
					hint: {
						extensions: [".ogg", ".m4a"]
					}
				},
				{
					type: "audio",
					path: "path/to/music2",
					duration: 340,
					systemId: "music",
					hint: {
						extensions: [".ogg", ".m4a"],
						streaming: true
					}
				}
			];
			const scannedAssets: AssetConfiguration[] = [
				{
					type: "audio",
					path: "path/to/music1",
					duration: 340,
					systemId: "music",
					hint: {
						extensions: [".ogg"]
					}
				},
				{
					type: "audio",
					path: "path/to/music2",
					duration: 340,
					systemId: "music",
					hint: {
						extensions: [".m4a"]
					}
				}
			];
			expect(
				AssetModule.merge(
					definedAssets,
					scannedAssets,
					{
						audio: ["path/to"],
						image: [],
						script: [],
						text: []
					},
					AssetModule.createDefaultMergeCustomizer()
				)
			).toEqual([
				{
					type: "audio",
					path: "path/to/music1",
					duration: 340,
					systemId: "music",
					hint: {
						extensions: [".ogg"]
					}
				},
				{
					type: "audio",
					path: "path/to/music2",
					duration: 340,
					systemId: "music",
					hint: {
						extensions: [".m4a"],
						streaming: true
					}
				}
			]);
		});

	});
});
