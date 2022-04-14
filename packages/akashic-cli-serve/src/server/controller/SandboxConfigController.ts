import * as fs from "fs";
import * as path from "path";
import type * as express from "express";
import * as mime from "mime";
import type { SandboxConfigApiResponseData } from "../../common/types/ApiResponse";
import { NotFoundError } from "../common/ApiError";
import { responseSuccess } from "../common/ApiResponse";
import { dynamicRequire } from "../domain/dynamicRequire";
import * as sandboxConfigs from "../domain/SandboxConfigs";

export const createHandlerToGetSandboxConfig = (dirPaths: string[]): express.RequestHandler => {
	return async (req, res, next) => {
		try {
			const contentId = Number(req.params.contentId);
			if (!dirPaths[contentId]) {
				throw new NotFoundError({ errorMessage: `contentId:${contentId} is not found.` });
			}
			const configPath = path.resolve(dirPaths[contentId], "sandbox.config.js");
			// TODO ファイル監視。内容に変化がなければ直前の値を返せばよい
			const config = dynamicRequire(configPath);
			responseSuccess<SandboxConfigApiResponseData>(res, 200, config);
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

			if (!config.client.external[pluginName]) {
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
			if (config.backgroundImage) {
				const imgPath = path.resolve(config.backgroundImage);
				if (!fs.existsSync(imgPath)) {
					throw new NotFoundError({ errorMessage: `backgroundImage is not found. path:${config.backgroundImage}` });
				}

				const type = mime.lookup(imgPath);
				res.contentType(type);
				res.sendFile(imgPath);
			}
		} catch (e) {
			next(e);
		}
	};
};
