import * as path from "path";
import * as g from "@akashic/akashic-engine";
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

		// player, shot, se のアセットが読み込まれていることを確認
		expect(Object.keys(scene.assets).length).toBe(3);
		expect(scene.children.length).toBe(3);

		// 初期スコア、時間の値を確認
		context.step();
		const scoreLabel = scene.children[1] as g.Label;
		expect(scoreLabel.text).toBe("SCORE: 0");

		const timeLabel = scene.children[2] as g.Label;
		expect(timeLabel.text).toBe("TIME: 60");

		// ゲーム画面をクリックすると弾 (g.Sprite) が生成されることを確認
		client.sendPointDown(Math.ceil(Math.random() * game.width), Math.ceil(Math.random() * game.height), 0);
		context.step();
		expect(scene.children.length).toBe(4);

		client.sendPointDown(Math.ceil(Math.random() * game.width), Math.ceil(Math.random() * game.height), 0);
		context.step();
		expect(scene.children.length).toBe(5);

		// 2 回クリックされた時のスコアの値を確認
		expect(scoreLabel.text).toBe("SCORE: 2");

		// 時間が十分に経ったらすべての弾が消えていることを確認
		await context.advance(3000);
		expect(scene.children.length).toBe(3);

		// 制限時間がなくなった時の時間表示を確認
		await context.advance(60000);
		expect(timeLabel.text).toBe("TIME: 0");

		await context.destroy();
	});
});
