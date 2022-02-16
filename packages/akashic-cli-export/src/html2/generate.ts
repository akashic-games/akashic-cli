import * as fs from "fs";
import * as path from "path";
import * as ejs from "ejs";
import { ConsoleLogger } from "@akashic/akashic-cli-commons/lib/ConsoleLogger";
import { readFile, readJSON, unlink, writeFile, writeJSON } from "@akashic/akashic-cli-commons/lib/FileSystem";
import { Logger } from "@akashic/akashic-cli-commons/lib/Logger";
import { GameConfiguration } from "@akashic/akashic-cli-commons/lib/GameConfiguration";

export interface GenerateHTMLParameterObject {
	/**
	 * HTML を生成する対象のコンテンツのディレクトリ。
	 * このディレクトリ以下に、index.html とその他必要なファイルが生成される。
	 */
	gameDir?: string;

	/**
	 * 生成された HTML が利用しない元ファイルを削除するか。
	 *
	 * ゲームの一部ファイルは、生成された HTML からは利用されない。
	 * (加工して HTML に取り込まれる (こともある) スクリプトアセットなど)
	 * この値を真にした場合、そのようなファイルを削除する。
	 *
	 * 省略した場合、偽。
	 */
	destructive?: boolean;

	/**
	 * ログ出力に利用するロガー。
	 */
	logger?: Logger;

	/**
	 * スクリプトなどの内容を index.html に取り込むか。
	 */
	bundle?: boolean;

	/**
	 * テキストアセットを加工せずそのまま維持するか。
	 *
	 * --atsumaru (export html と export zip を両方行い、ファイルを共有する) 向けのオプション。
	 * (export zip の結果とテキストアセットを共有するのでトータルのファイルサイズを小さくできる)
	 * ただし真の場合、生成される HTML は file スキーマでは利用できなくなる。
	 *
	 * 省略した場合、偽。
	 */
	useRawText?: boolean;

	/**
	 * 組み込むエンジン。
	 *
	 * 指定した場合、同梱のものが利用される。
	 * デバッグのためのオプション。通常、指定する必要はない。
	 * 省略した場合、 `null` 。
	 */
	engineFiles?: string | null;

	magnify?: boolean;
	injects?: string[];
	autoSendEventName?: string | boolean;

	exportInfo?: {
		version: string;
		option: string;
	};
}

export interface NormalizedGenerateHTMLParameterObject extends Readonly<Required<GenerateHTMLParameterObject>> {
	// nothing
}

export function normalizeGenerateHTMLParameterObject(param: GenerateHTMLParameterObject): NormalizedGenerateHTMLParameterObject {
	const ret: NormalizedGenerateHTMLParameterObject = {
		gameDir: ".",
		destructive: false,
		logger: param.logger ?? new ConsoleLogger(),
		bundle: false,
		useRawText: false,
		engineFiles: null,
		magnify: !!param.magnify,
		injects: param.injects ?? [],
		autoSendEventName: null,
		exportInfo: { version: "unknown", option: "unknown" },
		...param
	};

	// 複数箇所に持って回られやすいこの値は、破壊するとすぐグローバル変数のようになってしまうので、絶対に破壊を許さないことにする
	return Object.freeze(ret);
}

interface Entry {
	/**
	 * 内容の読み込み元ファイルパス。
	 * content がある場合、この値は無視される。
	 * どのように取り込まれるかは拡張子によって変化する。
	 * 拡張子が ".ejs" である場合、 args を渡して EJS で render したものを内容とする。
	 */
	src?: string | null;

	/**
	 * 出力先。
	 *
	 * コンテンツルート (＝gameDir) からの相対パス。
	 * bundle される (HTML に書き込まれる) 場合は利用されない。
	 * null の場合は必ず bundle される。
	 *
	 * 省略された場合、 `null` 。
	 */
	dest?: string | null;

	/**
	 * 内容。
	 * 拡張子 .js であるとして扱われる。
	 */
	content?: string | null;

	/**
	 * 内容の加工方法。
	 * - `"raw"`: 加工しない
	 * - `"script"`: function() 式でラップする
	 * - `"text"`: 文字列リテラルとしてエスケープする
	 * 
	 * 省略されたまたは null の場合、 `"raw"` として扱われる。
	 */
	wrapType?: "script" | "text" | "raw" | null;

	/**
	 * アセットID。
	 * wrapType: "script", "text" の時のみ利用される。
	 */
	assetId?: string;

	/**
	 * EJS で render する際の引数。
	 * src の拡張子が ".ejs" である時のみ利用される。
	 */
	args?: { [key: string]: any };

	/**
	 * 出力後、src を削除するか。
	 * 省略された場合、偽。
	 */
	destructive?: boolean;
}

function wrapInFunction(code: string): string {
	const PRE_SCRIPT = "function (g) { (function(exports, require, module, __filename, __dirname) {";
	const POST_SCRIPT = "})(g.module.exports, g.module.require, g.module, g.filename, g.dirname); }";
	return `${PRE_SCRIPT}\n${code}\n${POST_SCRIPT}`;
}

function encodeText(text: string): string {
	return text.replace(/[\u2028\u2029'"\\\b\f\n\r\t\v%]/g, encodeURIComponent);
}

interface ResolvedEntry {
	/**
	 * 内容。
	 * HTML に書き込まれるか、またはそこから参照されるファイルに書き込まれる。
	 */
	content: string;
	/**
	 * content の出力先 (bundle しない場合)
	 * null の場合必ず HTML に書き込まれる。
	 */
	dest: string | null;
	/**
	 * 出力後、削除するファイル。
	 */
	discardable: string | null;
}

async function resolveEntry(entry: Entry): Promise<ResolvedEntry> {
	const {
		src = null,
		dest,
		content: givenContent = null,
		wrapType = "raw",
		assetId = null,
		args = null,
		destructive = false
	} = entry;

	const readContent = givenContent ?? (
		(path.extname(src) === ".ejs") ?
			await ejs.renderFile(src, args) :
			await readFile(src, "utf8")
	);

	let content: string;
	switch (wrapType) {
		case "script":
			content = `window.gLocalAssetContainer["${assetId}"] = ${wrapInFunction(readContent)};`;
		case "text":
			content = `window.gLocalAssetContainer["${assetId}"] = "${encodeText(readContent)}";`;
		case "raw":
		default:
			content = readContent;
	}

	const discardable = (destructive && src) ? src : null;
	return { content, dest, discardable };
}

const RUNTIME_VER_TABLE = path.resolve(__dirname, "..", "engineFilesVersion.json");
const TEMPLATE_DIR = path.resolve(__dirname, "..", "template");
const PDI_DIR = path.resolve(__dirname, "..", "pdi");

interface EngineFilesVersionJson {
	[ver: string]: {
		version: string;
		variable: string;
	}
}

// template/ に存在する具体的なファイルを意識しているのはこの関数だけ
async function makeRuntimeEntries(
	gameJson: GameConfiguration,
	gameDir: string,
	engineFilesPath: string | null,
	useRawText: boolean,
	autoSendEventName: string | boolean | null,
	magnify: boolean
): Promise<(Entry | null)[]> {
	const sandboxRuntimeVersion = gameJson.environment?.["sandbox-runtime"] ?? "1";

	let engineFilesVariable: string;
	if (engineFilesPath) {
		engineFilesVariable = path.basename(engineFilesPath, ".js");
	} else {
		const { version, variable } = (await readJSON<EngineFilesVersionJson>(RUNTIME_VER_TABLE))[`v${sandboxRuntimeVersion}`]!;
		engineFilesPath = path.join(TEMPLATE_DIR, `v${sandboxRuntimeVersion}`, `engineFile${version}.js`);
		engineFilesVariable = variable;
	}

	const sandboxConfigJsCode = autoSendEventName ? await readFile(path.join(gameDir, "sandbox.config.js"), "utf8") : null;
	const runtimeDir = await findUniqueDir(gameDir, "runtime");

	return [
		{
			src: path.join(TEMPLATE_DIR, "css", "style.css"),
			dest: path.join(runtimeDir, "style.css")
		},
		{
			src: engineFilesPath,
			dest: path.join(runtimeDir, path.basename(engineFilesPath))
		},
		{
			src: path.join(TEMPLATE_DIR, "initVars.js.ejs"),
			dest: path.join(runtimeDir, "initVars.js"),
			args: {
				engineFilesVariable,
				magnify,
				autoSendEventName,
				sandboxConfigJsCode
			}
		},
		{
			src: path.join(PDI_DIR, `LocalScriptAsset${(sandboxRuntimeVersion === "3") ? "V3" : ""}.js`),
			dest: path.join(runtimeDir, "LocalScriptAsset.js")
		},
		(
			!useRawText ?
				{
					src: path.join(PDI_DIR, `LocalTextAsset${(sandboxRuntimeVersion === "3") ? "V3" : ""}.js`),
					dest: path.join(runtimeDir, "LocalTextAsset.js")
				} :
				null
		),
		(
			(sandboxRuntimeVersion === "1") ?
				{
					src: path.join(TEMPLATE_DIR, "logger.js"),
					dest: path.join(runtimeDir, "logger.js")
				} :
				null
		),
		{
			src: path.join(TEMPLATE_DIR, `v${sandboxRuntimeVersion}`, "sandbox.js"),
			dest: path.join(runtimeDir, "sandbox.js")
		}
	];
}

function extractAssetIdsOf(gamejson: GameConfiguration, type: string): string[] {
	const assets = gamejson.assets ?? {};
	return Object.keys(assets).filter(aid => assets[aid].type === type);
}

async function makeContentEntries(
	gamejson: GameConfiguration,
	gameDir: string,
	useRawText: boolean,
	destructive: boolean
): Promise<Entry[]> {
	const destDir = await findUniqueDir(gameDir, "wrapped");
	const assets = gamejson.assets ?? {};
	return [
		{
			content: JSON.stringify(gamejson),
			dest: path.join(destDir, "game.json.js"),
			wrapType: "text",
			assetId: "game.json", // TODO 他アセットと衝突するのでは？
			destructive
		},
		...extractAssetIdsOf(gamejson, "script").map<Entry>(aid => ({
			src: path.join(gameDir, assets[aid]!.path),
			dest: path.join(destDir, assets[aid]!.path),
			wrapType: "script",
			assetId: aid,
			destructive
		})),
		...(gamejson.globalScripts ?? []).map<Entry>(filepath => ({
			src: path.join(gameDir, filepath),
			dest: path.join(destDir, filepath),
			wrapType: "script",
			assetId: filepath,
			destructive
		})),
		...(
			!useRawText ?
				extractAssetIdsOf(gamejson, "text").map<Entry>(aid => ({
					src: path.join(gameDir, assets[aid]!.path),
					dest: path.join(destDir, `${assets[aid]!.path}.js`),
					wrapType: "text",
					assetId: aid,
					destructive
				})) :
				[]
		)
	];
}

export async function generateHTMLImpl(param: NormalizedGenerateHTMLParameterObject): Promise<void> {
	const {
		gameDir,
		destructive,
		logger,
		bundle,
		useRawText,
		engineFiles,
		magnify,
		injects,
		autoSendEventName,
		exportInfo
	} = param;

	const gamejson = await readJSON<GameConfiguration>(path.join(gameDir, "game.json"));
	const entries = [
		...(await makeRuntimeEntries(gamejson, gameDir, engineFiles, useRawText, autoSendEventName, magnify)),
		...(await makeContentEntries(gamejson, gameDir, useRawText, destructive)),
		...injects.map(injection => ({ content: injection }))
	];

	const discardables: string[] = [];
	const fragments: string[] = [];
	for (let entry of entries) {
		const { dest, content, discardable } = await resolveEntry(entry);

		if (discardable)
			discardables.push(discardable);

		switch (dest ? path.extname(dest) : null) {
			case ".js": {
				if (bundle) {
					fragments.push(`<script>\n${content}\n</script>`);
				} else {
					await writeFile(path.join(gameDir, dest), content);
					fragments.push(`<script src="${dest}"></script>`)
				}
				break;
			}
			case ".css": {
				if (bundle) {
					fragments.push(`<style type="text/css">\n${content}\n</style>`);
				} else {
					await writeFile(path.join(gameDir, dest), content);
					fragments.push(`<link rel="stylesheet" type="text/css" href="${dest}">`);
				}
				break;
			}
			default: {
				fragments.push(`${content}\n`);
				break;
			}
		}
	}

	const html = await ejs.renderFile(path.join(__dirname, "..", "template", "index.html.ejs"), {
		fragments,
		exportInfo
	});
	await writeFile(path.join(gameDir, "index.html"), html);

	// 途中のエラーを想定して削除は最後に行う
	for (let d of discardables)
		await unlink(d);
}

export async function genereteHTML(param: GenerateHTMLParameterObject): Promise<void> {
	return generateHTMLImpl(normalizeGenerateHTMLParameterObject(param));
}

function exists(filepath: string): Promise<boolean> {
	return new Promise<boolean>((resolve, reject) => {
		fs.stat(path.resolve(filepath), (err: any, _stat: any) => {
			if (err) {
				return void (err.code === "ENOENT" ? resolve(true) : reject(err));
			}
			resolve(false);
		});
	});
}

async function findUniqueDir(baseDir: string, prefix: string): Promise<string> {
	if (!await exists(path.join(baseDir, prefix)))
		return prefix;
	let postfix = 0;
	while (await exists(path.join(baseDir, `${prefix}${postfix}`)))
		++postfix;
	return `${prefix}${postfix}`;
}
