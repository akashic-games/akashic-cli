import * as fs from "fs";
import * as path from "path";
import * as cmn from "@akashic/akashic-cli-commons";
import * as fsx from "fs-extra";
import * as UglifyJS from "uglify-js";
import readdir = require("fs-readdir-recursive");

export interface ConvertTemplateParameterObject {
	output: string;
	logger: cmn.Logger;
	strip: boolean;
	minify: boolean;
	magnify: boolean;
	force: boolean;
	source: string;
	cwd: string;
	unbundleText: boolean;
	lint: boolean;
	injects?: string[];
}

export function extractAssetDefinitions (conf: cmn.Configuration, type: string): string[] {
	var assets = conf._content.assets;
	var assetNames = Object.keys(assets);
	return assetNames.filter((assetName) => assets[assetName].type === type);
}

export function copyAssetFilesStrip(
	inputPath: string, outputPath: string,
	assets: cmn.Assets, options: ConvertTemplateParameterObject): void {
	options.logger.info("copying stripped fileset...");
	var assetNames = Object.keys(assets);
	assetNames.filter((assetName) => {
		return assets[assetName].type !== "script" && (options.unbundleText || assets[assetName].type !== "text");
	}).forEach((assetName) => {
		var assetPath = assets[assetName].path;
		var assetDir = path.dirname(assetPath);
		fsx.mkdirsSync(path.resolve(outputPath, assetDir));
		var dst = path.join(outputPath, assetPath);
		if (assets[assetName].type === "audio") {
			var audioTypes = ["ogg", "mp4", "aac"];
			audioTypes.forEach((type) => {
				try {
					fsx.copySync(
						path.resolve(inputPath, assetPath) + "." + type,
						dst + "." + type,
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
	const isAssetToBeCopied = (src: string) => {
		return path.relative(scriptPath, src)[0] === "." && (options.unbundleText || path.relative(textPath, src)[0] === ".");
	};
	try {
		const files = readdir(inputPath);
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

export function wrap(code: string, minify?: boolean): string {
	var PRE_SCRIPT = "(function(exports, require, module, __filename, __dirname) {";
	var POST_SCRIPT = "})(g.module.exports, g.module.require, g.module, g.filename, g.dirname);";
	var ret = PRE_SCRIPT + "\n" + code + "\n" + POST_SCRIPT + "\n";
	return minify ? UglifyJS.minify(ret, { fromString: true }).code : ret;
}

export function getDefaultBundleScripts(templatePath: string, version: string, minify?: boolean, bundleText: boolean = true): any {
	var preloadScriptNames =
		["akashic-engine.strip.js", "game-driver.strip.js", "pdi-browser.strip.js"];
	var postloadScriptNames =
		["build/LocalScriptAsset.js", "game-storage.strip.js", "sandbox.js", "initGlobals.js"];
	if (version === "1") postloadScriptNames.push("logger.js");
	if (bundleText) {
		postloadScriptNames.push("build/LocalTextAsset.js");
	}

	var preloadScripts = preloadScriptNames.map((fileName) => loadScriptFile(fileName, templatePath));
	var postloadScripts = postloadScriptNames.map((fileName) => loadScriptFile(fileName, templatePath));
	if (minify) {
		preloadScripts = preloadScripts.map(script => UglifyJS.minify(script, { fromString: true }).code);
		postloadScripts = postloadScripts.map(script => UglifyJS.minify(script, { fromString: true }).code);
	}
	return {
		preloadScripts,
		postloadScripts
	};
}

export function getDefaultBundleStyle(templatePath: string): string {
	const filepath = path.resolve(__dirname, "..", templatePath, "css", "style.css");
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

export function validateEs5Code(fileName: string, code: string): string[] {
	return cmn.LintUtil.validateEs5Code(code)
		.map(info => `${fileName}(${info.line}:${info.column}): ${info.message}`);
}

function getFileContentsFromDirectory(inputDirPath: string): string[] {
	return fs.readdirSync(inputDirPath)
		.map(fileName => fs.readFileSync(path.join(inputDirPath, fileName), "utf8").replace(/\r\n|\r/g, "\n"));
}

function loadScriptFile(fileName: string, templatePath: string): string {
	try {
		const filepath = path.resolve(__dirname, "..", templatePath, "js", fileName);
		return fs.readFileSync(filepath, "utf8").replace(/\r\n|\r/g, "\n");
	} catch (e) {
		if (e.code === "ENOENT") {
			throw new Error(fileName + " is not found. Try re-install akashic-cli" + path.resolve(__dirname, "..", templatePath, fileName));
		} else {
			throw e;
		}
	}
}
