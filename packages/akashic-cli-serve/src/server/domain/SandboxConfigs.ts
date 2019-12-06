import * as path from "path";
import { SandboxConfig } from "../../common/types/SandboxConfig";
import { dynamicRequire } from "./dynamicRequire";
import { BadRequestError } from "../common/ApiError";

class SandboxConfigs extends Array<SandboxConfig> {
	constructor() {
		super();
	}
	init(): void {
		this.length = 0;
	}
}
export const sandboxConfigs = new SandboxConfigs();

export function loadSandboxConfigJs(targetDir: string): SandboxConfig {
	const config = dynamicRequire<SandboxConfig>(path.resolve(targetDir, "sandbox.config.js")) || {};
	validateConfig(config);
	return config;
}

function validateConfig(config: SandboxConfig): void {
	const externalAssets = config?.externalAssets === undefined ? [] : config.externalAssets;
	if (externalAssets) {
		// sandbox.config.js の externalAssets に値がある場合は (string|regexp)[] でなければエラーとする
		if (!(externalAssets instanceof Array)) {
			throw new BadRequestError({ errorMessage: "Invalid externalAssets, Not Array" });
		}

		if ( externalAssets.length > 0) {
			const found = externalAssets.find((url: any) => typeof url !== "string" && !(url instanceof RegExp));
			if (found) {
				throw new BadRequestError({errorMessage: `Invalid externalAssets, The value is neither a string or regexp. value:${ found }` });
			}
		}
	}
}
