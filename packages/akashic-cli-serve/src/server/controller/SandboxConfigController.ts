import * as fs from "fs";
import * as path from "path";
import type * as express from "express";
import type { SandboxConfigApiResponseData } from "../../common/types/ApiResponse.js";
import { BadRequestError, NotFoundError } from "../common/ApiError.js";
import { responseSuccess } from "../common/ApiResponse.js";
import { serverGlobalConfig } from "../common/ServerGlobalConfig.js";
import { dynamicRequire } from "../domain/dynamicRequire.js";
import * as sandboxConfigs from "../domain/SandboxConfigs.js";

export const createHandlerToGetSandboxConfig = (dirPaths: string[]): express.RequestHandler => {
	return async (req, res, next) => {
		try {
			const contentId = Number(req.params.contentId);
			if (!dirPaths[contentId]) {
				throw new NotFoundError({ errorMessage: `contentId:${contentId} is not found.` });
			}
			const confDirPath = dirPaths[contentId];
			const configPath = serverGlobalConfig.sandboxConfig ?? path.resolve(confDirPath, "sandbox.config.js");
			// TODO ファイル監視。内容に変化がなければ直前の値を返せばよい
			const config = dynamicRequire(configPath) ?? {};
			const normalizedConfig = sandboxConfigs.normalizeConfig(config, req.params.contentId);
			responseSuccess<SandboxConfigApiResponseData>(res, 200, normalizedConfig);
		} catch (e) {
			next(e);
		}
	};
};

export const createHandlerToGetSandboxConfigPluginCode = (): express.RequestHandler => {
	return async (req, res, next) => {
		try {
			const contentId = req.params.contentId;
			const pluginName = req.params.pluginName;
			const config = sandboxConfigs.get(contentId);

			if (!config.client.external?.[pluginName]) {
				throw new NotFoundError({ errorMessage: `pluginName:${pluginName} is not found.` });
			}

			const pluginPath = path.resolve(config.client.external[pluginName]);
			if (!fs.existsSync(pluginPath)) {
				throw new NotFoundError({ errorMessage: `${pluginName} is not found. path:${config.client.external[pluginName]}` });
			}

			const content = fs.readFileSync(pluginPath);
			// `/contents/${contentId}/sandboxConfig/plugins/${pluginName}` にアクセスで plugin を取得できるようにする
			const responseBody = `window.__testbed.pluginFuncs["${pluginName}"] = function () {
				var module = { exports: {} };
				var exports = module.exports;
				(function () {
    				${ content };
				})();
				return module.exports;
			};`;

			res.contentType("text/javascript");
			res.send(responseBody);
		} catch (e) {
			next(e);
		}
	};
};

export const createHandlerToGetSandboxConfigBgImage = (): express.RequestHandler => {
	return async (req, res, next) => {
		try {
			const contentId = req.params.contentId;
			const config = sandboxConfigs.get(contentId);
			if (config.resolvedBackgroundImagePath) {
				const imgPath = path.resolve(config.resolvedBackgroundImagePath);

				if (!fs.existsSync(imgPath)) {
					throw new NotFoundError({ errorMessage: `backgroundImage is not found. path:${config.resolvedBackgroundImagePath}` });
				}

				// SandboxConfigs#normalizeConfig() で PNG/JPEG 以外のファイルはエラーとしている
				const type = path.extname(imgPath) === ".png" ? "image/png" : "image/jpeg";
				res.contentType(type);
				res.sendFile(imgPath);
			} else {
				throw new BadRequestError({
					errorMessage: `Invalid backgroundImage, The value is not local path. value:${config.displayOptions.backgroundImage}`
				});
			}
		} catch (e) {
			next(e);
		}
	};
};
