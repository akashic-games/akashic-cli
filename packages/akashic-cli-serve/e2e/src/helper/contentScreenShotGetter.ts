import * as puppeteer from "puppeteer";
const setup = require("./setup");
const teardown = require("./teardown");

(async () => {
	try {
		setup();
		const hostname = "localhost";
		const port = process.env.SERVE_PORT;
		let allow: any;
		let awaiting: Promise<void> = new Promise((resolve) => { allow = resolve; });
		const browser = await puppeteer.launch();
		const page = await browser.newPage();
		await page.waitFor(5000); // serveが立つのを待つために待機時間を長めに設定
		await page.exposeFunction("completeToStartup", () => {
			if (allow) {
				allow();
			}
		});
		await page.goto(`http://${hostname}:${port}/public/index.html?playerId=test`);
		await awaiting;
		await page.screenshot({path: "e2e/result/base/game_start.png", fullPage: true});
		let icons: any[] = await page.$$(".material-icons");
		await icons[3].click(); // joinボタンを押す
		await page.waitFor(500);
		await page.screenshot({path: "e2e/result/base/join.png", fullPage: true});
		await icons[3].click(); // leaveボタンを押す
		await icons[1].click(); // pauseボタンを押す
		await page.screenshot({path: "e2e/result/base/pause.png", fullPage: true});
		await icons[1].click(); // resumeボタンを押す
		await page.click("canvas");
		await page.waitFor(500);
		await page.screenshot({path: "e2e/result/base/one_click.png", fullPage: true});
		await page.close();
		await browser.close();
	} finally {
		teardown();
	}
})();
