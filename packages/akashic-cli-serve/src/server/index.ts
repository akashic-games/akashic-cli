import * as fs from "fs";
import * as path from "path";
import * as util from "util";
import type { CliConfigServe } from "@akashic/akashic-cli-commons/lib/CliConfig/CliConfigServe";
import { CliConfigurationFile } from "@akashic/akashic-cli-commons/lib/CliConfig/CliConfigurationFile";
import { SERVICE_TYPES } from "@akashic/akashic-cli-commons/lib/ServiceType";
import { PlayManager, RunnerManager, setSystemLogger, getSystemLogger } from "@akashic/headless-driver";
import * as bodyParser from "body-parser";
import type * as Chalk from "chalk";
import type { OptionValues } from "commander";
import { Command } from "commander";
import * as cors from "cors";
import * as express from "express";
import * as open from "open";
import * as socketio from "socket.io";
import parser from "../common/MsgpackParser";
import { isServiceTypeNicoliveLike } from "../common/targetServiceUtil";
import type { PutStartPointEvent } from "../common/types/TestbedEvent";
import { ServerContentLocator } from "./common/ServerContentLocator";
import { serverGlobalConfig } from "./common/ServerGlobalConfig";
import type { DumpedPlaylog } from "./common/types/DumpedPlaylog";
import { ModTargetFlags, watchContent } from "./domain/GameConfigs";
import { PlayerIdStore } from "./domain/PlayerIdStore";
import { PlayStore } from "./domain/PlayStore";
import { RunnerStore } from "./domain/RunnerStore";
import { SocketIOAMFlowManager } from "./domain/SocketIOAMFlowManager";
import { createApiRouter } from "./route/ApiRoute";
import { createContentsRouter } from "./route/ContentsRoute";
import { createHealthCheckRouter } from "./route/HealthCheckRoute";

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

// chalk@5 以降 pure ESM なので import() で読み込む
async function importChalk(): Promise<(typeof Chalk)["default"]> {
	// CommonJS 設定の TS では dynamic import が require() に変換されてしまうので、eval() で強引に imoprt() する
	// eslint-disable-next-line no-eval
	return (await eval("import('chalk')")).default;
}

async function cli(cliConfigParam: CliConfigServe, cmdOptions: OptionValues): Promise<void> {
	if (cliConfigParam.port && isNaN(cliConfigParam.port)) {
		console.error("Invalid --port option: " + cliConfigParam.port);
		process.exit(1);
	}

	serverGlobalConfig.untrusted = !!cliConfigParam.debugUntrusted;
	serverGlobalConfig.runInIframe = !!cliConfigParam.debugTrustedIframe;
	serverGlobalConfig.proxyAudio = !!cliConfigParam.debugProxyAudio;
	serverGlobalConfig.pauseActive = !!cliConfigParam.debugPauseActive;
	serverGlobalConfig.preserveDisconnected = !!cliConfigParam.preserveDisconnected;
	serverGlobalConfig.disableFeatCheck = !!cliConfigParam.debugDisableFeatCheck;

	if (cliConfigParam.hostname) {
		serverGlobalConfig.hostname = cliConfigParam.hostname;
		serverGlobalConfig.useGivenHostname = true;
	}

	if (cliConfigParam.port) {
		serverGlobalConfig.port = cliConfigParam.port;
		serverGlobalConfig.useGivenPort = true;
	}

	const chalk = await importChalk();
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
			info: (..._messages: any[]) => {}, // eslint-disable-line @typescript-eslint/no-empty-function
			debug: (..._messages: any[]) => {}, // eslint-disable-line @typescript-eslint/no-empty-function
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
		if (!cliConfigParam.autoStart && isServiceTypeNicoliveLike(cliConfigParam.targetService)) {
			getSystemLogger().error("--no-auto-start and --target-service nicolive can not be set at the same time.");
			process.exit(1);
		}

		if (!SERVICE_TYPES.includes(cliConfigParam.targetService)) {
			const serviceName: string = cliConfigParam.targetService;
			if (serviceName === "nicolive:ranking" || serviceName === "nicolive:single") {
				// モードとしてあるがサポートしてないものは未実装のエラーとする
				getSystemLogger().error("Unimplemented --target-service option argument: " + cliConfigParam.targetService);
			} else {
				getSystemLogger().error("Invalid --target-service option argument: " + cliConfigParam.targetService);
			}
			process.exit(1);
		}

		if (cliConfigParam.targetService === "nicolive") {
			cliConfigParam.targetService = "nicolive:multi"; // "nicolive"  は "nicolive:multi" のエイリアスとする
		}
		serverGlobalConfig.targetService = cliConfigParam.targetService;
	}

	if (cliConfigParam.allowExternal) {
		serverGlobalConfig.allowExternal = cliConfigParam.allowExternal;
	}

	let gameExternalFactory: () => any = () => undefined;
	if (cmdOptions.serverExternalScript) {
		try {
			gameExternalFactory = require(path.resolve(cmdOptions.serverExternalScript));
		} catch (e) {
			getSystemLogger().error(`Failed to evaluating --server-external-script (${cmdOptions.serverExternalScript}): ${e}`);
			process.exit(1);
		}
		if (typeof gameExternalFactory !== "function") {
			getSystemLogger().error(`${cmdOptions.serverExternalScript}, given as --server-external-script, does not export a function`);
			process.exit(1);
		}
	}

	if (cmdOptions.experimentalOpen) {
		if (isNaN(cmdOptions.experimentalOpen)) {
			console.error(`Invalid --experimental-open option:${cmdOptions.experimentalOpen}`);
			process.exit(1);
		} else {
			const experimentalOpenValue = parseInt(cmdOptions.experimentalOpen, 10);
			serverGlobalConfig.experimentalOpen = experimentalOpenValue > 10 ? 10 : experimentalOpenValue;
		}
	}

	const targetDirs: string[] = cliConfigParam.targetDirs ?? [];
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const versionsJson = require("./engineFilesVersion.json");
	const engineFilesVersions = Object.keys(versionsJson).map(key => `v${versionsJson[key].version}`);
	console.log(`Included engine-files: ${engineFilesVersions.join(", ")}`);
	targetDirs.forEach(dir => {
		const contentPath = path.join(dir, "game.json");
		if (!fs.existsSync(contentPath)) {
			getSystemLogger().error(`Not found :${contentPath}`);
			process.exit(1);
		}
	});

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
	let httpServer;
	if (cliConfigParam.sslCert && cliConfigParam.sslKey) {
		const keyPath = path.resolve(process.cwd(), cliConfigParam.sslKey);
		const certPath = path.resolve(process.cwd(), cliConfigParam.sslCert);
		if (!fs.existsSync(keyPath)) {
			getSystemLogger().error(`--ssl-key option parameter ${cliConfigParam.sslKey} not found.`);
			process.exit(1);
		}
		if (!fs.existsSync(certPath)) {
			getSystemLogger().error(`--ssl-cert option parameter ${cliConfigParam.sslCert} not found.`);
			process.exit(1);
		}

		serverGlobalConfig.protocol = "https";
		const https = await import("https");
		const options = {
			key: fs.readFileSync(keyPath),
			cert: fs.readFileSync(certPath)
		};
		httpServer = https.createServer(options, app);
	} else if (cliConfigParam.sslCert || cliConfigParam.sslKey) {
		if (cliConfigParam.sslCert && !cliConfigParam.sslKey) {
			getSystemLogger().error("Please specify the --ssl-key option.");
		}
		if (!cliConfigParam.sslCert && cliConfigParam.sslKey) {
			getSystemLogger().error("Please specify the --ssl-cert option.");
		}
		process.exit(1);
	} else {
		const server = await import("http");
		httpServer = server.createServer(app);
	}

	if (cliConfigParam.corsAllowOrigin === "null") {
		cliConfigParam.corsAllowOrigin = undefined;
		getSystemLogger().warn("null is disabled as --cors-allow-origin option parameter.");
	}

	let io: socketio.Server;
	if (cliConfigParam.corsAllowOrigin) {
		io = new socketio.Server(httpServer, {
			parser,
			cors: {
				origin: cliConfigParam.corsAllowOrigin
			}
		});
	} else {
		io = new socketio.Server(httpServer, { parser });
	}

	if (cliConfigParam.watch && cliConfigParam.targetDirs) {
		console.log("Start watching contents");
		for (let i = 0; i < cliConfigParam.targetDirs.length; i++) {
			await watchContent(cliConfigParam.targetDirs[i], async (err: any, modTargetFlag: ModTargetFlags) => {
				if (err) {
					getSystemLogger().error(err.message);
				}
				const timestamp = (new Date()).toTimeString().split(" ")[0]; // "hh:mm:dd"
				const modifiedTarget = (modTargetFlag === ModTargetFlags.GameJson) ? "game.json" : "assets";
				console.log(`[${chalk.gray(timestamp)}] Reflect changes of ${modifiedTarget}`);
				// コンテンツに変更があったらplayを新規に作り直して再起動
				const contentId = `${i}`;
				const targetPlayIds: string[] = [];
				// 対象のコンテンツIDしか分からないので先に対応するコンテンツのrunnerを全て停止させる
				const playIds = playStore.getPlayIdsFromContentId(contentId);
				for (const playId of playIds) {
					const runners = playStore.getPlayInfo(playId)?.runners;
					if (runners) {
						for (const runner of runners)
							await runnerStore.stopRunner(runner.runnerId);
					}
					targetPlayIds.push(playId);
				};
				if (targetPlayIds.length === 0)
					return;
				const playId = await playStore.createPlay({
					contentLocator: new ServerContentLocator({ contentId }),
					inheritsJoinedFromLatest: isServiceTypeNicoliveLike(serverGlobalConfig.targetService),
					inheritsAudioFromLatest: true
				});
				const token = amflowManager.createPlayToken(playId, "", "", true, {});
				const amflow = playStore.createAMFlow(playId);
				await runnerStore.createAndStartRunner({ playId, isActive: true, token, amflow, contentId, isPaused: false });
				await playStore.resumePlayDuration(playId);
				targetPlayIds.forEach(id => {
					io.emit("playBroadcast", { playId: id, message: { type: "switchPlay", nextPlayId: playId } });
				});
			});
		}
	}

	app.set("views", path.join(__dirname, "..", "..", "views"));
	app.set("view engine", "ejs");

	app.use((_req, res, next) => {
		res.removeHeader("X-Powered-By");
		res.removeHeader("ETag");
		res.header("Cache-Control", ["private", "no-store", "no-cache", "must-revalidate", "proxy-revalidate"].join(","));
		res.header("no-cache", "Set-Cookie");
		next();
	});
	app.use(bodyParser.json());

	app.use("^\/$", (_req, res, _next) => res.redirect("/public/"));

	if (cliConfigParam.corsAllowOrigin) {
		app.use(cors({ origin: cliConfigParam.corsAllowOrigin }));
	}

	if (process.env.ENGINE_FILES_V3_PATH) {
		const engineFilesPath = path.resolve(process.cwd(), process.env.ENGINE_FILES_V3_PATH);
		if (!fs.existsSync(engineFilesPath)) {
			console.error(`ENGINE_FILES_V3_PATH: ${engineFilesPath} was not found.`);
			process.exit(1);
		}
		app.use("/public/external/engineFilesV3*.js", (_req, res, _next) => {
			res.send(fs.readFileSync(engineFilesPath));
		});
	}

	if (process.env.PLAYLOG_CLIENT_PATH) {
		const playlogClientSrc = fs.readFileSync(path.resolve(process.cwd(), process.env.PLAYLOG_CLIENT_PATH)).toString();
		app.get("/dynamic/playlogClientV*.js", (req, res, _next) => {
			const apiEndpointUrl = `${req.protocol}://${req.header("host")}`;
			const socketEndpointUrl = `${req.protocol.includes("https") ? "wss" : "ws"}://${req.header("host")}`;
			const responseBody =
				playlogClientSrc.replace(/:SERVE_API_ENDPOINT_URL_PLACEHOLDER:/, apiEndpointUrl)
					.replace(/:SERVE_SOCKET_ENDPOINT_URL_PLACEHOLDER:/, socketEndpointUrl);
			res.contentType("text/javascript");
			res.send(responseBody);
		});
	}

	// agvplugin.js は内部デバッグ用のファイルで通常存在しない。その場合でも script 要素で読み込めるようにしておく
	if (!fs.existsSync(path.join(__dirname, "..", "..", "www", "internal", "agvplugin.js"))) {
		app.get("/internal/agvplugin.js", (_req, res, _next) => {
			res.contentType("text/javascript");
			res.send("");
		});
	}

	app.use("/public/", express.static(path.join(__dirname, "..", "..", "www", "public")));
	app.use("/internal/", express.static(path.join(__dirname, "..", "..", "www", "internal")));
	app.use("/api/", createApiRouter({ playStore, runnerStore, playerIdStore, amflowManager, io }));
	app.use("/contents/", createContentsRouter({ targetDirs }));
	app.use("/health-check/", createHealthCheckRouter({ playStore }));

	io.on("connection", (socket: socketio.Socket) => {
		amflowManager.setupSocketIOAMFlow(socket);
	});
	// TODO 全体ブロードキャストせず該当するプレイにだけ通知するべき？
	playStore.onPlayStatusChange.add(arg => {
		io.emit("playStatusChange", arg);
	});
	playStore.onPlayDurationStateChange.add(arg => {
		io.emit("playDurationStateChange", arg);
	});
	playStore.onPlayAudioStateChange.add(arg => {
		io.emit("playAudioStateChange", arg);
	});
	playStore.onPlayCreate.add(arg => {
		io.emit("playCreate", arg);
	});
	playStore.onPlayerJoin.add(arg => {
		io.emit("playerJoin", arg);
	});
	playStore.onPlayerLeave.add(arg => {
		io.emit("playerLeave", arg);
	});
	playStore.onClientInstanceAppear.add(arg => {
		io.emit("clientInstanceAppear", arg);
	});
	playStore.onClientInstanceDisappear.add(arg => {
		io.emit("clientInstanceDisappear", arg);
	});
	runnerStore.onRunnerCreate.add(arg => {
		io.emit("runnerCreate", arg);
	});
	runnerStore.onRunnerRemove.add(arg => {
		io.emit("runnerRemove", arg);
	});
	runnerStore.onRunnerPause.add(arg => {
		io.emit("runnerPause", arg);
	});
	runnerStore.onRunnerResume.add(arg => {
		io.emit("runnerResume", arg);
	});
	runnerStore.onRunnerPutStartPoint.add(arg => {
		const { playId, startPoint } = arg;
		const startPointHeader = { frame: startPoint.frame, timestamp: startPoint.timestamp };
		io.emit("putStartPoint", { startPointHeader, playId } as PutStartPointEvent);
	});

	let loadedPlaylogPlayId: string;
	if (cliConfigParam.debugPlaylog) {
		const absolutePath = path.resolve(process.cwd(), cliConfigParam.debugPlaylog);
		if (!fs.existsSync(absolutePath)) {
			getSystemLogger().error(`Can not find ${absolutePath}`);
			process.exit(1);
		}
		// 現状 playlog は一つしか受け取らない。それは contentId: 0 のコンテンツの playlog として扱う。
		const contentLocator = new ServerContentLocator({contentId: "0"});
		try {
			// eslint-disable-next-line @typescript-eslint/no-var-requires
			const playlog = require(absolutePath) as DumpedPlaylog;
			loadedPlaylogPlayId = await playStore.createPlay({ contentLocator, playlog });
		} catch (e) {
			getSystemLogger().error(e.message);
			process.exit(1);
		}
	}

	httpServer.listen(serverGlobalConfig.port, async () => {
		if (serverGlobalConfig.port < 1024) {
			getSystemLogger().warn("Akashic Serve is a development server which is not appropriate for public release. " +
				`We do not recommend to listen on a well-known port ${serverGlobalConfig.port}.`);
		}
		let url = `${serverGlobalConfig.protocol}://${serverGlobalConfig.hostname}:${serverGlobalConfig.port}/public`;
		// サーバー起動のログに関してはSystemLoggerで使用していない色を使いたいので緑を選択
		console.log(chalk.green(`Hosting ${targetDirs.join(", ")} on ${serverGlobalConfig.protocol}://${serverGlobalConfig.hostname}:${serverGlobalConfig.port}`)); // eslint-disable-line max-len
		if (loadedPlaylogPlayId) {
			console.log(`play(id: ${loadedPlaylogPlayId}) read playlog(path: ${path.resolve(process.cwd(), cmdOptions.debugPlaylog)}).`);
			url += `?playId=${loadedPlaylogPlayId}&mode=replay`;
			console.log(`if access ${url}, you can show this play.`);
		}

		if (cliConfigParam.openBrowser) {
			await open(url);
		}
	});
}

// TODOこのファイルを改名してcli.tsにする
export async function run(argv: any): Promise<void> {
	const ver = JSON.parse(fs.readFileSync(path.resolve(__dirname, "..", "..", "package.json"), "utf8")).version;
	const commander = new Command();
	commander
		.version(ver)
		.description("Development server for Akashic Engine to debug multiple-player games")
		.usage("[options] <gamepath>")
		.option("-p, --port <port>", `The port number to listen. default: ${serverGlobalConfig.port}`, (x => parseInt(x, 10)))
		.option("-H, --hostname <hostname>", `The host name of the server. default: ${serverGlobalConfig.hostname}`)
		.option("-v, --verbose", "Display detailed information on console.")
		.option("-A, --no-auto-start", "Wait automatic startup of contents.")
		.option("-s, --target-service <service>", `Simulate the specified service. arguments: ${SERVICE_TYPES}`)
		.option("-w, --watch", "Watch directories of asset")
		.option("--server-external-script <path>",
			"Evaluate the given JS and assign it to Game#external of the server instances")
		.option("--debug-playlog <path>", "Specify path of playlog-json.")
		.option("--debug-untrusted", "An internal debug option")
		.option("--debug-trusted-iframe", "An internal debug option")
		.option("--debug-proxy-audio", "An internal debug option")
		.option("--debug-pause-active", "An internal debug options: start with paused the active instance")
		.option("--debug-disable-feat-check", "Disable sentinel for environment.features")
		.option("--allow-external", "Read the URL allowing external access from sandbox.config.js")
		.option("-B, --no-open-browser", "Disable to open a browser window at startup")
		.option("--preserve-disconnected", "Disable auto closing for disconnected windows.")
		.option("--experimental-open <num>",
			"EXPERIMENTAL: Open <num> browser windows at startup. The upper limit of <num> is 10.") // TODO: open-browser と統合
		.option("--ssl-cert <certificatePath>", "Specify path to an SSL/TLS certificate to use HTTPS")
		.option("--ssl-key <privatekeyPath>", "Specify path to an SSL/TLS privatekey to use HTTPS")
		.option("--cors-allow-origin <origin>", "Specify origin for Access-Control-Allow-Origin")
		.parse(argv);

	const options = commander.opts();
	CliConfigurationFile.read(path.join(options.cwd || process.cwd(), "akashic.config.js"), async (error, configuration) => {
		if (error) {
			console.error(error);
			process.exit(1);
		}

		const conf = configuration!.commandOptions?.serve ?? {};
		const cliConfigParam: CliConfigServe = {
			port: options.port ?? conf.port,
			hostname: options.hostname ?? conf.hostname,
			verbose: options.verbose ?? conf.verbose,
			autoStart: options.autoStart ?? conf.autoStart,
			targetService: options.targetService ?? conf.targetService,
			debugPlaylog: options.debugPlaylog ?? conf.debugPlaylog,
			debugUntrusted: options.debugUntrusted ?? conf.debugUntrusted,
			debugTrustedIframe: options.debugTrustedIframe ?? conf.debugTrustedIframe,
			debugProxyAudio: options.debugProxyAudio ?? conf.debugProxyAudio,
			debugPauseActive: options.debugPauseActive ?? conf.debugPauseActive,
			debugDisableFeatCheck: options.debugDisableFeatCheck ?? conf.debugDisableFeatCheck,
			allowExternal: options.allowExternal ?? conf.allowExternal,
			targetDirs: commander.args.length > 0 ? commander.args : (conf.targetDirs ?? [process.cwd()]),
			openBrowser: options.openBrowser ?? conf.openBrowser,
			preserveDisconnected: options.preserveDisconnected ?? conf.preserveDisconnected,
			watch: options.watch ?? conf.watch,
			experimentalOpen: options.experimentalOpen ?? conf.experimentalOpen,
			sslCert: options.sslCert ?? conf.sslCert,
			sslKey: options.sslKey ?? conf.sslKey,
			corsAllowOrigin: options.corsAllowOrigin ?? conf.corsAllowOrigin
		};
		await cli(cliConfigParam, options);
	});
}
