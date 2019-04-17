import * as puppeteer from "puppeteer";
import * as commander from "commander";

(async () => {
	commander
		.description("Script for taking screenshots for use in integration test.")
		.option("-p, --port <port>", `The port number to listen. default: 3300`, (x => parseInt(x, 10)))
		.option("-H, --hostname <hostname>", `The host name of the server. default: localhost`)
		.parse(process.argv);
	const hostname = commander.hostmane || "localhost";
	const port = commander.port || 3300;
	let allow: any;
	let awaiting: Promise<void> = new Promise((resolve) => { allow = resolve; });
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.exposeFunction("completeToStartup", () => {
		if (allow) {
			allow();
		}
	});
	await page.goto(`http://${hostname}:${port}/public/index.html?playerId=test`);
	await awaiting;
	awaiting = new Promise((resolve) => { allow = resolve; });
	await page.screenshot({path: "e2e/fixtures/sample_content/screenshot/game_start.png", fullPage: true});
	let icons: any[] = await page.$$(".material-icons");
	await icons[0].click(); // Play新規作成ボタンでリセット
	await awaiting;
	icons = await page.$$(".material-icons");
	await icons[3].click(); // joinボタンを押す
	await page.screenshot({path: "e2e/fixtures/sample_content/screenshot/join.png", fullPage: true});
	await icons[3].click(); // leaveボタンを押す
	await page.click("canvas");
	await page.screenshot({path: "e2e/fixtures/sample_content/screenshot/one_click.png", fullPage: true});
	await browser.close();
})();
