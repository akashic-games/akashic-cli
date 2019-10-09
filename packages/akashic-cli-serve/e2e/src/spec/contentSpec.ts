import * as fs from "fs";
import * as path from "path";
import * as puppeteer from "puppeteer";
import * as resemble from "resemblejs";

describe("sample_content", () => {
	const targetUrl = "http://localhost:" + process.env.SERVE_PORT + "/public/index.html?playerId=test";
	const screenshotDir = path.join(__dirname, "..", "..", "result", "base");
	const screenshotDiffThreshold = 0.1;
	const waitingLoading = 2000;
	const waitingRendering = 500;
	let browser: any;
	let page: any;
	let allow: any;
	let awaiting: Promise<void>;

	beforeAll(async () => {
		browser = await puppeteer.launch();
	});

	beforeEach(async () => {
		page = await browser.newPage();
		await page.exposeFunction("completeToStartup", () => {
			if (allow) {
				allow();
			}
		});
		awaiting = new Promise((resolve) => { allow = resolve; });
	});

	afterEach(async () => {
		await page.close();
	});

	afterAll(async () => {
		await browser.close();
	});

	it("start content", async () => {
		await page.goto(targetUrl);
		await awaiting;
		let icons: any[] = await page.$$(".material-icons");
		await icons[0].click(); // Play新規作成ボタンでリセット
		await page.waitFor(waitingLoading); // ゲームの起動を待つ

		const current = await page.screenshot({fullPage: true});
		const expected: any = fs.readFileSync(path.join(screenshotDir, "game_start.png"));
		let misMatchPercentage = 0;
		await resemble(current).compareTo(expected)
			.onComplete((data: any) => {
				misMatchPercentage = parseFloat(data.misMatchPercentage);
				fs.writeFileSync(path.join(__dirname, "..", "..", "result", "diff", "start_content.png"), data.getBuffer());
			});
		expect(misMatchPercentage).toBeLessThan(screenshotDiffThreshold);
	});

	it("click in content", async () => {
		await page.goto(targetUrl);
		await awaiting;
		let icons: any[] = await page.$$(".material-icons");
		await icons[0].click(); // Play新規作成ボタンでリセット
		await page.waitFor(waitingLoading); // ゲームの起動を待つ

		await page.click("canvas");
		await page.waitFor(waitingRendering); // click動作がゲーム側に反映されるまで少し長めに待つ
		const current = await page.screenshot({fullPage: true});
		const expected: any = fs.readFileSync(path.join(screenshotDir, "one_click.png"));
		let misMatchPercentage = 0;
		await resemble(current).compareTo(expected)
			.onComplete((data: any) => {
				misMatchPercentage = parseFloat(data.misMatchPercentage);
				fs.writeFileSync(path.join(__dirname, "..", "..", "result", "diff", "click_in_content.png"), data.getBuffer());
			});
		expect(misMatchPercentage).toBeLessThan(screenshotDiffThreshold);
	});
});
