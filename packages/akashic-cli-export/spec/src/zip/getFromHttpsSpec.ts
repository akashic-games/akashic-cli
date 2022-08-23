import { getFromHttps } from "../../../lib/zip/transformCompleteEnvironment";

describe("transformCompleteEnvironment", function () {
	describe("getFromHttps", function () {
		it("can get resource with https-protocol", (done) => {
			Promise.resolve()
				.then(function () {
					return getFromHttps(
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
					return getFromHttps("http://test.example");
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
			const url = "https://raw.githubusercontent.com/akashic-games/akashic-cli-export-html/master/not-exists.json";
			Promise.resolve()
				.then(function () {
					return getFromHttps(url);
				})
				.then(function () {
					return done.fail();
				})
				.catch(function (err: any) {
					expect(err.message).toBe(`Failed to get resource. url: ${url}. status code: 404.`);
					done();
				});
		});
	});
});
