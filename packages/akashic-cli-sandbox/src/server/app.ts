import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import session  from "express-session";
import gameRoute from "./routes/game.js";
import jsRoute from "./routes/js.js";
import sandboxConfigRoute from "./routes/sandboxConfig.js";
import type { SandboxRuntimeVersion } from "./utils.js";
import { resolveEngineFilesPath, resolveEngineFilesVariable } from "./utils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface AkashicSandbox extends express.Express {
	gameBase?: string;
	cascadeBases?: string[];
	scenario?: any;
}

interface AppOptions {
	gameBase?: string;
	jsBase?: string;
	cssBase?: string;
	thirdpartyBase?: string;
	cascadeBases?: string[];
}

interface ModuleEnvironment {
	"sandbox-runtime"?: string;
}

// Akashic Sandboxに必要な部分だけ定義
interface GameConfiguration {
	environment?: ModuleEnvironment;
}

function getContentModuleEnvironment(gameJsonPath: string): ModuleEnvironment | null {
	if (fs.existsSync(gameJsonPath)) {
		const configuration: GameConfiguration = JSON.parse(fs.readFileSync(gameJsonPath, "utf8"));
		return configuration.environment ?? null;
	}
	return null;
}

export default function (options: AppOptions = {}): AkashicSandbox {
	const appBase = path.join(__dirname, "..");
	const gameBase = options.gameBase ? options.gameBase : process.cwd();
	const cascadeBases = options.cascadeBases || [];
	const jsBase = options.jsBase ? options.jsBase : path.join(appBase, "js");
	const cssBase = options.cssBase ? options.cssBase : path.join(appBase, "css");
	const thridpartyBase = options.thirdpartyBase ? options.thirdpartyBase : path.join(appBase, "thirdparty");

	const app: AkashicSandbox = express();
	const isDev = app.get("env") === "development";

	const gameJsonPath = path.join(gameBase, "game.json");
	const environment = getContentModuleEnvironment(gameJsonPath);
	const version = environment && environment["sandbox-runtime"] ? environment["sandbox-runtime"] : "1";

	if (! /^(1|2|3)$/.test(version)) {
		// sandbox-runtime の値が "1", "2", "3" 以外の場合エラーとする
		throw new Error("sandbox-runtime value is invalid. Please set the environment. sandbox-runtime value of game.json to 1, 2, or 3.");
	}

	// see https://github.com/expressjs/session#secret
	app.use(session({
		resave: false,
		saveUninitialized: false,
		secret: "to eat or no  to eat"
	}));

	app.use((_req, res, next) => {
		res.header("Access-Control-Allow-Origin", "*");
		res.locals.environment = environment;
		next();
	});

	app.gameBase = gameBase;
	app.cascadeBases = cascadeBases;

	// TODO: change to middleware
	app.use("/game/*.js$", (req, _res, next) => {
		req.baseDir = app.gameBase!;
		next();
	});
	app.use("/raw_game/*.js$", (req, _res, next) => {
		req.baseDir = app.gameBase!;
		req.useRawScript = true;
		next();
	});
	app.use("/cascade/:index/*.js$", (req, _res, next) => {
		req.baseDir = app.cascadeBases![Number(req.params.index)];
		next();
	});
	app.use("/raw_cascade/:index/*.js$", (req, _res, next) => {
		req.baseDir = app.cascadeBases![Number(req.params.index)];
		req.useRawScript = true;
		next();
	});

	app.set("views", path.join(__dirname, "..", "views"));
	app.set("view engine", "ejs");

	app.use("^\/$", (_req, res, _next) => {
		res.redirect("/game/");
	});
	app.use("^\/game$", (_req, res, _next) => {
		res.redirect("/game/");
	});
	// /js/ /css/ /thirdparty/ を静的ファイルとして参照できるようにする
	app.use("/js/v:version/engineFilesV*.js", (req, res, next) => {
		const engineFilesPath = resolveEngineFilesPath(req.params.version as SandboxRuntimeVersion);

		if (fs.existsSync(engineFilesPath)) {
			const engineFilesSrc = fs.readFileSync(engineFilesPath).toString();
			res.contentType("text/javascript");
			res.send(engineFilesSrc);
		} else {
			next();
		}
	});
	app.use("/js/", express.static(jsBase));
	app.use("/css/", express.static(cssBase));
	app.use("/thirdparty/", express.static(thridpartyBase));

	app.use("/sandboxconfig/", (req, _res, next) => {
		req.baseDir = app.gameBase!;
		next();
	}, sandboxConfigRoute);

	// /game/ は sandbox をブラウザで開く場合に利用、/raw_game/ は /engine のエンジン設定ファイルを使う場合に利用
	app.use("/game", jsRoute);
	app.use("/game", gameRoute);
	app.use("/game/", express.static(app.gameBase));
	app.use("/raw_game", jsRoute);
	app.use("/raw_game/", express.static(app.gameBase));
	app.use("/cascade/:index", jsRoute);
	app.use("/raw_cascade/:index", jsRoute);
	for (let i = 0; i < app.cascadeBases.length; ++i) {
		app.use("/cascade/" + i + "/", express.static(app.cascadeBases[i]));
		app.use("/raw_cascade/" + i + "/", express.static(app.cascadeBases[i]));
	}

	app.use("/configuration/", (req, res, _next) => {
		const prefix = req.query.raw ? "/raw_" : "/";
		if (app.cascadeBases == null || app.cascadeBases.length === 0) {
			res.redirect(prefix + "game/game.json");
			return;
		}
		const defs = [prefix + "game/game.json"];
		for (let i = 0; i < app.cascadeBases.length; ++i)
			defs.push(prefix + "cascade/" + i + "/game.json");
		res.json({ definitions: defs });
	});

	app.use("/basepath/", (_req, res, _next) => {
		res.send(app.gameBase);
	});

	app.use("/engine", (req, res, _next) => {
		const host = req.protocol + "://" + req.get("host");
		res.type("application/json");

		let externals = req.query.externals ? req.query.externals : ["audio", "xhr", "websocket"];

		externals = Array.isArray(externals) ? externals : [externals] as string[];

		if (typeof externals[0] !== "string" && externals[0] != null) throw new Error("Invalid externals type");
		res.render("engine", {
			host: host,
			externals: JSON.stringify(externals),
			engineFilesPath: `js/v${version}/${resolveEngineFilesVariable(version as SandboxRuntimeVersion)}.js`
		});
	});

	app.use((_req, _res, next) => {
		const err = new Error("Not Found");
		err.status = 404;
		next(err);
	});

	let errorHandler: express.ErrorRequestHandler;
	if (isDev) {
		errorHandler = (err: any, _req, res, _next): any => {
			res.status(err.status || 500);
			res.render("error", {
				title: "error",
				message: err.message,
				error: err
			});
		};
	} else {
		errorHandler = (err, _req, res, _next): any => {
			res.status(err.status || 500);
			res.render("error", {
				title: "error",
				message: err.message,
				error: {}
			});
		};
	}

	app.use(errorHandler);

	return app;
};
