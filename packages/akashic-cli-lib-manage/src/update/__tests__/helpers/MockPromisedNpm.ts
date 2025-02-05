import * as cmn from "@akashic/akashic-cli-commons";

export interface MockPromisedNpmParameterObject extends cmn.PromisedNpmParameterObject {}

export class MockPromisedNpm extends cmn.PromisedNpm {

	async _load() {
		// do nothing
	}
	async update(_moduleNames?: string[]) {
		// do nothing
	}
}
