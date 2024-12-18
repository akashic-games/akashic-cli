import { createRequire } from "module";
import type { CliConfigInit } from "@akashic/akashic-cli-commons/lib/CliConfig/CliConfigInit.js";
import { ConsoleLogger } from "@akashic/akashic-cli-commons/lib/ConsoleLogger.js";
import { Command } from "commander";
import { promiseInit } from "./init/init.js";
import { listTemplates } from "./list/listTemplates.js";
import { load } from "@akashic/akashic-cli-commons/lib/FileSystem.js";

async function cli(param: CliConfigInit): Promise<void> {
	const logger = new ConsoleLogger({ quiet: param.quiet });
	try {
		if (param.list) {
			await listTemplates({
				repository: param.repository,
				logger
			});
		} else {
			await promiseInit({
				cwd: param.cwd,
				repository: param.repository,
				type: param.type,
				logger: logger,
				forceCopy: param.force,
				skipAsk: param.yes
			});
		}
	} catch (err) {
		logger.error(err, err.cause);
		process.exit(1);
	}
}

const require = createRequire(import.meta.url);
const { version } = require("../package.json");

const commander = new Command();
commander
	.version(version);
commander
	.description("Generate project skeleton and initialize game.json.")
	.option("-C, --cwd <dir>", "The directory to initialize")
	.option("-q, --quiet", "Suppress output")
	.option("-r, --repository <reponame>", "Template repository to search template")
	.option(
		"-t, --type <type>",
		"Type of template or a Git repository name (on GitHub, requires git command)." +
		" e.g. github:<owner>/<repo>\n See README file for details."
	)
	.option("-l, --list", "Display available template list")
	.option("-f, --force", "Overwrite existing files")
	.option("-y, --yes", "Initialize without user input");

export async function run(argv: string[]): Promise<void> {
	commander.parse(argv);
	const options = commander.opts();

	let configuration;
	try { 
		configuration = await load(options.cwd || process.cwd());
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
	const conf = configuration!.commandOptions?.init ?? {};
	await cli({
		cwd: options.cwd ?? conf.cwd,
		quiet: options.quiet ?? conf.quiet,
		repository: options.repository,
		type: options.type ?? conf.type,
		list: options.list ?? conf.list,
		yes: options.yes ?? conf.yes,
		force: options.force ?? conf.force
	});
}
