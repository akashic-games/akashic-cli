import * as apiUtil from "../../../lib/html/apiUtil";

describe("apiUtil", function () {
	describe("getFromHttps", function () {
		it("can get resource with https-protocol", (done) => {
			Promise.resolve()
				.then(function () {
					return apiUtil.getFromHttps(
						"https://raw.githubusercontent.com/akashic-games/akashic-cli-export-html/master/package.json"
					);
				})
				.then(function (data: string): void {
					const jsonData = JSON.parse(data);
					expect(jsonData.name).toBe("@akashic/akashic-cli-export-html");
					expect(jsonData.version).toMatch(/^\d+\.\d+\.\d+$/);
				})
				.then(done, done.fail);
		});
		it("can not get resource with protocol other than https", (done) => {
			Promise.resolve()
				.then(function () {
					return apiUtil.getFromHttps("http://example.com");
				})
				.then(function () {
					return done.fail();
				})
				.catch(function (err: any) {
					expect(err.message).toBe("Protocol \"http:\" not supported. Expected \"https:\"");
					done();
				});
		});
		it("throw error when http-status-code is over 400", (done) => {
			Promise.resolve()
				.then(function () {
					return apiUtil.getFromHttps("https://example.com/notfound");
				})
				.then(function () {
					return done.fail();
				})
				.catch(function (err: any) {
					// TODO: サーバのレスポンスコードに依存しているため、テストの根本的な修正が必要
					// expect(err.message).toBe("Failed to get resource. url: https://example.com/notfound. status code: 404.");
					// レスポンスコードが不定のため先頭一致で判定
					expect(err.message.startsWith("Failed to get resource. url: https://example.com/notfound. status code: ")).toBe(true);
					done();
				});
		});
	});
});
