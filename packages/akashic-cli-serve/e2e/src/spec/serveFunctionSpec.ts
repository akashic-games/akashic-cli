import * as fs from "fs";
import * as path from "path";
import * as puppeteer from "puppeteer";
import * as resemble from "resemblejs";

describe("cli-serve", () => {
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

	it("create new play", async () => {
		await page.goto(targetUrl);
		await page.waitFor(".material-icons");
		let icons: any[] = await page.$$(".material-icons");
		await icons[0].click(); // Play新規作成ボタンでリセット
		await page.waitFor("canvas");
		await page.waitFor(waitingLoadingGame); // ゲームの起動を待つ
		await assertScreenshot(
			path.join(screenshotDir, "title_scene.png"),
			path.join(outputDir, "create_new_play.png")
		);
	});

	it("pause active instance", async () => {
		await page.goto(targetUrl);
		await page.waitFor(".material-icons");
		let icons: any[] = await page.$$(".material-icons");
		await icons[0].click(); // Play新規作成ボタンでリセット
		await page.waitFor("canvas");
		await page.waitFor(waitingLoadingGame + waitingRuleScene + waitingGameScene); // ゲーム画面に遷移するまで待つ

		icons = await page.$$(".material-icons");
		await icons[1].click(); // アクティブインスタンス停止ボタンをクリック
		const canvasElem = await page.$("canvas");
		const canvasRect = await canvasElem.boundingBox();
		page.mouse.click(canvasRect.x + 500, canvasRect.y + 200); // パネルを選択
		page.mouse.click(canvasRect.x + 100, canvasRect.y + 100); // パネルを1つだけセット
		await page.waitFor(waitingRendering); // click動作がゲーム側に反映されるまで少し長めに待つ
		await assertScreenshot(
			path.join(screenshotDir, "game_scene.png"),
			path.join(outputDir, "pause_active_instance.png"),
			screenshotDiffThresholdForGameScene
		);

		icons = await page.$$(".material-icons");
		await icons[1].click(); // アクティブインスタンス再開ボタンをクリック
		await page.waitFor(waitingRendering); // click動作がゲーム側に反映されるまで少し長めに待つ
		await assertScreenshot(
			path.join(screenshotDir, "game_scene_one_click.png"),
			path.join(outputDir, "resume_active_instance.png"),
			screenshotDiffThresholdForGameScene
		);
	});
});
