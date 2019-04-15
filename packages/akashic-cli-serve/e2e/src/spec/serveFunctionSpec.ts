import * as fs from "fs";
import * as path from "path";
import * as puppeteer from "puppeteer";
import * as resemble from "resemblejs";

describe("cli-serve", () => {
	const screenshotDir = path.join(__dirname, "..",  "..", "fixtures", "sample_content", "screenshot");
	const screenshotDiffThreshold = 0.15;
	let browser: any;
	let page: any;
	beforeAll(async () => {
		browser = await puppeteer.launch();
		page = await browser.newPage();
	});

	afterAll(async () => {
		await page.close();
		await browser.close();
	});

	it("create new play", async () => {
		await page.goto("http://localhost:5010/public/index.html");
		await page.waitForSelector("canvas");
		await page.waitFor(500);
		await page.click("canvas");
		let icons: any[] = await page.$$(".material-icons");
		await icons[0].click(); // Play新規作成ボタンでリセット
		await page.waitForSelector("canvas");
		await page.waitFor(1500);
		const current = await page.screenshot({fullPage: true});
		const expected: any = fs.readFileSync(path.join(screenshotDir, "game_start.png"));
		let misMatchPercentage = 0;
		await resemble(current).compareTo(expected)
			.onComplete((data: any) => {
				misMatchPercentage = parseFloat(data.misMatchPercentage);
			});
		expect(misMatchPercentage).toBeLessThan(screenshotDiffThreshold);
	});

	it("pause active instance", async () => {
		await page.goto("http://localhost:5011/public/index.html");
		await page.waitForSelector("canvas");
		await page.waitFor(500);
		let icons: any[] = await page.$$(".material-icons");
		await icons[1].click(); // アクティブインスタンス停止ボタンをクリック
		await page.click("canvas");
		const current = await page.screenshot({fullPage: true});
		const expected: any = fs.readFileSync(path.join(screenshotDir, "game_start.png"));
		let misMatchPercentage = 0;
		await resemble(current).compareTo(expected)
			.onComplete((data: any) => {
				misMatchPercentage = parseFloat(data.misMatchPercentage);
			});
		expect(misMatchPercentage).toBeLessThan(screenshotDiffThreshold);
	});

	it("join to content", async () => {
		await page.goto("http://localhost:5012/public/index.html");
		await page.waitForSelector("canvas");
		await page.waitFor(500);
		let icons: any[] = await page.$$(".material-icons");
		await icons[3].click(); // joinボタンをクリック
		await page.waitFor(100);
		let current = await page.screenshot({fullPage: true});
		let expected: any = fs.readFileSync(path.join(screenshotDir, "join.png"));
		let misMatchPercentage = 0;
		await resemble(current).compareTo(expected)
			.onComplete((data: any) => {
				misMatchPercentage = parseFloat(data.misMatchPercentage);
			});
		expect(misMatchPercentage).toBeLessThan(screenshotDiffThreshold);
	});

	it("leave from content", async () => {
		await page.goto("http://localhost:5013/public/index.html");
		await page.waitForSelector("canvas");
		await page.waitFor(500);
		let icons: any[] = await page.$$(".material-icons");
		await icons[3].click(); // joinボタンをクリック
		await icons[3].click(); // joinボタンクリック後leaveボタンをクリック
		let current = await page.screenshot({fullPage: true});
		let expected: any = fs.readFileSync(path.join(screenshotDir, "game_start.png"));
		let misMatchPercentage = 0;
		await resemble(current).compareTo(expected)
			.onComplete((data: any) => {
				misMatchPercentage = parseFloat(data.misMatchPercentage);
			});
		expect(misMatchPercentage).toBeLessThan(screenshotDiffThreshold);
	});
});
