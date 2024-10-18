import * as fs from "fs";
import { createRequire } from "module";
import * as path from "path";
import { fileURLToPath } from "url";
import * as cmn from "@akashic/akashic-cli-commons";
import type { AssetConfigurationMap, ImageAssetConfigurationBase } from "@akashic/game-configuration";
import type { SandboxConfiguration } from "@akashic/sandbox-configuration";
import fsx from "fs-extra";
import { minify_sync } from "terser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

export interface ConvertTemplateParameterObject {
	output: string;
	logger: cmn.Logger;
	strip: boolean;
	minify: boolean;
	terser: unknown;
	magnify: boolean;
	force: boolean;
	source: string;
	cwd: string;
	unbundleText: boolean;
	injects?: string[];
	exportInfo?: {
		version: string;
		option: string;
	};
	autoSendEventName?: string | boolean;
	autoGivenArgsName?: string;
	sandboxConfigJsCode?: string;
	omitUnbundledJs?: boolean;
	debugOverrideEngineFiles?: string;
}

export function extractAssetDefinitions (conf: cmn.Configuration, type: string): string[] {
	const assets = conf._content.assets;
	const assetNames = Object.keys(assets);
	return assetNames.filter((assetName) => assets[assetName].type === type);
}

export function copyAssetFilesStrip(
	inputPath: string, outputPath: string,
	assets: AssetConfigurationMap, options: ConvertTemplateParameterObject): void {
	options.logger.info("copying stripped fileset...");
	const assetNames = Object.keys(assets);
	assetNames.filter((assetName) => {
		return assets[assetName].type !== "script" && (options.unbundleText || assets[assetName].type !== "text");
	}).forEach((assetName) => {
		const assetPath = assets[assetName].path;
		const assetDir = path.dirname(assetPath);
		fsx.mkdirsSync(path.resolve(outputPath, assetDir));
		const dst = path.join(outputPath, assetPath);
		if (assets[assetName].type === "audio") {
			cmn.KNOWN_AUDIO_EXTENSIONS.forEach((ext) => {
				try {
					fsx.copySync(
						path.resolve(inputPath, assetPath) + ext,
						dst + ext,
						{overwrite: options.force}
					);
				} catch (e) {
					if (e.code !== "ENOENT") {
						options.logger.error("Error while copying: " + e.message);
					}
				}
			});
		} else {
			fsx.copySync(
				path.resolve(inputPath, assetPath),
				dst,
				{overwrite: options.force}
			);
		}
	});
}

export function copyAssetFiles(inputPath: string, outputPath: string, options: ConvertTemplateParameterObject ): void {
	options.logger.info("copying files...");
	const scriptPath = path.resolve(inputPath, "script");
	const textPath = path.resolve(inputPath, "text");
	const isAssetToBeCopied = (src: string): boolean => {
		return path.relative(scriptPath, src)[0] === "." && (options.unbundleText || path.relative(textPath, src)[0] === ".");
	};
	try {
		const files = cmn.Util.readdirRecursive(inputPath);
		files.forEach(p => {
			cmn.Util.mkdirpSync(path.dirname(path.resolve(outputPath, p)));
			if (isAssetToBeCopied(path.resolve(inputPath, p))) {
				fs.writeFileSync(path.resolve(outputPath, p), fs.readFileSync(path.resolve(inputPath, p)));
			}
		});
	} catch (e) {
		options.logger.error("Error while copying: " + e.message);
	}
}

export function encodeText(text: string): string {
	return text.replace(/[\u2028\u2029'"\\\b\f\n\r\t\v%]/g, encodeURIComponent);
}

export function wrap(code: string, terser?: unknown, exports: string[] = []): string {
	const preScript = "(function(exports, require, module, __filename, __dirname) {";
	let postScript: string = "";
	for (const key of exports) {
		postScript += `exports["${key}"] = typeof ${key} !== "undefined" ? ${key} : undefined;\n`;
	}
	postScript += "})(g.module.exports, g.module.require, g.module, g.filename, g.dirname);";
	const ret = preScript + "\n" + (terser ? minify_sync(code, terser).code : code) + "\n" + postScript + "\n";
	return ret;
}

export function getDefaultBundleScripts(
	templatePath: string,
	version: string,
	options: ConvertTemplateParameterObject,
	bundleText: boolean = true,
	overrideEngineFilesPath?: string
): any {
	let engineFilePath: string;
	let engineFilesVariable: string;

	if (overrideEngineFilesPath) {
		validateEngineFilesName(overrideEngineFilesPath, version);
		engineFilePath = path.resolve(overrideEngineFilesPath);
		engineFilesVariable = path.basename(overrideEngineFilesPath, ".js");
	} else {
		engineFilePath = resolveEngineFilesPath(version);
		engineFilesVariable = path.basename(engineFilePath, ".js");
	}

	const preloadScript = `
		window.engineFiles = ${engineFilesVariable};
		window.g = engineFiles.akashicEngine;
		(function() {
			var originalRequire = window.require;
			window.require = function(moduleName) {
				switch(moduleName) {
					case "@akashic/akashic-engine":
						return engineFiles.akashicEngine;
					default:
						return this.call(this, moduleName);
				}
			};
		})();
	`;
	const postloadScriptNames =
		["sandbox.js", "initGlobals.js"];
	if (version === "3") {
		postloadScriptNames.push("pdi/LocalScriptAssetV3.cjs");
		if (bundleText) {
			postloadScriptNames.push("pdi/LocalTextAssetV3.cjs");
		}
	} else {
		postloadScriptNames.push("pdi/LocalScriptAsset.cjs");
		if (bundleText) {
			postloadScriptNames.push("pdi/LocalTextAsset.cjs");
		}
	}
	if (version === "1") postloadScriptNames.push("logger.js");

	let preloadScripts = [loadScriptFile(engineFilePath)];
	preloadScripts.push(preloadScript);

	let postloadScripts = postloadScriptNames.map((fileName) => {
		const filePath = path.resolve(__dirname, "..", "..", "lib", templatePath, "js", fileName);
		return loadScriptFile(filePath);
	});

	if (options.minify) {
		// NOTE: エンジン側が提供するコードを mangling されると動作に支障をきたす可能性があるため、この部分はデフォルト設定を与える
		preloadScripts = preloadScripts.map(script => minify_sync(script).code);
		postloadScripts = postloadScripts.map(script => minify_sync(script).code);
	}
	return {
		preloadScripts,
		postloadScripts
	};
}

export function getDefaultBundleStyle(templatePath: string): string {
	const filepath = path.resolve(__dirname, "..", "..", "lib", templatePath, "css", "style.css");
	return fs.readFileSync(filepath, "utf8").replace(/\r\n|\r/g, "\n");
}

export function getInjectedContents(baseDir: string, injects: string[]): string[] {
	let injectedContents: string[] = [];
	for (let i = 0; i < injects.length; i++) {
		const filePath = path.join(baseDir, injects[i]);
		if (fs.statSync(filePath).isDirectory()) {
			injectedContents = injectedContents.concat(getFileContentsFromDirectory(filePath));
		} else {
			injectedContents.push(fs.readFileSync(filePath, "utf8").replace(/\r\n|\r/g, "\n"));
		}
	}
	return injectedContents;
}

export async function validateEs5Code(fileName: string, code: string): Promise<string[]> {
	const errInfo = await cmn.LintUtil.validateEs5Code(code);
	return errInfo.map(info => `${fileName}(${info.line}:${info.column}): ${info.message}`);
}

export function readSandboxConfigJs(sourceDir: string): string {
	const sandboxConfigJsPath = path.join(sourceDir, "sandbox.config.js");
	return fs.readFileSync(sandboxConfigJsPath, "utf8").replace(/\r\n|\r/g, "\n");
}

/**
 * 指定のgameJson中の全てのImageAssetに untainted:true を付与する
 */
export function addUntaintedToImageAssets(gameJson: cmn.GameConfiguration): void {
	Object.keys(gameJson.assets).forEach(key => {
		if (gameJson.assets[key].type === "image") {
			const asset = gameJson.assets[key] as ImageAssetConfigurationBase;
			if (!asset.hint) {
				asset.hint = {};
			}
			asset.hint.untainted = true;
		}
	});
}

export function validateEngineFilesName(filename: string, expectedMajorVersion: string): void {
	const matches = filename.match(/(\d+)_\d+_\d+/);
	const engineFilesVersion = matches ? matches[1] : null;
	if (expectedMajorVersion !== engineFilesVersion) {
		throw new Error("Versions of environment[\"sandbox-runtime\"] in game.json and the version of engineFiles do not match."
			+ ` environment[\"sandbox-runtime\"]:${expectedMajorVersion}, engineFiles:${engineFilesVersion}`);
	}
}

export function resolveEngineFilesPath(version: string): string {
	// @akashic/headless-driver が依存している engine-files-v* を直接参照
	const headlessDriverPath = require.resolve("@akashic/headless-driver");
	const engineFilesPackageDir = path.dirname(require.resolve(`engine-files-v${version}`, {paths: [headlessDriverPath]}));
	// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-var-requires
	const engineFilesPackageJson = require(`${engineFilesPackageDir}/package.json`);
	const engineFilesName = `engineFilesV${engineFilesPackageJson.version.replace(/[\.-]/g, "_")}.js`;
	return path.join(engineFilesPackageDir, `dist/raw/release/full/${engineFilesName}`);
}

export function validateSandboxConfigJs(
	conf: SandboxConfiguration,
	autoSendEventName: string | boolean,
	autoGivenArgsName: string
): void {
	if (autoSendEventName) {
		if (autoSendEventName === true) {
			autoSendEventName = conf.autoSendEventName || conf.autoSendEvents;
		}
		if (!conf.events[autoSendEventName]){
			throw  Error(`${autoSendEventName} does not exist in events in sandbox.config.js.`);
		}
	}

	if (autoGivenArgsName) {
		if (!conf.arguments[autoGivenArgsName]) {
			throw  Error(`${autoGivenArgsName} does not exist in arguments in sandbox.config.js.`);
		}
	}
}

function getFileContentsFromDirectory(inputDirPath: string): string[] {
	return fs.readdirSync(inputDirPath)
		.map(fileName => fs.readFileSync(path.join(inputDirPath, fileName), "utf8").replace(/\r\n|\r/g, "\n"));
}

function loadScriptFile(filePath: string): string {
	try {
		return fs.readFileSync(filePath, "utf8").replace(/\r\n|\r/g, "\n");
	} catch (e) {
		if (e.code === "ENOENT") {
			throw new Error(path.basename(filePath) + " is not found. Try re-install akashic-cli" + filePath);
		} else {
			throw e;
		}
	}
}
