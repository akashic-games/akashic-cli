import * as fs from "fs";
import * as path from "path";
import * as puppeteer from "puppeteer";
import * as resemble from "resemblejs";

describe("sample_content", () => {
	const screenshotDir = path.join(__dirname, "..",  "..", "fixtures", "sample_content", "screenshot");
	const screenshotDiffThreshold = 0.1;
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

	it("start content", async () => {
		await page.goto("http://localhost:5000/public/index.html");
		await page.waitForSelector("canvas");
		await page.waitFor(500);
		const current = await page.screenshot({fullPage: true});
		const expected: any = fs.readFileSync(path.join(screenshotDir, "game_start.png"));
		let misMatchPercentage = 0;
		await resemble(current).compareTo(expected)
			.onComplete((data: any) => {
				misMatchPercentage = parseFloat(data.misMatchPercentage);
			});
		expect(misMatchPercentage).toBeLessThan(screenshotDiffThreshold);
	});

	it("click in content", async () => {
		await page.goto("http://localhost:5001/public/index.html");
		await page.waitForSelector("canvas");
		await page.waitFor(500);
		await page.click("canvas");
		const current = await page.screenshot({fullPage: true});
		const expected: any = fs.readFileSync(path.join(screenshotDir, "one_click.png"));
		let misMatchPercentage = 0;
		await resemble(current).compareTo(expected)
			.onComplete((data: any) => {
				misMatchPercentage = parseFloat(data.misMatchPercentage);
			});
		expect(misMatchPercentage).toBeLessThan(screenshotDiffThreshold);
	});
});
