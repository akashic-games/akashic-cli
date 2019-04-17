import * as fs from "fs";
import * as path from "path";
import * as puppeteer from "puppeteer";
import * as resemble from "resemblejs";
import {execSync} from "child_process";

describe("cli-serve", () => {
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

	it("create new play", async () => {
		await page.goto("http://localhost:5010/public/index.html?playerId=test");
		await awaiting;
		awaiting = new Promise((resolve) => { allow = resolve; });
		let icons: any[] = await page.$$(".material-icons");
		await icons[0].click(); // Play新規作成ボタンでリセット
		await awaiting;
		const current = await page.screenshot({fullPage: true});
		const expected: any = fs.readFileSync(path.join(screenshotDir, "game_start.png"));
		let misMatchPercentage = 0;
		await resemble(current).compareTo(expected)
			.onComplete((data: any) => {
				misMatchPercentage = parseFloat(data.misMatchPercentage);
				fs.writeFileSync(path.join(__dirname, "..", "..", "result", "create_new_play.png"), data.getBuffer());
			});
		expect(misMatchPercentage).toBeLessThan(screenshotDiffThreshold);
		//icons = await page.$$(".material-icons");
		//await icons[0].click(); // Play新規作成ボタンでリセット
	});

	xit("pause active instance", async () => {
		await page.goto("http://localhost:5011/public/index.html?playerId=test");
		await awaiting;
		let icons: any[] = await page.$$(".material-icons");
		await icons[1].click(); // アクティブインスタンス停止ボタンをクリック
		await page.click("canvas");
		const current = await page.screenshot({fullPage: true});
		const expected: any = fs.readFileSync(path.join(screenshotDir, "game_start.png"));
		let misMatchPercentage = 0;
		await resemble(current).compareTo(expected)
			.onComplete((data: any) => {
				misMatchPercentage = parseFloat(data.misMatchPercentage);
				fs.writeFileSync(path.join(__dirname, "..", "..", "result", "pause_active_instance.png"), data.getBuffer());
			});
		expect(misMatchPercentage).toBeLessThan(screenshotDiffThreshold);
	});

	it("join to content", async () => {
		await page.goto("http://localhost:5012/public/index.html?playerId=test");
		await awaiting;
		let icons: any[] = await page.$$(".material-icons");
		await icons[3].click(); // joinボタンをクリック
		await page.waitFor(100);
		let current = await page.screenshot({fullPage: true});
		let expected: any = fs.readFileSync(path.join(screenshotDir, "join.png"));
		let misMatchPercentage = 0;
		await resemble(current).compareTo(expected)
			.onComplete((data: any) => {
				misMatchPercentage = parseFloat(data.misMatchPercentage);
				fs.writeFileSync(path.join(__dirname, "..", "..", "result", "join_to_content.png"), data.getBuffer());
			});
		expect(misMatchPercentage).toBeLessThan(screenshotDiffThreshold);
		console.log("join to content before $$");
		icons = await page.$$(".material-icons");
		console.log("join to content after $$");
		await icons[0].click(); // Play新規作成ボタンでリセット
	});

	xit("leave from content", async () => {
		await page.goto("http://localhost:5013/public/index.html?playerId=test");
		await awaiting;
		let icons: any[] = await page.$$(".material-icons");
		await icons[3].click(); // joinボタンをクリック
		await icons[3].click(); // joinボタンクリック後leaveボタンをクリック
		await page.waitFor(100);
		let current = await page.screenshot({fullPage: true});
		let expected: any = fs.readFileSync(path.join(screenshotDir, "game_start.png"));
		let misMatchPercentage = 0;
		await resemble(current).compareTo(expected)
			.onComplete((data: any) => {
				misMatchPercentage = parseFloat(data.misMatchPercentage);
				fs.writeFileSync(path.join(__dirname, "..", "..", "result", "leave_from_content.png"), data.getBuffer());
			});
		expect(misMatchPercentage).toBeLessThan(screenshotDiffThreshold);
	});
});
