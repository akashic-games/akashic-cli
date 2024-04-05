import express = require("express");
import type { SandboxRuntimeVersion } from "../utils";
import { resolveEngineFilesVariable } from "../utils";

const controller: express.RequestHandler = (req: express.Request, res: express.Response, _next: Function) => {
	const devMode = req.query.devmode !== "disable";
	const environment = res.locals.environment;
	const version: SandboxRuntimeVersion = environment && environment["sandbox-runtime"] ? environment["sandbox-runtime"] : "1";
	// json の読み込みのため require の lint エラーを抑止
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const pkgJson = require("../../package.json");
	const engineFilesVariable = resolveEngineFilesVariable(version);

	res.render("game", {
		title: `akashic-sandbox v${pkgJson.version}`,
		version: version,
		devMode: devMode,
		engineFilesVariable: engineFilesVariable,
		engineFilesPath: `js/v${version}/${engineFilesVariable}.js`
	});
};

module.exports = controller;
