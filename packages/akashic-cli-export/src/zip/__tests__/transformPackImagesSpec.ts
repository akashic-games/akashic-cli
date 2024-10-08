import * as path from "path";
import { makeUnixPath } from "@akashic/akashic-cli-commons/lib/Util.js";
import * as fs from "fs-extra";
import { extractPackTargets, transformPackSmallImagesImpl } from "../transformPackImages.js";

describe("transformPackImages", () => {
	describe("extractPackTargets()", () => {
		it("extracts targets from image assets", () => {
			const targets = extractPackTargets(
				{
					width: 32,
					height: 32,
					main: "main.js",
					assets: {
						"imageA": { type: "image", path: "image/imageA.png", width: 10, height: 20, global: true },
						"imageB": { type: "image", path: "assets/imageB.png", width: 30, height: 50, },
						"large": { type: "image", path: "image/large.png", width: 1000, height: 1000, },
						"se": { type: "audio", path: "audio/se", duration: 100, systemId: "sound"},
						"main": { type: "script", path: "script/main.js", global: true },
					}
				},
				100,
				200,
			);

			expect(targets).toEqual(expect.arrayContaining([
				{
					name: "image/imageA.png",
					width: 10,
					height: 20,
					data: { assetIds: ["imageA"], path: "image/imageA.png" }
				},
				{
					name: "assets/imageB.png",
					width: 30,
					height: 50,
					data: { assetIds: ["imageB"], path: "assets/imageB.png" }
				}
			]));
		});

		it("handles assets that have a same path", () => {
			const targets = extractPackTargets(
				{
					width: 32,
					height: 32,
					main: "main.js",
					assets: {
						"imageA": { type: "image", path: "image/imageA.png", width: 10, height: 20, global: true },
						"imageA2": { type: "image", path: "image/imageA.png", width: 10, height: 20 },
						"main": { type: "script", path: "script/main.js", global: true },
					}
				},
				100,
				200,
			);

			expect(targets).toEqual(expect.arrayContaining([
				{
					name: "image/imageA.png",
					width: 10,
					height: 20,
					data: { assetIds: ["imageA", "imageA2"], path: "image/imageA.png" }
				}
			]));
		});
	});

	describe("packSmallImages()", () => {
		it("can pack images of game_few_images", async () => {
			const fixtureDir = path.resolve(__dirname, "..", "..", "__tests__", "fixtures", "game_few_images");
			const gamejson = JSON.parse(fs.readFileSync(path.join(fixtureDir, "game.json"), "utf8")); // 破壊されるのでrequire()は利用できない
			const { outputs, discardables } = await transformPackSmallImagesImpl(gamejson, fixtureDir);

			const relDiscardables = discardables.map(p => makeUnixPath(path.relative(fixtureDir, p)));
			expect(relDiscardables.length).toBe(3);
			expect(relDiscardables).toEqual(expect.arrayContaining([
				"image/149x101.png",
				"image/94x73.png",
				"assets/112x69.png"
			]));

			// 全ての pack 元画像 (discardables) には、それを virtualPath に持つアセット定義が存在し、slice 指定を持つ。
			// (一つの pack 元画像を参照する全てのアセット定義に最初から virtualPath が指定されていた場合成り立たないが、このコンテンツは該当しない)
			expect(outputs.length).toBe(1);
			const output = outputs[0];
			const relOutputPath = makeUnixPath(path.relative(fixtureDir, output.path));
			relDiscardables.forEach(p => {
				const aid = Object.keys(gamejson.assets).find(aid => gamejson.assets[aid].virtualPath === p);
				expect(aid).toBeTruthy();
				const decl = gamejson.assets[aid];
				expect(decl.type).toBe("image");
				expect(decl.path).toBe(relOutputPath);
				expect(decl.width).toBe(output.width);
				expect(decl.height).toBe(output.height);
				expect(Array.isArray(decl.slice)).toBe(true);
				expect(decl.slice.length).toBe(4);
			});

			expect(output.content).toEqual(fs.readFileSync(path.join(fixtureDir, "_expected_packed", "aez_packed_image.png")));
		});

		it("can pack images of niconicoSnake", async () => {
			const fixtureDir = path.resolve(__dirname, "..", "..", "__tests__", "fixtures", "niconicoSnake");
			const gamejson = JSON.parse(fs.readFileSync(path.join(fixtureDir, "game.json"), "utf8")); // 破壊されるのでrequire()は利用できない
			const { outputs, discardables } = await transformPackSmallImagesImpl(gamejson, fixtureDir);

			const relDiscardables = discardables.map(p => makeUnixPath(path.relative(fixtureDir, p)));
			expect(relDiscardables.length).toBe(70);
			expect(relDiscardables).toEqual(expect.arrayContaining([
				"image/ResultScene/result_base_treasure.png",
				"image/MainGameScene/Font/main_num_time_r.png",
				"image/MainGameScene/Font/main_num_time_c.png",
				"image/MainGameScene/field_base.png",
				"image/ResultScene/result_num_r.png",
				"image/ResultScene/result_num_b.png",
				"image/MainGameScene/UI/main_base_length.png",
				"image/MainGameScene/UI/main_base_kill.png",
				"image/MainGameScene/UI/main_map_base.png",
				"image/MainGameScene/UI/main_rpop_head_jewel.png",
				"image/MainGameScene/UI/main_base_time.png",
				"image/MainGameScene/UI/main_rank_host.png",
				"image/MainGameScene/UI/main_rank_you.png",
				"image/MainGameScene/UI/main_jewel_pop.png",
				"image/MainGameScene/Font/main_num_score.png",
				"image/MainGameScene/main_dash_eff.png",
				"image/MainGameScene/UI/main_btn_rank_on_diff.png",
				"image/MainGameScene/UI/main_btn_rank_on.png",
				"image/MainGameScene/UI/main_btn_rank_off_diff.png",
				"image/MainGameScene/UI/main_btn_rank_off.png",
				"image/TitleScene/btn_frame_join_disable.png",
				"image/TitleScene/btn_frame_join.png",
				"image/MainGameScene/UI/red_rpop_head_chance.png",
				"image/MainGameScene/UI/main_rpop_head_kill.png",
				"image/MainGameScene/UI/main_dash_base.png",
				"image/MainGameScene/UI/main_btn_spawn_unable.png",
				"image/MainGameScene/UI/main_btn_spawn_on_angel.png",
				"image/MainGameScene/UI/main_btn_spawn_on.png",
				"image/MainGameScene/UI/main_btn_spawn_off_angel.png",
				"image/MainGameScene/UI/main_btn_spawn_off.png",
				"image/ResultScene/result_btn_next_on.png",
				"image/ResultScene/result_btn_next_off_unable.png",
				"image/ResultScene/result_btn_next_off.png",
				"image/ResultScene/result_btn_back_on.png",
				"image/ResultScene/result_btn_back_off_unable.png",
				"image/ResultScene/result_btn_back_off.png",
				"image/MainGameScene/snake_reborn_text.png",
				"image/MainGameScene/Snake/snakeI_head_gold.png",
				"image/MainGameScene/Snake/snakeI_head_death.png",
				"image/MainGameScene/Snake/snakeI_head_alive.png",
				"image/MainGameScene/Snake/snakeH_head_gold.png",
				"image/MainGameScene/Snake/snakeH_head_death.png",
				"image/MainGameScene/Snake/snakeH_head_alive.png",
				"image/MainGameScene/Snake/snakeG_head_gold.png",
				"image/MainGameScene/Snake/snakeG_head_death.png",
				"image/MainGameScene/Snake/snakeG_head_alive.png",
				"image/MainGameScene/Snake/snakeF_head_gold.png",
				"image/MainGameScene/Snake/snakeF_head_death.png",
				"image/MainGameScene/Snake/snakeF_head_alive.png",
				"image/MainGameScene/Snake/snakeE_head_gold.png",
				"image/MainGameScene/main_jewel_body.png",
				"image/MainGameScene/main_feed.png",
				"image/MainGameScene/UI/main_rank_5.png",
				"image/MainGameScene/UI/main_rank_4.png",
				"image/MainGameScene/UI/main_rank_3.png",
				"image/MainGameScene/UI/main_rank_2.png",
				"image/MainGameScene/UI/main_rank_1.png",
				"image/TitleScene/frame_howto.png",
				"image/MainGameScene/UI/red_rpop_tail.png",
				"image/MainGameScene/UI/red_rpop_body.png",
				"image/MainGameScene/UI/main_rpop_tail.png",
				"image/MainGameScene/UI/main_rpop_body.png",
				"image/ResultScene/result_unit_ji_r.png",
				"image/ResultScene/result_unit_ji_b.png",
				"image/ResultScene/result_unit_i_r.png",
				"image/ResultScene/result_unit_i_b.png",
				"image/MainGameScene/UI/main_dash_gauge1.png",
				"image/MainGameScene/UI/main_map_you.png",
				"image/MainGameScene/UI/main_map_jewel.png",
				"image/MainGameScene/UI/main_map_feed.png"
			]));

			// 全ての pack 元画像 (discardables) には、それを virtualPath に持つアセット定義が存在し、slice 指定を持つ。
			// (一つの pack 元画像を参照する全てのアセット定義に最初から virtualPath が指定されていた場合成り立たないが、このコンテンツは該当しない)
			expect(outputs.length).toBe(1);
			const output = outputs[0];
			const relOutputPath = makeUnixPath(path.relative(fixtureDir, output.path));
			const assetKeys = Object.keys(gamejson.assets);
			relDiscardables.forEach(p => {
				const aid = assetKeys.find(aid => gamejson.assets[aid].virtualPath === p);
				expect(aid).toBeTruthy();
				const decl = gamejson.assets[aid];
				expect(decl.type).toBe("image");
				expect(decl.path).toBe(relOutputPath);
				expect(decl.width).toBe(output.width);
				expect(decl.height).toBe(output.height);
				expect(Array.isArray(decl.slice)).toBe(true);
				expect(decl.slice.length).toBe(4);
			});

			expect(output.content).toEqual(fs.readFileSync(path.join(fixtureDir, "_expected_packed", "aez_packed_image.png")));
		}, 20000);

		it("can pack for game_shared_image", async () => {
			const fixtureDir = path.resolve(__dirname, "..", "..", "__tests__", "fixtures", "game_shared_image");
			const gamejson = JSON.parse(fs.readFileSync(path.join(fixtureDir, "game.json"), "utf8")); // 破壊されるのでrequire()は利用できない
			const { outputs, discardables } = await transformPackSmallImagesImpl(gamejson, fixtureDir);

			const relDiscardables = discardables.map(p => makeUnixPath(path.relative(fixtureDir, p)));
			expect(relDiscardables.length).toBe(2);
			expect(relDiscardables).toEqual(expect.arrayContaining([
				"image/94x73.png",
				"assets/112x69.png"
			]));

			// 全ての pack 元画像 (discardables) には、それを virtualPath に持つアセット定義が存在し、slice 指定を持つ。
			// (一つの pack 元画像を参照する全てのアセット定義に最初から virtualPath が指定されていた場合成り立たないが、このコンテンツは該当しない)
			expect(outputs.length).toBe(1);
			const output = outputs[0];
			const relOutputPath = makeUnixPath(path.relative(fixtureDir, output.path));
			relDiscardables.forEach(p => {
				const aid = Object.keys(gamejson.assets).find(aid => gamejson.assets[aid].virtualPath === p);
				expect(aid).toBeTruthy();
				const decl = gamejson.assets[aid];
				expect(decl.type).toBe("image");
				expect(decl.path).toBe(relOutputPath);
				expect(decl.width).toBe(output.width);
				expect(decl.height).toBe(output.height);
				expect(Array.isArray(decl.slice)).toBe(true);
				expect(decl.slice.length).toBe(4);
			});

			// このコンテンツには「path を共有する複数の画像アセット」があり、それがパッキング対象になっている。
			// ここでは「パッキング結果に同じ画像が複数入り込んでいない」ことを確認済みの画像ファイルとの一致をテストしている。
			expect(output.content).toEqual(fs.readFileSync(path.join(fixtureDir, "_expected_packed", "aez_packed_image.png")));
		});

		it("does nothing for game_unpackable_images", async () => {
			// game_unpackable_images: 1000x1000 の画像を二つ含むコンテンツ。 1024x1024 上限ではパッキングできない (してもファイルが減らない)。
			const fixtureDir = path.resolve(__dirname, "..", "..", "__tests__", "fixtures", "game_unpackable_images");
			const gamejson = JSON.parse(fs.readFileSync(path.join(fixtureDir, "game.json"), "utf8"));
			const { outputs, discardables } = await transformPackSmallImagesImpl(gamejson, fixtureDir);
			expect(outputs.length).toBe(0);
			expect(discardables.length).toBe(0);
		});

		it("does nothing for game_too_large_images", async () => {
			// game_too_large_images: 1400x100, 100x1400 の画像を含むコンテンツ。 1024x1024 上限ではパッキングできない (一つも入らない)。
			const fixtureDir = path.resolve(__dirname, "..", "..", "__tests__", "fixtures", "game_too_large_images");
			const gamejson = JSON.parse(fs.readFileSync(path.join(fixtureDir, "game.json"), "utf8"));
			const { outputs, discardables } = await transformPackSmallImagesImpl(gamejson, fixtureDir);
			expect(outputs.length).toBe(0);
			expect(discardables.length).toBe(0);
		});

		it("does nothing for v2 game", async () => {
			// v3 の slice 指定を使うので v2 以前は非サポート。
			const fixtureDir = path.resolve(__dirname, "..", "..", "__tests__", "fixtures", "sample_game_v2");
			const gamejson = JSON.parse(fs.readFileSync(path.join(fixtureDir, "game.json"), "utf8"));
			const { outputs, discardables } = await transformPackSmallImagesImpl(gamejson, fixtureDir);
			expect(outputs.length).toBe(0);
			expect(discardables.length).toBe(0);
		});
	});
});
