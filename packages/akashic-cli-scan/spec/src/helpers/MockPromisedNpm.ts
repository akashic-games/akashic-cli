import * as cmn from "@akashic/akashic-cli-commons";

export interface MockPromisedNpmParameterObject extends cmn.PromisedNpmParameterObject {
	expectDependencies: {[key: string]: any};
	expectDevDependencies?: {[key: string]: any};
}

// テスト実行に必要な最低限のNPMメソッドをモック化します。
export class MockPromisedNpm extends cmn.PromisedNpm {
	expectDependencies: {[key: string]: any};
	expectDevDependencies: {[key: string]: any};
	constructor(param: MockPromisedNpmParameterObject) {
		super({});
		this.expectDependencies = param.expectDependencies;
		this.expectDevDependencies = param.expectDevDependencies;
	}
	_load(): Promise<void> {
		return Promise.resolve();
	}

	// モック生成時にexpectDependenciesのみが与えられた場合、暗黙的に `npm ls --production` の振る舞いを模倣します。
	// 同様に、expectDevDependenciesが与えられた場合、`npm ls` の振る舞いを模倣します。
	ls(silent?: boolean): Promise<any> {
		var result = this.expectDependencies;
		if (this.expectDevDependencies) {
			var devList = Object.keys(this.expectDevDependencies);
			devList.forEach((name) => {
				if (!result[name]) result[name] = this.expectDevDependencies[name];
			});
		}
		return new Promise((resolve) => {
			resolve({
				dependencies: result
			});
		})
	}
}
