import * as fs from "fs";
import * as path from "path";
import * as puppeteer from "puppeteer";
import * as resemble from "resemblejs";

describe("speed-jigsaw", () => {
	const targetUrl = "http://localhost:" + process.env.SERVE_PORT + "/public/index.html?playerId=test";
	const screenshotDir = path.join(__dirname, "..", "..", "screenshot");
	const outputDir = path.join(__dirname, "..", "..", "result");
	const screenshotDiffThreshold = 0.1; // 予め用意しているスクリーンショットと画像を比較する時diffをどこまで許容するかの値
	const screenshotDiffThresholdForGameScene = 0.5; // 残り時間やスコアが多少異なることがあるのでゲームシーンでは許容するdiffを多めにする
	const waitingRendering = 1000;
	const waitingLoadingGame = 2000;
	const waitingRuleScene = 5000;
	const waitingGameScene = 10000;
	const assertScreenshot = async (targetPath: string, outputPath: string, threshold: number = screenshotDiffThreshold) => {
		const current = await page.screenshot({fullPage: true});
		const expected: any = fs.readFileSync(targetPath);
		let misMatchPercentage = 0;
		await resemble(current).compareTo(expected)
			.onComplete((data: any) => {
				misMatchPercentage = parseFloat(data.misMatchPercentage);
				fs.writeFileSync(outputPath, data.getBuffer());
			});
		expect(misMatchPercentage).toBeLessThan(threshold);
	};
	let browser: any;
	let page: any;

	beforeAll(async () => {
		browser = await puppeteer.launch();
	});

	beforeEach(async () => {
		page = await browser.newPage();
	});

	afterEach(async () => {
		await page.close();
	});

	afterAll(async () => {
		await browser.close();
	});

	it("can be played", async () => {
		await page.goto(targetUrl);
		await page.waitFor(".material-icons");
		let icons: any[] = await page.$$(".material-icons");
		await icons[0].click(); // Play新規作成ボタンでリセット
		await page.waitFor("canvas");
		await page.waitFor(waitingLoadingGame);

		// タイトル画面に遷移したか
		await assertScreenshot(
			path.join(screenshotDir, "title_scene.png"),
			path.join(outputDir, "title_scene.png")
		);

		// ルール説明画面に遷移したか
		await page.waitFor(waitingRuleScene);
		await assertScreenshot(
			path.join(screenshotDir, "rule_scene.png"),
			path.join(outputDir, "rule_scene.png")
		);

		// ゲーム画面に遷移したか
		await page.waitFor(waitingGameScene);
		await assertScreenshot(
			path.join(screenshotDir, "game_scene.png"),
			path.join(outputDir, "game_scene.png"),
			screenshotDiffThresholdForGameScene
		);

		// ゲーム画面の描画が変わったか
		const canvasElem = await page.$("canvas");
		const canvasRect = await canvasElem.boundingBox();
		await page.mouse.click(canvasRect.x + 500, canvasRect.y + 200); // パネルを選択
		await page.mouse.click(canvasRect.x + 100, canvasRect.y + 100); // パネルを1つだけセット
		await page.waitFor(waitingRendering);
		await assertScreenshot(
			path.join(screenshotDir, "game_scene_one_click.png"),
			path.join(outputDir, "game_scene_one_click.png"),
			screenshotDiffThresholdForGameScene
		);

		// 次の絵に遷移したか
		await page.mouse.click(canvasRect.x + 300, canvasRect.y + 100);
		await page.waitFor(waitingRendering);
		await page.mouse.click(canvasRect.x + 300, canvasRect.y + 300);
		await page.waitFor(waitingRendering);
		await page.mouse.click(canvasRect.x + 100, canvasRect.y + 300);
		await page.waitFor(waitingRendering * 3); // 絵完成時のエフェクト描画が若干長いので長めに待つ
		await assertScreenshot(
			path.join(screenshotDir, "game_scene_next.png"),
			path.join(outputDir, "game_scene_next.png"),
			screenshotDiffThresholdForGameScene
		);
	});
});
