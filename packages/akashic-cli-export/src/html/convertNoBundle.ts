import * as fs from "fs";
import * as path from "path";
import * as cmn from "@akashic/akashic-cli-commons";
import * as ejs from "ejs";
import * as fsx from "fs-extra";
import {
	ConvertTemplateParameterObject,
	copyAssetFilesStrip,
	copyAssetFiles,
	encodeText,
	wrap,
	extractAssetDefinitions,
	getInjectedContents,
	validateEs5Code,
	readSandboxConfigJs,
	validateEngineFilesName
} from "./convertUtil";

export async function promiseConvertNoBundle(options: ConvertTemplateParameterObject): Promise<void> {
	var content = await cmn.ConfigurationFile.read(path.join(options.source, "game.json"), options.logger);
	if (!content.environment) content.environment = {};
	content.environment["sandbox-runtime"] = content.environment["sandbox-runtime"] ? content.environment["sandbox-runtime"] : "1";
	var conf = new cmn.Configuration({
		content: content
	});
	var assetPaths: string[] = [];

	writeCommonFiles(options.source, options.output, conf, options);

	var gamejsonPath = path.resolve(options.output, "./js/game.json.js");
	fsx.outputFileSync(gamejsonPath, wrapText(JSON.stringify(conf._content, null, "\t"), "game.json"));
	assetPaths.push("./js/game.json.js");

	if (options.autoSendEventName) {
		try {
			options.sandboxConfigJsCode = readSandboxConfigJs(options.source);
		} catch (error) {
			options.autoSendEventName = false;
			console.log("failed read sandbox.config.js, autoSendEventName disabled.");
		}
	}

	var nonBinaryAssetNames = extractAssetDefinitions(conf, "script").concat(extractAssetDefinitions(conf, "text"));
	var errorMessages: string[] = [];
	const nonBinaryAssetPaths = await Promise.all(nonBinaryAssetNames.map((assetName: string) => {
		return convertAssetAndOutput(assetName, conf, options.source, options.output, options.minify, errorMessages);
	}));
	assetPaths = assetPaths.concat(nonBinaryAssetPaths);
	if (conf._content.globalScripts) {
		const globalScriptPaths = await Promise.all(conf._content.globalScripts.map((scriptName: string) => {
			return convertGlobalScriptAndOutput(
				scriptName,
				options.source,
				options.output,
				options.minify,
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
	assetName: string, conf: cmn.Configuration,
	inputPath: string, outputPath: string,
	minify?: boolean, errors?: string[]): Promise<string> {
	var assets = conf._content.assets;
	var asset = assets[assetName];
	var isScript = asset.type === "script";
	var exports = (asset.type === "script" && asset.exports) ?? [];
	var assetString = fs.readFileSync(path.join(inputPath, asset.path), "utf8").replace(/\r\n|\r/g, "\n");
	var assetPath = asset.path;
	if (isScript) {
		errors.push.apply(errors, await validateEs5Code(assetPath, assetString)); // ES5構文に反する箇所があるかのチェック
	}

	var code = (isScript ? wrapScript(assetString, assetName, minify, exports) : wrapText(assetString, assetName));
	var relativePath = "./js/assets/" + path.dirname(assetPath) + "/" +
		path.basename(assetPath, path.extname(assetPath)) + (isScript ? ".js" : ".json.js");
	var filePath = path.resolve(outputPath, relativePath);

	fsx.outputFileSync(filePath, code);
	return relativePath;
}

async function convertGlobalScriptAndOutput(
	scriptName: string, inputPath: string, outputPath: string,
	minify?: boolean, errors?: string[]): Promise<string> {
	var scriptString = fs.readFileSync(path.join(inputPath, scriptName), "utf8").replace(/\r\n|\r/g, "\n");
	var isScript = /\.js$/i.test(scriptName);
	if (isScript) {
		errors.push.apply(errors, await validateEs5Code(scriptName, scriptString)); // ES5構文に反する箇所があるかのチェック
	}

	var code = isScript ? wrapScript(scriptString, scriptName, minify) : wrapText(scriptString, scriptName);
	var relativePath = "./globalScripts/" + scriptName + (isScript ? "" : ".js");
	var filePath = path.resolve(outputPath, relativePath);

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
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const versionsJson = require("../engineFilesVersion.json");
	let engineFilesVariable = versionsJson[`v${version}`].variable;
	const filePath = path.resolve(__dirname + "/../template/no-bundle-index.ejs");

	if (options.debugOverrideEngineFiles) {
		validateEngineFilesName(options.debugOverrideEngineFiles, version);
		engineFilesVariable = path.basename(options.debugOverrideEngineFiles, ".js");
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
	switch (conf._content.environment["sandbox-runtime"]) {
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
		path.resolve(__dirname, "..", templatePath),
		outputPath);

	if (options.debugOverrideEngineFiles) {
		const jsDir = path.join(outputPath, "js");
		fsx.readdirSync(jsDir).filter(f => /^engineFilesV*/.test(f))
			.map(f => fsx.removeSync(path.join(jsDir, f)));
		fsx.copySync(
			path.resolve(options.debugOverrideEngineFiles),
			path.join(jsDir, path.basename(options.debugOverrideEngineFiles))
		);
	}
}

function writeOptionScript(outputPath: string, options: ConvertTemplateParameterObject): void {
	var script = `
if (! ("optionProps" in window)) {
	window.optionProps = {};
}
window.optionProps.magnify = ${!!options.magnify};
	`;
	fs.writeFileSync(path.resolve(outputPath, "./js/option.js"), script);
}

function wrapScript(code: string, name: string, minify?: boolean, exports: string[] = []): string {
	return "window.gLocalAssetContainer[\"" + name + "\"] = function(g) { " + wrap(code, minify, exports) + "}";
}

function wrapText(code: string, name: string): string {
	var PRE_SCRIPT = "window.gLocalAssetContainer[\"" + name + "\"] = \"";
	var POST_SCRIPT = "\"";
	return PRE_SCRIPT + encodeText(code) + POST_SCRIPT + "\n";
}
