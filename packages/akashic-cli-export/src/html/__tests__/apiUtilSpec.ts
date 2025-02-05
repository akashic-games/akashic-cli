import * as apiUtil from "../apiUtil.js";

describe("apiUtil", function () {
	describe("getFromHttps", function () {
		it("can get resource with https-protocol", () => {
			return Promise.resolve()
				.then(function () {
					return apiUtil.getFromHttps(
						"https://raw.githubusercontent.com/akashic-games/akashic-cli-export-html/master/package.json"
					);
				})
				.then(function (data: string): void {
					const jsonData = JSON.parse(data);
					expect(jsonData.name).toBe("@akashic/akashic-cli-export-html");
					expect(jsonData.version).toMatch(/^\d+\.\d+\.\d+$/);
				});
		});
		it("can not get resource with protocol other than https", () => {
			return Promise.resolve()
				.then(function () {
					return apiUtil.getFromHttps("http://akashic-games.github.io/notfound");
				})
				.then(function () {
					return Promise.reject();
				})
				.catch(function (err: any) {
					expect(err.message).toBe("Protocol \"http:\" not supported. Expected \"https:\"");
				});
		});
		it("throw error when http-status-code is over 400", () => {
			return Promise.resolve()
				.then(function () {
					return apiUtil.getFromHttps("https://akashic-games.github.io/notfound");
				})
				.then(function () {
					return Promise.reject();
				})
				.catch(function (err: any) {
					// レスポンスコードが不定のため先頭一致で判定
					expect(err.message).match(
						/^Failed to get resource\. url: https:\/\/akashic-games\.github\.io\/notfound\. status code:.*/
					);
				});
		});
	});
});
