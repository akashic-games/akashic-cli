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

		await client.advanceUntil(() => game.scene().local !== "full-local"); // ローカル(ローディング)シーンを抜けるまで進める

		const scene = client.game.scene()!;
		expect(scene).toBeDefined();

		// ここでゲーム毎の内容を確認する。
		expect(scene.children.length).toBe(1);
		// 初期状態で子要素(g.FilledRect) の x 座標は 0
		expect(scene.children[0].x).toBe(0);
		context.step();
		// 1 フレーム進んだ時、子要素(g.FilledRect) の x 座標が 1 進んでいることを確認
		expect(scene.children[0].x).toBe(1);

		// ゲーム画面幅を子要素(g.FilledRect) の x 座標が超えた場合、x 座標が 0 に戻ることを確認
		await context.advance(42630);
		expect(scene.children[0].x).toBe(game.width);

		context.step();
		expect(scene.children[0].x).toBe(0);

		await context.destroy();
	});
});
