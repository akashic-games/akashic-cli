const PromisedNpm = require("../lib/PromisedNpm").PromisedNpm;

describe("PromisedNpm", function () {
	describe("ls", function() {
		it("can get json-object", function () {
			(new PromisedNpm({})).ls()
				.then((result) => {
					expect(result).toContain("name");
					expect(result.name).toBe("@akashic/akashic-cli-commons");
					expect(result).toContain("version");
					expect(result).toContain("dependencies");
				});
		});
	});
});
