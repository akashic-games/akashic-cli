import * as fs from "fs";
import * as path from "path";
import type { NormalizedSandboxConfiguration } from "@akashic/sandbox-configuration";
import * as  sandboxConfigUtils  from "@akashic/sandbox-configuration/lib/utils";
import * as chokidar from "chokidar";
import { BadRequestError, NotFoundError } from "../common/ApiError";
import { dynamicRequire } from "./dynamicRequire";

interface ResolvedSandboxConfig extends NormalizedSandboxConfiguration {
	// backgroundImage がローカルファイルの場合、クライアントからは GET /contents/:contentId/sandboxConfig/backgroundImage で取得される。その場合のローカルファイルのパスをここに保持する。
	resolvedBackgroundImagePath?: string;
}

const configs: { [key: string]: ResolvedSandboxConfig } = {};

/**
 * コンテンツの sandbox.config.js  ファイルの読み込み/監視を登録。
 *
 * @param contentId コンテンツID
 * @param targetDir sandbox.config.jsが存在するディレクトリパス
 */
export function register(contentId: string, targetDir: string): void {
	const configPath = path.resolve(targetDir, "sandbox.config.js");
	if (configs[contentId]) return;
	configs[contentId] = watchRequire(configPath, contentId, config => configs[contentId] = config);
}

/**
 * コンテンツIDに紐づく SandboxConfig の取得
 *
 * @param contentId コンテンツID
 */
export function get(contentId: string): ResolvedSandboxConfig {
	return configs[contentId];
}

function watchRequire(configPath: string, contentId: string, callback: (content: ResolvedSandboxConfig) => void): ResolvedSandboxConfig {
	let config = dynamicRequire<ResolvedSandboxConfig>(configPath, true);
	config = sandboxConfigUtils.normalize(config || {});

	const eventListener = (event: string, path: string): void => {
		if (event === "add" || event === "change") {
			config = dynamicRequire<ResolvedSandboxConfig>(path, true);
			config = normalizeConfig(sandboxConfigUtils.normalize(config), contentId);
		} else if (event === "unlink") {
			config = sandboxConfigUtils.normalize({});
		} else {
			return;
		}
		callback(config);
	};
	const watcher = chokidar.watch(configPath, { persistent: true });
	watcher.on("all", eventListener);

	return config;
}

function normalizeConfig(config: ResolvedSandboxConfig, contentId: string): ResolvedSandboxConfig {
	const externalAssets = config.externalAssets === undefined ? [] : config.externalAssets;
	if (externalAssets) {
		// sandbox.config.js の externalAssets に値がある場合は (string|regexp)[] でなければエラーとする
		if (!(externalAssets instanceof Array)) {
			throw new BadRequestError({ errorMessage: "Invalid externalAssets, Not Array" });
		}

		if ( externalAssets.length > 0) {
			const found = externalAssets.find((url: any) => typeof url !== "string" && !(url instanceof RegExp));
			if (found) {
				throw new BadRequestError(
					{errorMessage: `Invalid externalAssets, The value is neither a string or regexp. value:${ found }` }
				);
			}
		}
	}

	const bgImage = config.displayOptions.backgroundImage;
	if (bgImage) {
		if (!/\.(jpg|jpeg|png)$/.test(bgImage)) {
			throw new BadRequestError({ errorMessage: "Invalid backgroundImage, Please specify a png/jpg file." });
		}

		if (/^\/contents\//.test(bgImage)) {
			console.warn("Please use the local path for the value of sandboxConfig.backgroundImage");
		} else if (!/^https?:\/\//.test(bgImage)) {
			config.displayOptions.backgroundImage = `/contents/${contentId}/sandboxConfig/backgroundImage` ;
			config.resolvedBackgroundImagePath = bgImage;
		}
	}

	const serverExternal = config.server?.external;
	if (serverExternal) {
		for (const pluginName of Object.keys(serverExternal)) {
			const pluginPath = path.resolve(serverExternal[pluginName]);
			if (!fs.existsSync(pluginPath)) {
				throw new NotFoundError({
					errorMessage: `${pluginName} in sandboxConfig.server.external not found. path:${serverExternal[pluginName]}`
				});
			}
		}
	}

	return config;
}
