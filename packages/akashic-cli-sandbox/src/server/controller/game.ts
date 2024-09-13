import { createRequire } from "module";
import type { RequestHandler } from "express";
import type { SandboxRuntimeVersion } from "../utils.js";
import { resolveEngineFilesVariable } from "../utils.js";

const require = createRequire(import.meta.url);
const pkgJson = require("../../package.json");

const controller: RequestHandler = (req, res, _next) => {
	const devMode = req.query.devmode !== "disable";
	const environment = res.locals.environment;
	const version: SandboxRuntimeVersion = environment && environment["sandbox-runtime"] ? environment["sandbox-runtime"] : "1";
	const engineFilesVariable = resolveEngineFilesVariable(version);

	res.render("game", {
		title: `akashic-sandbox v${pkgJson.version}`,
		version: version,
		devMode: devMode,
		engineFilesVariable: engineFilesVariable,
		engineFilesPath: `js/v${version}/${engineFilesVariable}.js`
	});
};

export default controller;
