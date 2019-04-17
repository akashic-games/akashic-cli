import * as fs from "fs";
import * as path from "path";
import * as puppeteer from "puppeteer";
import * as resemble from "resemblejs";
import {execSync} from "child_process";

describe("sample_content", () => {
	const screenshotDir = path.join(__dirname, "..",  "..", "fixtures", "sample_content", "screenshot");
	const screenshotDiffThreshold = 0.1;
	let browser: any;
	let page: any;
	let allow: any;
	let awaiting: Promise<void>;
	beforeAll(async () => {
		browser = await puppeteer.launch();
		page = await browser.newPage();
		await page.exposeFunction("completeToStartup", () => {
			if (allow) {
				allow();
			}
		});
	});

	beforeEach(async () => {
		awaiting = new Promise((resolve) => { allow = resolve; });
		// execSync(`${path.join(__dirname, "..", "..", "..", "node_modules", ".bin", "forever")} restartall`);
		// await execSync(`${path.join(__dirname, "..", "..", "..", "node_modules", ".bin", "forever")} start ${path.join(__dirname, "..", "helper", "runSampleContent.js")}`);
	});

	afterEach(async () => {
		// await execSync(`${path.join(__dirname, "..", "..", "..", "node_modules", ".bin", "forever")} stop ${path.join(__dirname, "..", "helper", "runSampleContent.js")}`);
	});

	afterAll(async () => {
		await page.close();
		await browser.close();
	});

	it("start content", async () => {
		await page.goto("http://localhost:5000/public/index.html?playerId=test");
		await awaiting;
		const current = await page.screenshot({fullPage: true});
		const expected: any = fs.readFileSync(path.join(screenshotDir, "game_start.png"));
		let misMatchPercentage = 0;
		await resemble(current).compareTo(expected)
			.onComplete((data: any) => {
				misMatchPercentage = parseFloat(data.misMatchPercentage);
				fs.writeFileSync(path.join(__dirname, "..", "..", "result", "start_content.png"), data.getBuffer());
			});
		expect(misMatchPercentage).toBeLessThan(screenshotDiffThreshold);
	});

	it("click in content", async () => {
		await page.goto("http://localhost:5001/public/index.html?playerId=test");
		await awaiting;
		await page.click("canvas");
		await page.waitFor(100);
		const current = await page.screenshot({fullPage: true});
		const expected: any = fs.readFileSync(path.join(screenshotDir, "one_click.png"));
		let misMatchPercentage = 0;
		await resemble(current).compareTo(expected)
			.onComplete((data: any) => {
				misMatchPercentage = parseFloat(data.misMatchPercentage);
				fs.writeFileSync(path.join(__dirname, "..", "..", "result", "click_in_content.png"), data.getBuffer());
			});
		expect(misMatchPercentage).toBeLessThan(screenshotDiffThreshold);
	});
});
