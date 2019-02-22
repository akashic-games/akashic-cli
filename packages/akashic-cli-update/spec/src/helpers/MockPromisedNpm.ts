import * as cmn from "@akashic/akashic-cli-commons";

export interface MockPromisedNpmParameterObject extends cmn.PromisedNpmParameterObject {
}

// テスト実行に必要な最低限のNPMメソッドをモック化します。
export class MockPromisedNpm extends cmn.PromisedNpm {
	constructor(param: MockPromisedNpmParameterObject) {
		super({});
	}
	_load(): Promise<void> {
		return Promise.resolve();
	}
	update(moduleNames?: string[]): Promise<void> {
		return Promise.resolve();
	}
}
