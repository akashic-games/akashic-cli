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
					return apiUtil.getFromHttps("http://akashic-games.github.io/notfound");
				})
				.then(function () {
					return done.fail();
				})
				.catch(function (err: any) {
					expect(err.message).toBe("Protocol \"http:\" not supported. Expected \"https:\"");
					done();
				});
		});
		it("throw error when URL does not exist", (done) => {
			Promise.resolve()
				.then(function () {
					return apiUtil.getFromHttps("https://akashic-games.github.io/notfound");
				})
				.then(function () {
					return done.fail();
				})
				.catch(function (err: any) {
					// レスポンスコードが不定のため先頭一致で判定
					expect(err.message.startsWith(
						"Failed to get resource. url: https://akashic-games.github.io/notfound. status code: ")
					).toBe(true);
					done();
				});
		});
	});
});
