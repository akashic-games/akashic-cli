import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import type { Logger } from "@akashic/akashic-cli-commons";
import * as ini from "ini";

export type StringMap = {[key: string]: string | Object};

export class AkashicConfigFile {
	data: StringMap;
	private _validator: StringMap | null;
	private _path: string;

	constructor(validator: StringMap | null, configPath: string = path.join(os.homedir(), ".akashicrc")) {
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
		return !this._validator || objectGet(this._validator, key, null) != null;
	}

	isValidValue(key: string, value: string): boolean {
		if (!this._validator) return true;
		const reStr: string = objectGet(this._validator, key, null);
		if (reStr == null) return false;
		return (new RegExp(reStr)).test(value);
	}

	getItem(key: string): Promise<string> {
		if (!this.isValidKey(key)) {
			return Promise.reject<string>("invalid key name: " + key);
		}
		return Promise.resolve(objectGet(this.data, key, null));
	}

	setItem(key: string, value: string): Promise<void> {
		objectSet(this.data, key, value);
		return Promise.resolve();
	}

	deleteItem(key: string): Promise<void> {
		if (!this.isValidKey(key)) {
			return Promise.reject("invalid key name: " + key);
		}
		objectUnset(this.data, key);
		return Promise.resolve();
	}
}

export function getConfigItem(validator: StringMap | null, key: string, confPath?: string): Promise<string> {
	const config = new AkashicConfigFile(validator, confPath);
	return config.load().then(() => config.getItem(key));
}

export function setConfigItem(validator: StringMap | null, key: string, value: string, confPath?: string): Promise<void> {
	const config = new AkashicConfigFile(validator, confPath);
	return config.load().then(() => config.setItem(key, value)).then(() => config.save());
}

export function deleteConfigItem(validator: StringMap | null, key: string, confPath?: string): Promise<void> {
	const config = new AkashicConfigFile(validator, confPath);
	return config.load().then(() => config.deleteItem(key)).then(() => config.save());
}

export function listConfigItems(logger: Logger, confPath?: string): Promise<void> {
	const config = new AkashicConfigFile({}, confPath);
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

export function listAllConfigItems(logger: Logger, validator: StringMap, confPath?: string): Promise<void> {
	const config = new AkashicConfigFile({}, confPath);

	return config.load().then(() =>
		Object.keys(validator).forEach(key =>
			logger.print(`${key} = ${objectGet(config.data, key, "")}`)
		)
	);
}

function objectDefine(obj: any, key: string, value: string | Object): void {
	Object.defineProperty(obj, key, { value, writable: true, configurable: true, enumerable: true });
}

function objectGet(obj: any, key: string, value?: any): string {
	if ( obj[key] ) return obj[key];

	const keys = String(key).split(".");
	const prop = keys.shift();
	const result = prop ? new Map(Object.entries(obj)).get(prop) : undefined;
	return keys.length && typeof result !== "undefined" ? objectGet(result, keys.join("."), value) : result || value;
}

function objectSet(obj: any, key: string, value: string): void {
	const keys = key.split(".");
	const prop = keys.shift();
	if (prop && !(prop in obj)) {
		objectDefine(obj, prop, {});
	}
	const result = objectGet(obj, prop!);
	return keys.length ? objectSet(result, keys.join("."), value) : objectDefine(obj, prop!, value);
}

function objectUnset(obj: any, key: string): any {
	const keys = key.split(".");
	const prop = keys.shift();
	if (prop && !(prop in obj)) {
		return undefined;
	}
	if (keys.length) {
		let result = objectGet(obj, prop!);
		result = objectUnset(result, keys.join("."));
		objectSet(obj, prop!, result);
		return obj;
	} else {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { [key!]: _, ...rest } = obj;
		return rest;
	}
}
