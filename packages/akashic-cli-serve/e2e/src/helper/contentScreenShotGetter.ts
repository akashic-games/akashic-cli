import * as puppeteer from "puppeteer";

(async () => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.goto("http://192.168.33.11:3300/public/index.html");
	await page.waitForSelector("canvas");
	await page.waitFor(2000);
	await page.screenshot({path: "e2e/fixtures/sample_content/screenshot/game_start.png", fullPage: true});
	let icons: any[] = await page.$$(".material-icons");
	await icons[0].click(); // Play新規作成ボタンでリセット
	await page.waitForSelector("canvas");
	await page.waitFor(2000);
	icons = await page.$$(".material-icons");
	await icons[3].click(); // joinボタンを押す
	await page.screenshot({path: "e2e/fixtures/sample_content/screenshot/join.png", fullPage: true});
	await icons[3].click(); // leaveボタンを押す
	await page.click("canvas");
	await page.screenshot({path: "e2e/fixtures/sample_content/screenshot/one_click.png", fullPage: true});
	await browser.close();
})();
