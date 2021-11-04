import { PromisedNpm } from "../../lib/PromisedNpm";

describe("PromisedNpm", function () {
	describe("ls", function() {
		it("can get json-object", function () {
			(new PromisedNpm({})).ls()
				.then((result) => {
					expect(result.dependencies).toBeDefined();
				});
		});
	});
});
