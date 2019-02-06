import * as fs from "fs";
import { Logger } from "./Logger";
import { ConsoleLogger } from "./ConsoleLogger";
import { GameConfiguration } from "./GameConfiguration";

export interface ConfigurationParameterObject {
	content: GameConfiguration;
	logger?: Logger;
}

export class Configuration {
	_content: GameConfiguration;
	_logger: Logger;

	constructor(param: ConfigurationParameterObject) {
		this._content = param.content;
		this._logger = param.logger || new ConsoleLogger();
	}

	getContent(): GameConfiguration {
		return this._content;
	}

	vacuumGlobalScripts(): void {
		this._content.globalScripts = this._content.globalScripts.filter((filePath) => {
			try {
				// v6.3.0未満のv6系ではfs.constantsが存在していないためfs.F_OKを使えるようにする必要がある。また、fsにF_OKの型定義はないのでanyに変換する必要もある。
				const fOk = fs.constants === undefined ? (fs as any).F_OK : fs.constants.F_OK;
				fs.accessSync(filePath, fOk);
			} catch (err) {
				if (err.code === "ENOENT") {
					return false;
				} else {
					throw err;
				}
			}
			return true;
		});
	}
}
