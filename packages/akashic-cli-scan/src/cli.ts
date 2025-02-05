import { createRequire } from "module";
import type { CliConfigScanAsset, CliConfigScanGlobalScripts } from "@akashic/akashic-cli-commons/lib/CliConfig/CliConfigScan.js";
import { ConsoleLogger } from "@akashic/akashic-cli-commons/lib/ConsoleLogger.js";
import { Command } from "commander";
import type { ScanAssetParameterObject } from "./scanAsset.js";
import { scanAsset } from "./scanAsset.js";
import { scanNodeModules, ScanNodeModulesParameterObject } from "./scanNodeModules.js";
import type { AssetTargetType } from "./types.js";
import { watchAsset } from "./watchAsset.js";
import { load } from "@akashic/akashic-cli-commons/lib/FileSystem.js";

const require = createRequire(import.meta.url);
const { version } = require("../package.json");

const commander = new Command();
commander
	.description("Update various properties of game.json")
	.version(version);

commander
	.command("asset [target]")
	.description("Update 'assets' property of game.json")
	.option("-C, --cwd <dir>", "The directory includes game.json")
	.option("-q, --quiet", "Suppress output")
	.option("-w, --watch", "Watch Directories of asset (deprecated)")
	.option("--use-path-asset-id", "Resolve Asset IDs from these path instead of name")
	.option("--update-asset-id", "Update previously registered Asset IDs")
	.option(
		"--include-ext-to-asset-id",
		"Include file extensions to the Asset IDs (if specify `--use-path-asset-id` option, default value is true, otherwise false)"
	)
	.option("--image-asset-dir <dir...>", "specify ImageAsset directory")
	.option("--audio-asset-dir <dir...>", "specify AudioAsset directory")
	.option("--script-asset-dir <dir...>", "specify ScriptAsset directory")
	.option("--text-asset-dir <dir...>", "specify TextAsset directory")
	.option("--text-asset-extension <extension...>", "specify TextAsset extension")
	.action(async (target: AssetTargetType, opts: CliConfigScanAsset = {}) => {
		let configuration;
		try { 
			configuration = await load(opts.cwd || process.cwd());
		} catch (error) {
			console.error(error);
			process.exit(1);
		}
		const conf = configuration!.commandOptions?.scan?.asset ?? {};
		const logger = new ConsoleLogger({ quiet: opts.quiet ?? conf.quiet });
		const assetScanDirectoryTable = {
			audio: opts.audioAssetDir ?? conf.audioAssetDir,
			image: opts.imageAssetDir ?? conf.imageAssetDir,
			script: opts.scriptAssetDir ?? conf.scriptAssetDir,
			text: opts.textAssetDir ?? conf.textAssetDir
		};
		const assetExtension = {
			text: opts.textAssetExtension ?? conf.textAssetExtension
		};
		const parameter: ScanAssetParameterObject = {
			target,
			cwd: opts.cwd ?? conf.cwd,
			logger,
			resolveAssetIdsFromPath: opts.usePathAssetId ?? conf.usePathAssetId,
			forceUpdateAssetIds: opts.updateAssetId ?? conf.updateAssetId,
			includeExtensionToAssetId: opts.usePathAssetId ?? (opts.includeExtensionToAssetId ?? conf.includeExtensionToAssetId),
			assetScanDirectoryTable,
			assetExtension
		};
		if (opts.watch) {
			logger.warn("--watch option is deprecated. DO NOT USE.");
			watchAsset(parameter, (err) => {
				if (err) {
					logger.error(err.message);
					process.exit(1);
				}
			});
		} else {
			scanAsset(parameter)
				.catch((err: Error) => {
					logger.error(err.message);
					process.exit(1);
				});
		}
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
	.option("-C, --cwd <dir>", "The directory includes game.json")
	.option("-e, --from-entry-point", "Scan from the entry point instead of `npm ls`")
	.option("-q, --quiet", "Suppress output")
	.option("--no-omit-packagejson", "Add package.json of each module to the globalScripts property (to support older Akashic Engine)")
	.option("--use-mmp", "Use moduleMainPaths in game.json")
	.option("--use-mms", "Use moduleMainScripts in game.json (to support older Akashic Engine)")
	.action(async (opts: CliConfigScanGlobalScripts = {}) => {
		let configuration;
		try { 
			configuration = await load(opts.cwd || process.cwd());
		} catch (error) {
			console.error(error);
			process.exit(1);
		}

		const conf = configuration!.commandOptions?.scan?.globalScripts ?? {};
		const logger = new ConsoleLogger({ quiet: opts.quiet });
		const parameter: ScanNodeModulesParameterObject = {
			cwd: opts.cwd ?? conf.cwd,
			logger,
			fromEntryPoint: opts.fromEntryPoint ?? conf.fromEntryPoint,
			omitPackagejson: opts.omitPackagejson ?? conf.omitPackagejson,
			useMmp: opts.useMmp ?? conf.useMmp,
			useMms: opts.useMms ?? conf.useMms,
		};
		scanNodeModules(parameter)
			.catch((err: Error) => {
				logger.error(err.message);
				process.exit(1);
			});
	});

export function run(argv: string[]): void {
	commander.parse(argv);
	if (argv.length < 3 || !argv[2].match(/^(asset|globalScripts)$/)) {
		commander.help();
	}
}
