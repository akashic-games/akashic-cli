import * as fs from "fs";
import * as path from "path";
import * as util from "util";
import * as http from "http";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as socketio from "socket.io";
import * as commander from "commander";
import * as chalk from "chalk";
import * as open from "open";
import { PlayManager, RunnerManager, setSystemLogger, getSystemLogger } from "@akashic/headless-driver";
import { createApiRouter } from "./route/ApiRoute";
import { RunnerStore } from "./domain/RunnerStore";
import { PlayStore } from "./domain/PlayStore";
import { SocketIOAMFlowManager } from "./domain/SocketIOAMFlowManager";
import { serverGlobalConfig } from "./common/ServerGlobalConfig";
import { createContentsRouter } from "./route/ContentsRoute";
import { createHealthCheckRouter } from "./route/HealthCheckRoute";
import { ServerContentLocator } from "./common/ServerContentLocator";
import {  CliConfigurationFile, CliConfigServe, SERVICE_TYPES } from "@akashic/akashic-cli-commons";
import { PlayerIdStore } from "./domain/PlayerIdStore";

// 渡されたパラメータを全てstringに変換する
// chalkを使用する場合、ログ出力時objectの中身を展開してくれないためstringに変換する必要がある
function convertToStrings(params: any[]): string[] {
	return params.map(param => {
		if (typeof param === "object") {
			return util.inspect(param, {depth: null});
		} else {
			return param.toString();
		}
	});
}

async function cli(cliConfigParam: CliConfigServe) {
	if (cliConfigParam.port && isNaN(cliConfigParam.port)) {
		console.error("Invalid --port option: " + cliConfigParam.port);
		process.exit(1);
	}

	serverGlobalConfig.untrusted = !!cliConfigParam.debugUntrusted;
	serverGlobalConfig.proxyAudio = !!cliConfigParam.debugProxyAudio;
	serverGlobalConfig.preserveDisconnected = !!cliConfigParam.preserveDisconnected;

	if (cliConfigParam.hostname) {
		serverGlobalConfig.hostname = cliConfigParam.hostname;
		serverGlobalConfig.useGivenHostname = true;
	}

	if (cliConfigParam.port) {
		serverGlobalConfig.port = cliConfigParam.port;
		serverGlobalConfig.useGivenPort = true;
	}

	if (cliConfigParam.verbose) {
		serverGlobalConfig.verbose = true;
		setSystemLogger({
			info: (...messages: any[]) => {
				console.log(chalk.gray(...convertToStrings(messages)));
			},
			debug: (...messages: any[]) => {
				console.log(chalk.gray(...convertToStrings(messages)));
			},
			warn: (...messages: any[]) => {
				console.warn(chalk.yellow(...convertToStrings(messages)));
			},
			error: (...messages: any[]) => {
				console.error(chalk.red(...convertToStrings(messages)));
			}
		});
	} else {
		serverGlobalConfig.verbose = false;
		setSystemLogger({
			info: (...messages: any[]) => {},
			debug: (...messages: any[]) => {},
			warn: (...messages: any[]) => {
				console.warn(chalk.yellow(...convertToStrings(messages)));
			},
			error: (...messages: any[]) => {
				console.error(chalk.red(...convertToStrings(messages)));
			}
		});
	}

	if (cliConfigParam.autoStart != null) {
		serverGlobalConfig.autoStart = cliConfigParam.autoStart;
	}

	if (cliConfigParam.targetService) {
		if (!cliConfigParam.autoStart && cliConfigParam.targetService === "nicolive") {
			getSystemLogger().error("--no-auto-start and --target-service nicolive can not be set at the same time.");
			process.exit(1);
		}

		if (!SERVICE_TYPES.includes(cliConfigParam.targetService )) {
			getSystemLogger().error("Invalid --target-service option argument: " + cliConfigParam.targetService);
			process.exit(1);
		}
		serverGlobalConfig.targetService = cliConfigParam.targetService;
	}

	if (cliConfigParam.allowExternal) {
		serverGlobalConfig.allowExternal = cliConfigParam.allowExternal;
	}

	let gameExternalFactory: () => any = () => undefined;
	if (commander.serverExternalScript) {
		try {
			gameExternalFactory = require(path.resolve(commander.serverExternalScript));
		} catch (e) {
			getSystemLogger().error(`Failed to evaluating --server-external-script (${commander.serverExternalScript}): ${e}`);
			process.exit(1);
		}
		if (typeof gameExternalFactory !== "function") {
			getSystemLogger().error(`${commander.serverExternalScript}, given as --server-external-script, does not export a function`);
			process.exit(1);
		}
	}

	const targetDirs: string[] = cliConfigParam.targetDirs;
	const playManager = new PlayManager();
	const runnerManager = new RunnerManager(playManager);
	const playStore = new PlayStore({ playManager });
	const runnerStore = new RunnerStore({ runnerManager, gameExternalFactory });
	const playerIdStore = new PlayerIdStore();
	const amflowManager = new SocketIOAMFlowManager({ playStore });

	// TODO ここでRunner情報を外部からPlayStoreにねじ込むのではなく、PlayEntity や PlayEntity#createRunner() を作って管理する方が自然
	runnerStore.onRunnerCreate.add(arg => playStore.registerRunner(arg));
	runnerStore.onRunnerRemove.add(arg => playStore.unregisterRunner(arg));

	const app = express();
	const httpServer = http.createServer(app);
	const io = socketio(httpServer);

	app.set("views", path.join(__dirname, "..", "..", "views"));
	app.set("view engine", "ejs");

	app.use((req, res, next) => {
		res.removeHeader("X-Powered-By");
		res.removeHeader("ETag");
		res.header("Cache-Control", ["private", "no-store", "no-cache", "must-revalidate", "proxy-revalidate"].join(","));
		res.header("no-cache", "Set-Cookie");
		next();
	});
	app.use(bodyParser.json());

	app.use("^\/$", (req, res, next) => res.redirect("/public/"));
	app.use("/public/", express.static(path.join(__dirname, "..", "..", "www", "public")));
	app.use("/internal/", express.static(path.join(__dirname, "..", "..", "www", "internal")));
	app.use("/api/", createApiRouter({ playStore, runnerStore, playerIdStore, amflowManager, io }));
	app.use("/contents/", createContentsRouter({ targetDirs }));
	app.use("/health-check/", createHealthCheckRouter({ playStore }));

	io.on("connection", (socket: socketio.Socket) => { amflowManager.setupSocketIOAMFlow(socket); });
	// TODO 全体ブロードキャストせず該当するプレイにだけ通知するべき？
	playStore.onPlayStatusChange.add(arg => { io.emit("playStatusChange", arg); });
	playStore.onPlayDurationStateChange.add(arg => { io.emit("playDurationStateChange", arg); });
	playStore.onPlayCreate.add(arg => { io.emit("playCreate", arg); });
	playStore.onPlayerJoin.add(arg => { io.emit("playerJoin", arg); });
	playStore.onPlayerLeave.add(arg => { io.emit("playerLeave", arg); });
	playStore.onClientInstanceAppear.add(arg => { io.emit("clientInstanceAppear", arg); });
	playStore.onClientInstanceDisappear.add(arg => { io.emit("clientInstanceDisappear", arg); });
	runnerStore.onRunnerCreate.add(arg => { io.emit("runnerCreate", arg); });
	runnerStore.onRunnerRemove.add(arg => { io.emit("runnerRemove", arg); });
	runnerStore.onRunnerPause.add(arg => { io.emit("runnerPause", arg); });
	runnerStore.onRunnerResume.add(arg => { io.emit("runnerResume", arg); });

	let loadedPlaylogPlayId: string;
	if (cliConfigParam.debugPlaylog) {
		const absolutePath = path.join(process.cwd(), cliConfigParam.debugPlaylog);
		if (!fs.existsSync(absolutePath)) {
			getSystemLogger().error(`Can not find ${absolutePath}`);
			process.exit(1);
		}
		// 現状 playlog は一つしか受け取らない。それは contentId: 0 のコンテンツの playlog として扱う。
		const contentLocator = new ServerContentLocator({contentId: "0"});
		try {
			const playlog = require(absolutePath);
			loadedPlaylogPlayId = await playStore.createPlay(contentLocator, playlog);
		} catch (e) {
			getSystemLogger().error(e.message);
			process.exit(1);
		}
	}

	httpServer.listen(serverGlobalConfig.port, () => {
		if (serverGlobalConfig.port < 1024) {
			getSystemLogger().warn("Akashic Serve is a development server which is not appropriate for public release. " +
				`We do not recommend to listen on a well-known port ${serverGlobalConfig.port}.`);
		}
		let url = `http://${serverGlobalConfig.hostname}:${serverGlobalConfig.port}/public`;
		// サーバー起動のログに関してはSystemLoggerで使用していない色を使いたいので緑を選択
		console.log(chalk.green(`Hosting ${targetDirs.join(", ")} on ${url}`));
		if (loadedPlaylogPlayId) {
			console.log(`play(id: ${loadedPlaylogPlayId}) read playlog(path: ${path.join(process.cwd(), commander.debugPlaylog)}).`);
			url += `?playId=${loadedPlaylogPlayId}&mode=replay`;
			console.log(`if access ${url}, you can show this play.`);
		}

		if (cliConfigParam.openBrowser ) {
			open(url);
		}
	});
}

// TODOこのファイルを改名してcli.tsにする
export async function run(argv: any): Promise<void> {
	const ver = JSON.parse(fs.readFileSync(path.resolve(__dirname, "..", "..", "package.json"), "utf8")).version;
	commander
		.version(ver)
		.description("Development server for Akashic Engine to debug multiple-player games")
		.usage("[options] <gamepath>")
		.option("-p, --port <port>", `The port number to listen. default: ${serverGlobalConfig.port}`, (x => parseInt(x, 10)))
		.option("-H, --hostname <hostname>", `The host name of the server. default: ${serverGlobalConfig.hostname}`)
		.option("-v, --verbose", `Display detailed information on console.`)
		.option("-A, --no-auto-start", `Wait automatic startup of contents.`)
		.option("-s, --target-service <service>", `Simulate the specified service. arguments: ${SERVICE_TYPES}`)
		.option("--server-external-script <path>",
			`Evaluate the given JS and assign it to Game#external of the server instances`)
		.option("--debug-playlog <path>", `Specify path of playlog-json.`)
		.option("--debug-untrusted", `An internal debug option`)
		.option("--debug-proxy-audio", `An internal debug option`)
		.option("--allow-external", `Read the URL allowing external access from sandbox.config.js`)
		.option("--no-open-browser", "No open browser at startup")
		.option("--preserve-disconnected", "Preserve the state of window disconnected from the network")
		.parse(argv);

	CliConfigurationFile.read(path.join(commander["cwd"] || process.cwd(), "akashic.config.js"), async (error, configuration) => {
		if (error) {
			console.error(error);
			process.exit(1);
		}

		const conf = configuration.commandOptions.serve || {};
		const cliConfigParam: CliConfigServe = {
			port: commander.port ?? conf.port,
			hostname: commander.hostname ?? conf.hostname,
			verbose: commander.verbose ?? conf.verbose,
			autoStart: commander.autoStart ?? conf.autoStart,
			targetService: commander.targetService ?? conf.targetService,
			debugPlaylog: commander.debugPlaylog ?? conf.debugPlaylog,
			debugUntrusted: commander.debugUntrusted ?? conf.debugUntrusted,
			debugProxyAudio: commander.proxyAudio ?? conf.debugProxyAudio,
			allowExternal: commander.allowExternal ?? conf.allowExternal,
			targetDirs: commander.args.length > 0 ? commander.args : (conf.targetDirs ?? [process.cwd()]),
			openBrowser: commander.openBrowser ?? conf.openBrowser,
			preserveDisconnected: commander.preserveDisconnected ?? conf.preserveDisconnected
		};
		await cli(cliConfigParam);
	});
}
