import { validateEs5Code } from "../../lib/LintUtil";

describe("convertUtil", function () {
	describe("validateEs5Code", function () {
		it("return empty array if code is written with ES5 syntax", async function () {
			const es5Code = `
				"use strict";
				var fn = function () {
					return 1;
				};
				var array = [1, 2];
				var a = array[0];
				var b = array[1];
			`;
			expect((await validateEs5Code(es5Code)).length).toBe(0);
		});
		it("return error messages if code is not written with ES5 syntax", async function () {
			const es6Code = `
				"use strict";
				const fn = () => {
					return 1;
				}
				const array = [1, 3];
				const [a, b] = array;
			`;
			const result = await validateEs5Code(es6Code);
			expect(result.length).toBe(1);
			expect(result[0]).toEqual({
        line: 3,
        column: 5,
        message: "Parsing error: The keyword \'const\' is reserved"
      });
		});
	});
});