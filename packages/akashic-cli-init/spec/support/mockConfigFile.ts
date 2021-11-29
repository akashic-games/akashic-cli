import { AkashicConfigFile} from "@akashic/akashic-cli-extra/lib/config";

export class MockTemplateFile extends AkashicConfigFile {
	private _obj: any;
	constructor(obj: any) {
		super(obj);
		this._obj = obj;
	};

	load = function () {
		return Promise.resolve();
	};
	save = function () {
		return Promise.resolve();
	};
	isValidKey = function (key: string) {
		return !!this._obj[key];
	};
	isValidValue = function (key: string, value: string) {
		return true;
	};
	getItem = function (key: string) {
		return Promise.resolve(this._obj[key]);
	};
	setItem = function (key: string, value: string) {
		this._obj[key] = value;
		return Promise.resolve();
	};
	deleteItem = function (key: string) {
		delete this._obj[key];
		return Promise.resolve();
	};
}
