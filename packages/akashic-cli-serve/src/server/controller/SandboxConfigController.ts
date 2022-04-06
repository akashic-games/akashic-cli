import * as fs from "fs";
import * as path from "path";
import type * as express from "express";
import type {
	SandboxConfigApiResponseData,
	SandboxConfigPluginInfoApiResponseData,
	SandboxConfigPluginCodeApiResponse
} from "../../common/types/ApiResponse";
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

export const createHandlerToGetSandboxConfigPluginInfo = (): express.RequestHandler => {
	return async (req, res, next) => {
		try {
			const contentId = req.params.contentId;
			const config = sandboxConfigs.get(contentId);
			let response;
			if (config.client.external.scriptPath) {
				const pluginPath = path.resolve(config.client.external.scriptPath);
				if (!fs.existsSync(pluginPath)) {
					throw new NotFoundError({ errorMessage: `plugin is not found. path:${config.client.external.scriptPath}` });
				}

				const plugin: () => any = require(pluginPath); // eslint-disable-line @typescript-eslint/no-var-requires
				const plugins: { [key: string]: Function } = {};
				const pluginValues = plugin();
				Object.keys(pluginValues).forEach((key) => {
					plugins[key] = pluginValues[key];
				});

				response = {
					path: pluginPath,
					pluginNames: Object.keys(plugins)
				};
				if (!config.client.external.plugins) config.client.external.plugins = {};
				config.client.external.plugins = plugins;
			}
			responseSuccess<SandboxConfigPluginInfoApiResponseData>(res, 200, response);
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

			if (!config.client.external?.plugins[pluginName]) {
				throw new NotFoundError({ errorMessage: `pluginName:${pluginName} is not found.` });
			}
			const pluginFunc = config.client.external.plugins[pluginName];
			responseSuccess<SandboxConfigPluginCodeApiResponse>(res, 200, pluginFunc.toString());
		} catch (e) {
			next(e);
		}
	};
};
