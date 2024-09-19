import fs from "fs";
import { createRequire } from "module";
import path from "path";
import type { SandboxConfiguration } from "@akashic/sandbox-configuration";
import type { RequestHandler } from "express";

const require = createRequire(import.meta.url);

const controller: RequestHandler = (req, res, _next) => {
	const scriptPath = path.resolve(path.join(req.baseDir, "sandbox.config.js"));

	if (! fs.existsSync(scriptPath)) {
		res.contentType("text/javascript");
		res.send(createLoadingScript({}));
		return;
	}
	let sandboxConfig = {};
	try {
		sandboxConfig = require(scriptPath);
		delete require.cache[require.resolve(scriptPath)]; // 設定ファイルの更新に追従するためアクセス毎にキャッシュを削除する
		sandboxConfig = completeConfigParams(sandboxConfig);
	} catch (error) {
		console.log(error);
	}
	res.contentType("text/javascript");
	res.send(createLoadingScript(sandboxConfig));
};

export default controller;

function completeConfigParams(c: SandboxConfiguration): SandboxConfiguration {
	const config = {
		autoSendEventName: c.autoSendEventName ? c.autoSendEventName : "",
		events: c.events ? c.events : {},
		showMenu: !!c.showMenu,
		warn: c.warn ? c.warn : {}
	};
	return config;
}

function createLoadingScript(content: any): string {
	return `window.sandboxDeveloperProps = window.sandboxDeveloperProps || {};
window.sandboxDeveloperProps.sandboxConfig = ${JSON.stringify(content)};
`;
}
