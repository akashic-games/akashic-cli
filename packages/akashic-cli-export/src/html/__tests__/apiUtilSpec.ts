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
					return apiUtil.getFromHttps("http://example.com");
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
					return apiUtil.getFromHttps("https://example.com/notfound");
				})
				.then(function () {
					return Promise.reject();
				})
				.catch(function (err: any) {
					// TODO: サーバのレスポンスコードに依存しているため、テストの根本的な修正が必要
					// expect(err.message).toBe("Failed to get resource. url: https://example.com/notfound. status code: 404.");
					// レスポンスコードが不定のため先頭一致で判定
					expect(err.message.startsWith("Failed to get resource. url: https://example.com/notfound. status code: ")).toBe(true);
				});
		});
	});
});
