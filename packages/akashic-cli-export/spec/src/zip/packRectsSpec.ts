import type { PackTarget } from "../../../lib/zip/packRects";
import { packSmallRects } from "../../../lib/zip/packRects";

describe("packRects", () => {
	describe("packSmallRects()", () => {
		it("can pack small rects", async () => {
			const packResult = await packSmallRects([
				{ name: "a", width: 10, height: 10, data: "A" },
				{ name: "b", width: 32, height: 32, data: "B" },
				{ name: "c", width: 20, height: 20, data: "C" },
				{ name: "d", width: 4, height: 10, data: "D" },
			], 35, 35);
			expect(packResult).toBeTruthy();

			// パッキング結果は実装依存だが、だとしてもこのような単純なケースで以下の最良の結果にならないなら採用すべきでない。
			expect(packResult.rects).toHaveLength(3);
			expect(packResult.rects).toEqual(expect.arrayContaining([
				expect.objectContaining({ name: "a", width: 10, height: 10, data: "A" }),
				expect.objectContaining({ name: "c", width: 20, height: 20, data: "C" }),
				expect.objectContaining({ name: "d", width: 4, height: 10, data: "D" }),
			]));
		});

		it("ignores bleeding out rects", async () => {
			const packResult = await packSmallRects([
				{ name: "a", width: 10, height: 10 },
				{ name: "b", width: 120, height: 10 },
				{ name: "c", width: 10, height: 120 },
				{ name: "d", width: 20, height: 20 }
			] as PackTarget[], 100, 100);

			// パッキング結果は実装依存だが、引数 (100x100) の一片を超えるものは絶対に入らない。
			expect(packResult.rects).toHaveLength(2);
			expect(packResult.rects).toEqual(expect.arrayContaining([
				expect.objectContaining({ name: "a", width: 10, height: 10 }),
				expect.objectContaining({ name: "d", width: 20, height: 20 })
			]));
		});
	});
});
