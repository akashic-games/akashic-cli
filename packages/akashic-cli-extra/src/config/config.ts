import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import * as ini from "ini";
import * as lodashGet from "lodash.get";
import * as lodashSet from "lodash.set";
import * as lodashUnset from "lodash.unset";
import { Logger } from "@akashic/akashic-cli-commons";

export type StringMap = {[key: string]: string};

export class AkashicConfigFile {
	data: StringMap;
	private _validator: StringMap;
	private _path: string;

	constructor(validator: StringMap, configPath: string = path.join(os.homedir(), ".akashicrc")) {
		this._validator = validator;
		this.data = {};
		this._path = configPath;
	}

	load(): Promise<void> {
		return new Promise<void>((resolve, reject) =>
			fs.readFile(this._path, "utf8", (err, str) => {
				if (err) {
					if (err.code === "ENOENT") {
						resolve(); // 設定ファイル未作成状態
						return;
					}
					reject(err);
					return;
				}
				this.data = ini.decode(str);
				resolve();
			})
		);
	}

	save(): Promise<void> {
		return new Promise<void>((resolve, reject) =>
			fs.writeFile(this._path, ini.encode(this.data), err => {
				if (err) {
					reject(err);
					return;
				}
				resolve();
			})
		);
	}

	isValidKey(key: string): boolean {
		return !this._validator || lodashGet(this._validator, key, null) != null;
	}

	isValidValue(key: string, value: string): boolean {
		if (!this._validator) return true;
		const reStr: string = lodashGet(this._validator, key, null);
		if (reStr == null) return null;
		return (new RegExp(reStr)).test(value);
	}

	getItem(key: string): Promise<string> {
		if (!this.isValidKey(key)) {
			return Promise.reject<string>("invalid key name: " + key);
		}
		return Promise.resolve(lodashGet(this.data, key, null));
	}

	setItem(key: string, value: string): Promise<void> {
		if (!this.isValidKey(key)) {
			return Promise.reject("invalid key name: " + key);
		}
		if (!this.isValidValue(key, value)) {
			return Promise.reject("invalid value: " + value);
		}
		lodashSet(this.data, key, value);
		return Promise.resolve();
	}

	deleteItem(key: string): Promise<void> {
		if (!this.isValidKey(key)) {
			return Promise.reject("invalid key name: " + key);
		}
		lodashUnset(this.data, key);
		return Promise.resolve();
	}
}

export function getConfigItem(validator: StringMap, key: string): Promise<string> {
	const config = new AkashicConfigFile(validator);
	return config.load().then(() => config.getItem(key));
}

export function setConfigItem(validator: StringMap, key: string, value: string): Promise<void> {
	const config = new AkashicConfigFile(validator);
	return config.load().then(() => config.setItem(key, value)).then(() => config.save());
}

export function deleteConfigItem(validator: StringMap, key: string): Promise<void> {
	const config = new AkashicConfigFile(validator);
	return config.load().then(() => config.deleteItem(key)).then(() => config.save());
}

export function listConfigItems(logger: Logger): Promise<void> {
	const config = new AkashicConfigFile({});
	return config.load().then(() => {
		function traverse(data: {[key: string]: any}, prefix: string = ""): void {
			Object.keys(data).forEach(key => {
				if (typeof data[key] === "object") {
					traverse(data[key], `${prefix}${key}.`);
				} else {
					logger.print(`${prefix}${key} = ${data[key]}`);
				}
			});
		}
		traverse(config.data);
	});
}

export function listAllConfigItems(logger: Logger, validator: StringMap): Promise<void> {
	const config = new AkashicConfigFile({});

	return config.load().then(() =>
		Object.keys(validator).forEach(key =>
			logger.print(`${key} = ${lodashGet(config.data, key, "")}`)
		)
	);
}
