import * as fs from "fs";
import { createRequire } from "module";
import * as path from "path";
import { fileURLToPath } from "url";
import * as cmn from "@akashic/akashic-cli-commons";
import * as ejs from "ejs";
import fsx from "fs-extra";
import type { MinifyOptions } from "terser";
import { validateGameJson } from "../utils.js";
import type {
	ConvertTemplateParameterObject} from "./convertUtil.js";
import {
	copyAssetFilesStrip,
	copyAssetFiles,
	encodeText,
	wrap,
	extractAssetDefinitions,
	getInjectedContents,
	readSandboxConfigJs,
	validateEngineFilesName,
	resolveEngineFilesPath,
	validateSandboxConfigJs
} from "./convertUtil.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

export async function promiseConvertNoBundle(options: ConvertTemplateParameterObject): Promise<void> {
	const content = await cmn.FileSystem.readJSON<cmn.GameConfiguration>(path.join(options.source, "game.json"));
	if (!content.environment) content.environment = {};
	content.environment["sandbox-runtime"] = content.environment["sandbox-runtime"] ? content.environment["sandbox-runtime"] : "1";

	validateGameJson(content);

	const conf = new cmn.Configuration({
		content: content
	});
	let assetPaths: string[] = [];

	writeCommonFiles(options.source, options.output, conf, options);

	const gamejsonPath = path.resolve(options.output, "./js/game.json.js");
	fsx.outputFileSync(gamejsonPath, wrapText(JSON.stringify(conf._content, null, "\t"), "game.json"));
	assetPaths.push("./js/game.json.js");

	if (options.autoSendEventName || options.autoGivenArgsName) {
		let sandboxConfig;
		try {
			options.sandboxConfigJsCode = readSandboxConfigJs(options.source);
			sandboxConfig = require(path.join(options.source, "sandbox.config.js"));
		} catch (error) {
			throw Error("failed read sandbox.config.js.");
		}
		validateSandboxConfigJs(sandboxConfig, options.autoSendEventName, options.autoGivenArgsName);
	}

	const terser = options.minify ? options.terser ?? {} : undefined;
	const nonBinaryAssetNames = extractAssetDefinitions(conf, "script").concat(extractAssetDefinitions(conf, "text"));
	const errorMessages: string[] = [];
	const nonBinaryAssetPaths = await Promise.all(nonBinaryAssetNames.map((assetName: string) => {
		return convertAssetAndOutput(assetName, conf, options.source, options.output, terser, options.babel, errorMessages);
	}));
	assetPaths = assetPaths.concat(nonBinaryAssetPaths);
	if (conf._content.globalScripts) {
		const globalScriptPaths = await Promise.all(conf._content.globalScripts.map((scriptName: string) => {
			return convertGlobalScriptAndOutput(
				scriptName,
				options.source,
				options.output,
				terser,
				errorMessages);
		}));
		assetPaths = assetPaths.concat(globalScriptPaths);
	}
	if (errorMessages.length > 0) {
		options.logger.warn("The following ES5 syntax errors exist.\n" + errorMessages.join("\n"));
	}
	await writeHtmlFile(assetPaths, options.output, conf, options);
	writeOptionScript(options.output, options);
}

async function convertAssetAndOutput(
	assetName: string,
	conf: cmn.Configuration,
	inputPath: string,
	outputPath: string,
	terser: MinifyOptions | undefined,
	babel: boolean,
	_errors?: string[]
): Promise<string> {
	const assets = conf._content.assets;
	const asset = assets[assetName];
	const isScript = asset.type === "script";
	const exports = (asset.type === "script" && asset.exports) ?? [];
	const assetString = fs.readFileSync(path.join(inputPath, asset.path), "utf8").replace(/\r\n|\r/g, "\n");
	const assetPath = asset.path;

	const code = (isScript ? wrapScript(assetString, assetName, terser, babel, exports) : wrapText(assetString, assetName));
	const relativePath = "./js/assets/" + path.dirname(assetPath) + "/" +
		path.basename(assetPath, path.extname(assetPath)) + (isScript ? ".js" : ".json.js");
	const filePath = path.resolve(outputPath, relativePath);

	fsx.outputFileSync(filePath, code);
	return relativePath;
}

async function convertGlobalScriptAndOutput(
	scriptName: string, inputPath: string, outputPath: string,
	terser: MinifyOptions | undefined, errors?: string[]): Promise<string> {
	const scriptString = fs.readFileSync(path.join(inputPath, scriptName), "utf8").replace(/\r\n|\r/g, "\n");
	const isScript = /\.js$/i.test(scriptName);
	const code = isScript ? wrapScript(scriptString, scriptName, terser, false) : wrapText(scriptString, scriptName);
	const relativePath = "./globalScripts/" + scriptName + (isScript ? "" : ".js");
	const filePath = path.resolve(outputPath, relativePath);

	fsx.outputFileSync(filePath, code);
	return relativePath;
}

async function writeHtmlFile(
	assetPaths: string[],
	outputPath: string,
	conf: cmn.Configuration,
	options: ConvertTemplateParameterObject): Promise<void> {
	const injects = options.injects ? options.injects : [];
	const version = conf._content.environment["sandbox-runtime"];
	const filePath = path.resolve(__dirname + "/../template/no-bundle-index.ejs");
	let engineFilePath: string;
	let engineFilesVariable: string;

	if (options.debugOverrideEngineFiles) {
		validateEngineFilesName(options.debugOverrideEngineFiles, version);
		engineFilePath = path.resolve(options.debugOverrideEngineFiles);
		engineFilesVariable = path.basename(options.debugOverrideEngineFiles, ".js");
	} else {
		engineFilePath = resolveEngineFilesPath(version);
		engineFilesVariable = path.basename(engineFilePath, ".js");
	}

	const html = await ejs.renderFile(filePath, {
		assets: assetPaths,
		magnify: !!options.magnify,
		injectedContents: getInjectedContents(options.cwd, injects),
		version: version,
		engineFilesVariable: engineFilesVariable,
		exportVersion: options.exportInfo !== undefined ? options.exportInfo.version : "",
		exportOption: options.exportInfo !== undefined ? options.exportInfo.option : "",
		autoSendEventName: options.autoSendEventName,
		autoGivenArgsName: options.autoGivenArgsName,
		sandboxConfigJsCode: options.sandboxConfigJsCode !== undefined ? options.sandboxConfigJsCode : ""
	});
	fs.writeFileSync(path.resolve(outputPath, "./index.html"), html);
}

function writeCommonFiles(
	inputPath: string,
	outputPath: string, conf: cmn.Configuration,
	options: ConvertTemplateParameterObject): void {
	if (options.strip) {
		copyAssetFilesStrip(inputPath, outputPath, conf._content.assets, options);
	} else {
		copyAssetFiles(inputPath, outputPath, options);
	}
	let templatePath: string;
	const version = conf._content.environment["sandbox-runtime"];
	switch (version) {
		case "1":
			templatePath = "template/v1";
			break;
		case "2":
			templatePath = "template/v2";
			break;
		case "3":
			templatePath = "template/v3";
			break;
		default:
			throw Error("Unknown engine version: `environment[\"sandbox-runtime\"]` field in game.json should be \"1\", \"2\", or \"3\".");
	}

	fsx.copySync(
		path.resolve(__dirname, "..", "..", "lib", templatePath),
		outputPath);

	const jsDir = path.join(outputPath, "js");
	const engineFilesPath = options.debugOverrideEngineFiles ?? resolveEngineFilesPath(version);
	fsx.copySync(
		path.resolve(engineFilesPath),
		path.join(jsDir, path.basename(engineFilesPath))
	);
}

function writeOptionScript(outputPath: string, options: ConvertTemplateParameterObject): void {
	const script = `
if (! ("optionProps" in window)) {
	window.optionProps = {};
}
window.optionProps.magnify = ${!!options.magnify};
	`;
	fs.writeFileSync(path.resolve(outputPath, "./js/option.js"), script);
}

function wrapScript(code: string, name: string, terser?: MinifyOptions, bable?: boolean, exports: string[] = []): string {
	return "window.gLocalAssetContainer[\"" + name + "\"] = function(g) { " + wrap(code, terser, bable, exports) + "}";
}

function wrapText(code: string, name: string): string {
	const PRE_SCRIPT = "window.gLocalAssetContainer[\"" + name + "\"] = \"";
	const POST_SCRIPT = "\"";
	return PRE_SCRIPT + encodeText(code) + POST_SCRIPT + "\n";
}
