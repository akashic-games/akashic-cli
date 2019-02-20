import { Logger } from "./Logger";
import { ConsoleLogger } from "./ConsoleLogger";
import { exec } from "child_process";

export interface PromisedNpmParameterObject {
	logger?: Logger;
}

export interface NpmLsResultObject {
	dependencies?: {[key: string]: NpmLsResultObject};
}

export class PromisedNpm {
	_logger: Logger;

	constructor(param: PromisedNpmParameterObject) {
		this._logger = param.logger || new ConsoleLogger();
	}

	install(moduleNames: string[] = []): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			this._logger.info("Installing " + moduleNames + "...");
			exec("npm install --save " + moduleNames.join(" "), (err: any) => {
				err ? reject(err) : resolve();
			});
		});
	}

	link(moduleNames: string[] = []): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			this._logger.info("Linking " + moduleNames + "...");
			exec("npm link " + moduleNames.join(" "), (err: any) => {
				err ? reject(err) : resolve();
			});
		});
	}

	uninstall(moduleNames: string[] = []): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			this._logger.info("Uninstalling " + moduleNames + "...");
			exec("npm uninstall --save " + moduleNames.join(" "), (err: any) => {
				err ? reject(err) : resolve();
			});
		});
	}

	unlink(moduleNames: string[] = []): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			this._logger.info("Unlinking " + moduleNames + "...");
			exec("npm unlink " + moduleNames.join(" "), (err: any) => {
				err ? reject(err) : resolve();
			});
		});
	}

	shrinkwrap(): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			this._logger.info("Shrinkwrapping...");
			exec("npm shrinkwrap", (err: any) => {
				if (err) {
					reject(err);
				} else {
					this._logger.info("Added npm-shrinkwrap.json");
					resolve();
				}
			});
		});
	}

	ls(silent: boolean = false): Promise<NpmLsResultObject> {
		return new Promise<NpmLsResultObject>((resolve, reject) => {
			this._logger.info("Listing dependencies ...");
			exec("npm ls --json --production" + (silent ? " --silent" : ""), (err: any, stdout: string, stderr: string) => {
				if (err) {
					if (stderr.indexOf("extraneous") !== -1) {
						this._logger.error("Extraneous module found in node_modules. You must install modules using akashic-cli.");
					}
					return reject(err);
				}
				const result = JSON.parse(stdout); // npmから返るstdoutは必ずJSON形式。エラーがある場合はerrとstderrで返される。
				resolve(result);
			});
		});
	}

	update(moduleNames: string[] = []): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			this._logger.info("Update dependencies ...");
			exec("npm update " + moduleNames.join(" "), (err: any) => {
				err ? reject(err) : resolve();
			});
		});
	}
}
