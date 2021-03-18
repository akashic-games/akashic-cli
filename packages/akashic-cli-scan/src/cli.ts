import * as fs from "fs";
import * as path from "path";
import { Command } from "commander";
import { ConsoleLogger, CliConfigurationFile, CliConfigScanAsset, CliConfigScanGlobalScripts } from "@akashic/akashic-cli-commons";
import { promiseScanAsset, promiseScanNodeModules, ScanAssetParameterObject } from "./scan";

var ver = JSON.parse(fs.readFileSync(path.resolve(__dirname, "..", "package.json"), "utf8")).version;
const commander = new Command();
commander
	.description("Update various properties of game.json")
	.version(ver);

commander
	.command("asset [target]")
	.description("Update 'assets' property of game.json")
	.option("-C, --cwd <dir>", "The directory incluedes game.json")
	.option("-q, --quiet", "Suppress output")
	.option("--use-path-asset-id", "Resolve Asset IDs from these path instead of name")
	.option("--update-asset-id", "Update previously registered Asset IDs")
	.option(
		"--include-ext-to-asset-id",
		"Include file extensions to the Asset IDs (if specify `--use-path-asset-id` option, default value is true, otherwise false)"
	)
	.option("--image-asset-dir <dir>", "specify ImageAsset directory", commanderArgsCoordinater)
	.option("--audio-asset-dir <dir>", "specify AudioAsset directory", commanderArgsCoordinater)
	.option("--script-asset-dir <dir>", "specify ScriptAsset directory", commanderArgsCoordinater)
	.option("--text-asset-dir <dir>", "specify TextAsset directory", commanderArgsCoordinater)
	.option("--text-asset-extension <extension>", "specify TextAsset extension", commanderArgsCoordinater)
	.action((target: string, opts: CliConfigScanAsset = {}) => {
		CliConfigurationFile.read(path.join(opts["cwd"] || process.cwd(), "akashic.config.js"), (error, configuration) => {
			if (error) {
				console.error(error);
				process.exit(1);
			}

			const conf = configuration.commandOptions.scan ? (configuration.commandOptions.scan.asset || {}) : {};
			var logger = new ConsoleLogger({ quiet: opts.quiet || conf.quiet });
			var assetScanDirectoryTable = {
				audio: opts.audioAssetDir || conf.audioAssetDir,
				image: opts.imageAssetDir || conf.imageAssetDir,
				script: opts.scriptAssetDir || conf.scriptAssetDir,
				text: opts.textAssetDir || conf.textAssetDir
			};
			var assetExtension = {
				text: opts.textAssetExtension || conf.textAssetExtension
			};
			const parameter: ScanAssetParameterObject = {
				target: target,
				cwd: opts.cwd ?? conf.cwd,
				logger: logger,
				resolveAssetIdsFromPath: opts.usePathAssetId ?? conf.usePathAssetId,
				forceUpdateAssetIds: opts.updateAssetId ?? conf.updateAssetId,
				includeExtensionToAssetId: opts.usePathAssetId || (opts.includeExtensionToAssetId ?? conf.includeExtensionToAssetId),
				assetScanDirectoryTable: assetScanDirectoryTable,
				assetExtension: assetExtension
			};
			promiseScanAsset(parameter)
				.catch((err: any) => {
					logger.error(err);
					process.exit(1);
				});
		});
	})
	.on("--help", () => {
		console.log("  Target:");
		console.log("");
		console.log("    image");
		console.log("    audio");
		console.log("    script");
		console.log("    text");
		console.log("    all");
		console.log("");
	});

commander
	.command("globalScripts")
	.description("Update 'globalScripts' property of game.json")
	.option("-C, --cwd <dir>", "The directory incluedes game.json")
	.option("-e, --from-entry-point", "Scan from the entrypoint instead of `npm ls`")
	.option("-q, --quiet", "Suppress output")
	.option("--no-omit-packagejson", "Add package.json of each module to the globalScripts property (to support older Akashic Engine)")
	.action((opts: CliConfigScanGlobalScripts = {}) => {
		var logger = new ConsoleLogger({ quiet: opts.quiet });
		promiseScanNodeModules({ cwd: opts.cwd, logger: logger, fromEntryPoint: opts.fromEntryPoint, noOmitPackagejson: !opts.omitPackagejson })
			.catch((err: any) => {
				logger.error(err);
				process.exit(1);
			});
	});

export function run(argv: string[]): void {
	commander.parse(argv);
	if (argv.length < 3
		|| !argv[2].match(/^(asset|globalScripts)$/)) {
		commander.help();
	}
}

function commanderArgsCoordinater (val: any, ret: any) {
	ret = ret || [];
	ret.push(val);
	return ret;
}
