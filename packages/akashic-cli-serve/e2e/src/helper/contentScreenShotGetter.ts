import * as path from "path";
import * as puppeteer from "puppeteer";
const setup = require("./setup");
const teardown = require("./teardown");

(async () => {
	try {
		setup();
		const hostname = "localhost";
		const port = process.env.SERVE_PORT;
		const screenshotDir = path.join(__dirname, "..", "..", "screenshot");
		const waitingRendering = 1000;
		const browser = await puppeteer.launch({
			headless: true,
			executablePath: process.env.CHROME_BIN || null,
			args: ['--no-sandbox', '--headless', '--disable-gpu', '--disable-dev-shm-usage']
		});
		const page = await browser.newPage();
		await page.waitFor(5000); // serveが起動するのを待つために少し長めに待つ
		await page.goto(`http://${hostname}:${port}/public/index.html?playerId=test`);
		await page.waitFor("canvas");
		await page.waitFor(2000); // ゲームが起動するまで待つ
		await page.screenshot({path: path.join(screenshotDir, "title_scene.png"), fullPage: true});
		await page.waitFor(5000); // ルール説明画面に遷移するまで待つ
		await page.screenshot({path: path.join(screenshotDir, "rule_scene.png"), fullPage: true});
		await page.waitFor(10000); // ゲーム画面に遷移するまで待つ
		await page.screenshot({path: path.join(screenshotDir, "game_scene.png"), fullPage: true});
		const canvasElem = await page.$("canvas");
		const canvasRect = await canvasElem.boundingBox();
		await page.mouse.click(canvasRect.x + 500, canvasRect.y + 200); // パネルを選択
		await page.mouse.click(canvasRect.x + 100, canvasRect.y + 100); // パネルを1つだけセット
		await page.waitFor(waitingRendering);
		await page.screenshot({path: path.join(screenshotDir, "game_scene_one_click.png"), fullPage: true});
		await page.mouse.click(canvasRect.x + 300, canvasRect.y + 100);
		await page.waitFor(waitingRendering);
		await page.mouse.click(canvasRect.x + 300, canvasRect.y + 300);
		await page.waitFor(waitingRendering);
		await page.mouse.click(canvasRect.x + 100, canvasRect.y + 300);
		await page.waitFor(waitingRendering * 3);
		await page.screenshot({path: path.join(screenshotDir, "game_scene_next.png"), fullPage: true});
		await page.close();
		await browser.close();
	} finally {
		teardown();
	}
})();
