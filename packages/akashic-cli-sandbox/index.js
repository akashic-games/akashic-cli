const pkg = require("./package.json");
const debug = require("debug")("script-test:server");
const http = require("http");
const commander = require("commander");

function collect(val, acc) {
	acc.push(val);
	return acc;
}

commander
	.version(pkg.version)
	.usage("[options] <game path>")
	.option("--cascade <path>", "path to contents to cascade", collect, [])
	.option("-p, --port <port>", "number of listen port. default 3000", parseInt)
	.option("-s, --scenario <scenario>", "scenario file");

exports.run = (argv) => {
	commander.parse(argv);

	const opts = commander.opts();
	const gameBase = commander.args.length > 0 ? commander.args[0] : process.cwd();
	const app = require("./lib/app")({ gameBase: gameBase, cascadeBases: opts.cascade });
	const port = normalizePort(opts.port || process.env.PORT || 3000);

	const path = require("path");
	const fs = require("fs");

	if (opts.scenario) {
		if (!fs.existsSync(opts.scenario)) {
			console.error("can not load " + opts.scenario);
			return;
		}
		app.set("scenarioPath", opts.scenario);
	}

	const gameJsonPath = path.join(app.gameBase, "game.json");
	if (!opts.scenario && !fs.existsSync(gameJsonPath)) {
		console.error("can not load " + path.join(app.gameBase, "game.json"));
		return;
	}

	app.set("port", port);

	const server = http.createServer(app);

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
};
