import * as fs from "fs";
import * as path from "path";
import * as cmn from "@akashic/akashic-cli-commons";
import * as fsx from "fs-extra";
import * as ect from "ect";
import {
	ConvertTemplateParameterObject,
	copyAssetFilesStrip,
	copyAssetFiles,
	encodeText,
	wrap,
	getDefaultBundleScripts,
	getDefaultBundleStyle,
	extractAssetDefinitions,
	getInjectedContents,
	validateEs5Code
} from "./convertUtil";

interface InnerHTMLAssetData {
	name: string;
	type: string;
	code: string;
}

export async function promiseConvertBundle(options: ConvertTemplateParameterObject): Promise<void> {
	var content = await cmn.ConfigurationFile.read(path.join(options.source, "game.json"), options.logger);
	if (!content.environment) content.environment = {};
	content.environment["sandbox-runtime"] = content.environment["sandbox-runtime"] ? content.environment["sandbox-runtime"] : "1";
	var conf = new cmn.Configuration({
		content: content
	});
	var innerHTMLAssetArray: InnerHTMLAssetData[] = [];

	innerHTMLAssetArray.push({
		name: "game.json",
		type: "text",
		code: encodeText(JSON.stringify(conf._content, null, "\t"))
	});

	var errorMessages: string[] = [];
	var innerHTMLAssetNames = extractAssetDefinitions(conf, "script");
	if (!options.unbundleText) {
		innerHTMLAssetNames = innerHTMLAssetNames.concat(extractAssetDefinitions(conf, "text"));
	}
	innerHTMLAssetArray = innerHTMLAssetArray.concat(innerHTMLAssetNames.map((assetName: string) => {
		return convertAssetToInnerHTMLObj(assetName, options.source, conf, options.minify, options.lint, errorMessages);
	}));

	if (conf._content.globalScripts) {
		innerHTMLAssetArray = innerHTMLAssetArray.concat(conf._content.globalScripts.map((scriptName: string) => {
			return convertScriptNameToInnerHTMLObj(scriptName, options.source, options.minify, options.lint, errorMessages);
		}));
	}

	if (errorMessages.length > 0) {
		options.logger.warn("The following ES5 syntax errors exist.\n" + errorMessages.join("\n"));
	}

	let templatePath: string;
	switch (conf._content.environment["sandbox-runtime"]) {
		case "1":
			templatePath = "templates-build/v1";
			break;
		case "2":
			templatePath = "templates-build/v2";
			break;
		default:
			throw Error("Unknown engine version: `environment[\"sandbox-runtime\"]` field in game.json should be \"1\" or \"2\".");
	}
	writeEct(innerHTMLAssetArray, options.output, conf, options, templatePath);
	writeCommonFiles(options.source, options.output, conf, options, templatePath);
}

function convertAssetToInnerHTMLObj(
	assetName: string, inputPath: string, conf: cmn.Configuration,
	minify?: boolean, lint?: boolean, errors?: string[]): InnerHTMLAssetData {
	var assets = conf._content.assets;
	var isScript = assets[assetName].type === "script";
	var assetString = fs.readFileSync(path.join(inputPath, assets[assetName].path), "utf8").replace(/\r\n|\r/g, "\n");
	if (isScript && lint) {
		errors.push.apply(errors, validateEs5Code(assets[assetName].path, assetString));
	}
	return {
		name: assetName,
		type: assets[assetName].type,
		code: isScript ? wrap(assetString, minify) : encodeText(assetString)
	};
}

function convertScriptNameToInnerHTMLObj(
	scriptName: string, inputPath: string,
	minify?: boolean, lint?: boolean, errors?: string[]): InnerHTMLAssetData {
	var scriptString = fs.readFileSync(path.join(inputPath, scriptName), "utf8").replace(/\r\n|\r/g, "\n");
	var isScript = /\.js$/i.test(scriptName);

	var scriptPath = path.resolve("./", scriptName);
	if (path.extname(scriptPath) === ".json") {
		scriptString = encodeText(scriptString);
	}
	if (isScript && lint) {
		errors.push.apply(errors, validateEs5Code(scriptName, scriptString));
	}
	return {
		name: scriptName,
		type: isScript ? "script" : "text",
		code: isScript ? wrap(scriptString, minify) : scriptString
	};
}

function writeEct(
	innerHTMLAssetArray: InnerHTMLAssetData[], outputPath: string,
	conf: cmn.Configuration, options: ConvertTemplateParameterObject, templatePath: string): void {
	const injects = options.injects ? options.injects : [];
	var scripts = getDefaultBundleScripts(templatePath, conf._content.environment["sandbox-runtime"], options.minify, !options.unbundleText);
	var ectRender = ect({root: __dirname + "/../templates-build", ext: ".ect"});
	var html = ectRender.render("bundle-index", {
		assets: innerHTMLAssetArray,
		preloadScripts: scripts.preloadScripts,
		postloadScripts: scripts.postloadScripts,
		css: getDefaultBundleStyle(templatePath),
		magnify: !!options.magnify,
		injectedContents: getInjectedContents(options.cwd, injects)
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
		path.resolve(__dirname, "..", templatePath),
		outputPath,
		{ filter: (src: string, dest: string): boolean => (dest !== jsDir && dest !== cssDir) }
	);
}
