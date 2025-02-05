import { createServer } from "http";
import { program } from "commander";
import { existsSync } from "fs";
import { createRequire } from "module";
import path from "path";
import debugLib from "debug";
import { load } from "@akashic/akashic-cli-commons/lib/FileSystem.js";
import appLib from "./lib/app.js";

const debug = debugLib("script-test:server");
const require = createRequire(import.meta.url);
const { version } = require("./package.json");

function collect(val, acc) {
	acc.push(val);
	return acc;
}

program
	.version(version)
	.usage("[options] <game path>")
	.option("--cascade <path>", "path to contents to cascade", collect, [])
	.option("-p, --port <port>", "number of listen port. default 3000", parseInt)
	.option("-s, --scenario <scenario>", "scenario file");

/**
 * @param {import('@akashic/akashic-cli-commons/lib/CliConfig/CliConfigSandbox.js').CliConfigSandbox} param
 */
async function cli(param) {
	const app = appLib({
		gameBase: param.args.length > 0 ? param.args[0] : param.cwd,
		cascadeBases: param.cascade,
		fonts: param.fonts,
	});
	const port = normalizePort(param.port ?? process.env.PORT ?? 3000);

	if (param.scenario) {
		if (!existsSync(param.scenario)) {
			console.error("could not load " + param.scenario);
			process.exitCode = 1;
			return;
		}
		app.set("scenarioPath", param.scenario);
	}

	const gameJsonPath = path.join(app.gameBase, "game.json");
	if (!param.scenario && !existsSync(gameJsonPath)) {
		console.error(`could not load ${gameJsonPath}`);
		process.exitCode = 1;
		return;
	}

	app.set("port", port);

	const server = createServer(app);

	server.listen(port);
	server.on("error", onError);
	server.on("listening", onListening);

	function normalizePort(val) {
		const port = parseInt(val, 10);

		if (isNaN(port)) {
			// named pipe
			return val;
		}

		if (port >= 0) {
			// port number
			return port;
		}

		return false;
	}

	function onError(error) {
		if (error.syscall !== "listen") {
			throw error;
		}

		const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

		// handle specific listen errors with friendly messages
		switch (error.code) {
			case "EACCES":
				console.error(bind + " requires elevated privileges");
				process.exit(1);
			case "EADDRINUSE":
				console.error(bind + " is already in use");
				process.exit(1);
			default:
				throw error;
		}
	}

	function onListening() {
		const addr = server.address();
		const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
		debug("Listening on " + bind);
	}

	console.log("akashic-sandbox listen port: " + port);
	console.log("hosting game: " + gameJsonPath);
	if (app.settings.scenarioPath) {
		console.log("scenario file: " + app.settings.scenarioPath);
	}
	console.log("please access to http://localhost:%d/game/ by web-browser", port);
}

export const run = async (argv) => {
	program.parse(argv);
	const options = program.opts();

	let configuration;
	try {
		configuration = await load(options.cwd || process.cwd());
	} catch (error) {
		console.error(error);
		process.exitCode = 1;
		return;
	}

	const conf = configuration.commandOptions?.sandbox ?? {};
	await cli({
		args: program.args ?? conf.args,
		cwd: options.cwd ?? conf.cwd,
		cascade: options.cascade ?? conf.cascade,
		port: options.port ?? conf.port,
		scenario: options.scenario ?? conf.scenario,
		fonts: conf.fonts,
	});
};
