import { PromisedNpm } from "../PromisedNpm.js";

describe("PromisedNpm", () => {
	describe("ls", () => {
		it("can get json-object", () => {
			(new PromisedNpm({})).ls()
				.then((result) => {
					expect(result.dependencies).toBeDefined();
				});
		});
	});
});
