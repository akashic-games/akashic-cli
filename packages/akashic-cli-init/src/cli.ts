import * as fs from "fs";
import * as path from "path";
import { CliConfigInit } from "@akashic/akashic-cli-commons/lib/CliConfig/CliConfigInit";
import { CliConfigurationFile } from "@akashic/akashic-cli-commons/lib/CliConfig/CliConfigurationFile";
import { ConsoleLogger } from "@akashic/akashic-cli-commons/lib/ConsoleLogger";
import { Command } from "commander";
import * as Prompt from "prompt";
import { DEFAULT_TEMPLATE_REPOSITORY } from "./common/InitCommonOptions";
import { promiseInit } from "./init/init";
import { listTemplates } from "./list/listTemplates";

async function cli(param: CliConfigInit): Promise<void> {
	const logger = new ConsoleLogger({ quiet: param.quiet });
	if (param.repository) {
		if (/(^(github|ghe):)|(\.git$)/.test(param.repository)) {
			logger.warn("Misused -r, --repository options. Use -t option for Github repository");
		}
		if (param.repository !== DEFAULT_TEMPLATE_REPOSITORY) {
			const ret = await confirmAccessToUrl(param.repository);
			if (!ret) process.exit(1);
		}
	}

	if (param.type) {
		const m = param.type.match(/(.+):(.+)\/(.+)/) ?? [];
		if (m[1] === "github") {
			const owner = m[2];
			if (owner !== "akashic-games") {
				const ret = await confirmAccessToUrl(param.type);
				if (!ret) process.exit(1);
			}
		}

		if (m[1] === "ghe") {
			// TODO: 許可した URL を.akashicrc に保存する時に実装する
		}
	}

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

var ver = JSON.parse(fs.readFileSync(path.resolve(__dirname, "..", "package.json"), "utf8")).version;

const commander = new Command();
commander
	.version(ver);
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
			repository: options.repository,
			type: options.type ?? conf.type,
			list: options.list ?? conf.list,
			yes: options.yes ?? conf.yes,
			force: options.force ?? conf.force
		});
	});
}

function confirmAccessToUrl(url: string): Promise<boolean> {
	return new Promise<boolean>((resolve: (result: boolean) => void, reject: (err: any) => void) => {
		const schema = {
			properties: {
				confirm: {
					pattern: /^(yes|no|y|n)$/gi,
					description: `Allow access to this URL(${url})? y/n`,
					required: true,
					default: "y"
				}
			}
		};
		Prompt.start();
		Prompt.get(schema, (err: any, result: any) => {
			const value = result.confirm.toLowerCase();
			const ret = value === "y" || value === "yes";
			if (err) {
				reject(err);
			} else {
				resolve(ret);
			}
		});
	});
}
