import * as path from "path";
import { GameContext } from "@akashic/headless-akashic";

describe("mainScene", () => {
	it("ゲームが正常に動作できる", async () => {
		const context = new GameContext({
			gameJsonPath: path.join(__dirname, "..", "game.json")
		});
		const client = await context.getGameClient();

		expect(client.type).toBe("active");

		const game = client.game!;
		expect(game.width).toBe(1280);
		expect(game.height).toBe(720);
		expect(game.fps).toBe(30);

		await client.advanceUntil(() => game.scene()!.local !== "full-local"); // ローカル(ローディング)シーンを抜けるまで進める

		const scene = client.game.scene()!;

		expect(scene).toBeDefined();

		// ここでゲーム毎の内容を確認する。
		// player, shot, se のアセットが読み込まれていることを確認
		expect(Object.keys(scene.assets).length).toBe(3);
		expect(scene.children.length).toBe(1);

		// ゲーム画面をクリックすると弾 (g.Sprite) が生成されることを確認
		client.sendPointDown(Math.ceil(Math.random() * game.width), Math.ceil(Math.random() * game.height), 0);
		await context.step();
		expect(scene.children.length).toBe(2);

		client.sendPointDown(Math.ceil(Math.random() * game.width), Math.ceil(Math.random() * game.height), 0);
		await context.step();
		expect(scene.children.length).toBe(3);

		// 時間が十分に経ったらすべての弾が消えていることを確認
		await context.advance(3000);
		expect(scene.children.length).toBe(1);

		await context.destroy();
	});
});
