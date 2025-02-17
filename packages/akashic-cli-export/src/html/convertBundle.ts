import * as fs from "fs";
import { createRequire } from "module";
import * as path from "path";
import { fileURLToPath } from "url";
import * as cmn from "@akashic/akashic-cli-commons";
import * as ejs from "ejs";
import fsx from "fs-extra";
import type { MinifyOptions } from "terser";
import * as licenseUtil from "../licenseUtil.js";
import { validateGameJson } from "../utils.js";
import type {
	ConvertTemplateParameterObject} from "./convertUtil.js";
import {
	copyAssetFilesStrip,
	copyAssetFiles,
	encodeText,
	wrap,
	getDefaultBundleScripts,
	getDefaultBundleStyle,
	extractAssetDefinitions,
	getInjectedContents,
	validateSandboxConfigJs,
	readSandboxConfigJs
} from "./convertUtil.js";

interface InnerHTMLAssetData {
	name: string;
	type: string;
	code: string;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

export async function promiseConvertBundle(options: ConvertTemplateParameterObject): Promise<void> {
	const content = await cmn.FileSystem.readJSON<cmn.GameConfiguration>(path.join(options.source, "game.json"));
	if (!content.environment) content.environment = {};
	content.environment["sandbox-runtime"] = content.environment["sandbox-runtime"] ? content.environment["sandbox-runtime"] : "1";

	validateGameJson(content);

	const conf = new cmn.Configuration({
		content: content
	});
	let innerHTMLAssetArray: InnerHTMLAssetData[] = [];

	innerHTMLAssetArray.push({
		name: "game.json",
		type: "text",
		code: encodeText(JSON.stringify(conf._content, null, "\t"))
	});

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

	const errorMessages: string[] = [];
	let innerHTMLAssetNames = extractAssetDefinitions(conf, "script");
	if (!options.unbundleText) {
		innerHTMLAssetNames = innerHTMLAssetNames.concat(extractAssetDefinitions(conf, "text"));
	}

	const terser = options.minify ? options.terser ?? {} : undefined;
	const tempAssetData = await Promise.all(innerHTMLAssetNames.map((assetName: string) => {
		return convertAssetToInnerHTMLObj(assetName, options.source, conf, terser, options.esDownpile);
	}));
	innerHTMLAssetArray = innerHTMLAssetArray.concat(tempAssetData);

	const libPaths: string[] = [];
	if (conf._content.globalScripts) {
		const tempScriptData = await Promise.all(conf._content.globalScripts.map((scriptName: string) => {
			libPaths.push(scriptName);
			return convertScriptNameToInnerHTMLObj(scriptName, options.source, terser);
		}));
		innerHTMLAssetArray = innerHTMLAssetArray.concat(tempScriptData);
	}

	await licenseUtil.writeLicenseTextFile(options.source, options.output, libPaths, conf._content.environment["sandbox-runtime"]);

	if (errorMessages.length > 0) {
		options.logger.warn("The following ES5 syntax errors exist.\n" + errorMessages.join("\n"));
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
	await writeHtmlFile(innerHTMLAssetArray, options.output, conf, options, templatePath);
	writeCommonFiles(options.source, options.output, conf, options, templatePath);
}

async function convertAssetToInnerHTMLObj(
	assetName: string,
	inputPath: string,
	conf: cmn.Configuration,
	terser: MinifyOptions | undefined,
	esDownpile: boolean
): Promise<InnerHTMLAssetData> {
	const assets = conf._content.assets;
	const isScript = assets[assetName].type === "script";
	const asset = assets[assetName];
	const exports = (asset.type === "script" && asset.exports) ?? [];
	const assetString = fs.readFileSync(path.join(inputPath, asset.path), "utf8").replace(/\r\n|\r/g, "\n");
	return {
		name: assetName,
		type: asset.type,
		code: isScript ? wrap(assetString, terser, esDownpile, exports) : encodeText(assetString)
	};
}

async function convertScriptNameToInnerHTMLObj(
	scriptName: string, inputPath: string,
	terser: MinifyOptions | undefined): Promise<InnerHTMLAssetData> {
	let scriptString = fs.readFileSync(path.join(inputPath, scriptName), "utf8").replace(/\r\n|\r/g, "\n");
	const isScript = /\.js$/i.test(scriptName);

	const scriptPath = path.resolve("./", scriptName);
	if (path.extname(scriptPath) === ".json") {
		scriptString = encodeText(scriptString);
	}
	return {
		name: scriptName,
		type: isScript ? "script" : "text",
		code: isScript ? wrap(scriptString, terser, false) : scriptString
	};
}

async function writeHtmlFile(
	innerHTMLAssetArray: InnerHTMLAssetData[],
	outputPath: string,
	conf: cmn.Configuration,
	options: ConvertTemplateParameterObject,
	templatePath: string
): Promise<void> {
	const injects = options.injects ? options.injects : [];
	const scripts = getDefaultBundleScripts(
		templatePath,
		conf._content.environment["sandbox-runtime"],
		options,
		!options.unbundleText,
		options.debugOverrideEngineFiles
	);
	const filePath = path.join(__dirname, "..", "..", "lib", "template", "bundle-index.ejs");
	const html = await ejs.renderFile(filePath, {
		assets: innerHTMLAssetArray,
		preloadScripts: scripts.preloadScripts,
		postloadScripts: scripts.postloadScripts,
		css: getDefaultBundleStyle(templatePath),
		magnify: !!options.magnify,
		injectedContents: getInjectedContents(options.cwd, injects),
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
	options: ConvertTemplateParameterObject, templatePath: string): void {
	if (options.strip) {
		copyAssetFilesStrip(inputPath, outputPath, conf._content.assets, options);
	} else {
		copyAssetFiles(inputPath, outputPath, options);
	}

	const jsDir = path.resolve(outputPath, "js");
	const cssDir = path.resolve(outputPath, "css");
	fsx.copySync(
		path.resolve(__dirname, "..", "..", "lib", templatePath),
		outputPath,
		{ filter: (_src: string, dest: string): boolean => (dest !== jsDir && dest !== cssDir) }
	);
}
