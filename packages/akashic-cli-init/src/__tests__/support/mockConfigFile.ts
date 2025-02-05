import { AkashicConfigFile } from "@akashic/akashic-cli-extra/lib/config/config.js";

export class MockConfigFile extends AkashicConfigFile {
	private _obj: any;
	constructor(obj: any) {
		super(obj);
		this._obj = obj;
	};

	load(): Promise<void> {
		return Promise.resolve();
	};
	save(): Promise<void> {
		return Promise.resolve();
	};
	isValidKey(key: string): boolean {
		return !!this._obj[key];
	};
	isValidValue(_key: string, _value: string): boolean {
		return true;
	};
	getItem(key: string): Promise<string> {
		return Promise.resolve(this._obj[key]);
	};
	setItem(key: string, value: string): Promise<void> {
		this._obj[key] = value;
		return Promise.resolve();
	};
	deleteItem(key: string): Promise<void> {
		delete this._obj[key];
		return Promise.resolve();
	};
}
