import * as fs from "fs";
import * as path from "path";
import { CliConfigInit } from "@akashic/akashic-cli-commons/lib/CliConfig/CliConfigInit";
import { CliConfigurationFile } from "@akashic/akashic-cli-commons/lib/CliConfig/CliConfigurationFile";
import { ConsoleLogger } from "@akashic/akashic-cli-commons/lib/ConsoleLogger";
import { Command } from "commander";
import { promiseInit } from "./init/init";
import { listTemplates } from "./list/listTemplates";

async function cli(param: CliConfigInit): Promise<void> {
	const logger = new ConsoleLogger({ quiet: param.quiet });
	try {
		if (param.list) {
			await listTemplates({
				// TODO: コマンドラインから指定可能にする
				// repository: param.repository,
				logger
			});
		} else {
			await promiseInit({
				cwd: param.cwd,
				// TODO: コマンドラインから指定可能にする
				// repository: param.repository,
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

var ver = JSON.parse(fs.readFileSync(path.resolve(__dirname, "..", "package.json"), "utf8")).version;

// TODO: 未使用の --regsitry オプションを --repository に変えて利用可能にする
const commander = new Command();
commander
	.version(ver);
commander
	.description("Generate project skeleton and initialize game.json.")
	.option("-C, --cwd <dir>", "The directory to initialize")
	.option("-q, --quiet", "Suppress output")
	.option("-r, --registry <regname>", "Template registry to search template")
	.option(
		"-t, --type <type>",
		"Type of template or a Git repository name (on GitHub, requires git command)." +
		" e.g. github:<owner>/<repo>\n See README file for details."
	)
	.option("-l, --list", "Display available template list")
	.option("-f, --force", "Overwrite existing files")
	.option("-y, --yes", "Initialize without user input");

export function run(argv: string[]): void {
	commander.parse(argv);
	const options = commander.opts();

	CliConfigurationFile.read(path.join(options.cwd || process.cwd(), "akashic.config.js"), (error, configuration) => {
		if (error) {
			console.error(error);
			process.exit(1);
		}

		const conf = configuration.commandOptions.init || {};
		cli({
			cwd: options.cwd ?? conf.cwd,
			quiet: options.quiet ?? conf.quiet,
			type: options.type ?? conf.type,
			list: options.list ?? conf.list,
			yes: options.yes ?? conf.yes,
			force: options.force ?? conf.force
		});
	});
}
