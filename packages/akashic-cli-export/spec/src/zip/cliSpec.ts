import { CliConfigExportZip } from "@akashic/akashic-cli-commons";
import { cli } from "../../../lib/zip/cli";
import * as exp from "../../../lib/zip/exportZip";

describe("Parameter checking from cli() to exportZip()", () => {
	const mockFn = jest.spyOn(exp, "promiseExportZip");
	afterEach(() => {
		mockFn.mockReset();
	});
	afterAll(() => {
		mockFn.mockRestore();
	});

	it("no configs", (done) => {
		const configs = {};
		mockFn.mockImplementation(params => {
			expect(params.bundle).toBeUndefined();
			expect(params.babel).toBeTruthy();
			expect(params.minify).toBeUndefined();
			expect(params.minifyJs).toBeUndefined();
			expect(params.minifyJson).toBeUndefined();
			expect(params.packImage).toBeUndefined();
			expect(params.strip).toBeTruthy();
			expect(params.source).toBeUndefined();
			expect(params.dest).toBeUndefined();
			expect(params.force).toBeUndefined();
			expect(params.hashLength).toBe(0);
			expect(params.logger).toBeDefined();
			expect(params.omitUnbundledJs).toBeUndefined();
			expect(params.targetService).toBeUndefined();
			expect(params.nicolive).toBeUndefined();

			const infoOption = params.exportInfo.option;
			expect(infoOption.quiet).toBeUndefined();
			expect(infoOption.force).toBeUndefined();
			expect(infoOption.strip).toBeUndefined();
			expect(infoOption.minify).toBeUndefined();
			expect(infoOption.minifyJs).toBeUndefined();
			expect(infoOption.minifyJson).toBeUndefined();
			expect(infoOption.bundle).toBeUndefined();
			expect(infoOption.babel).toBeUndefined();
			expect(infoOption.hashFilename).toBeUndefined();
			expect(infoOption.targetService).toBe("none");
			expect(infoOption.nicolive).toBeUndefined();
			return Promise.resolve();
		});
		Promise.resolve().then(() => cli(configs))
			.then(done, done.fail);
	});

	it("with all configs", (done) => {
		const configs: CliConfigExportZip = {
			cwd: "./somewhere",
			quiet: true,
			output: "out.zip",
			force: true,
			strip: true,
			minify: true,
			minifyJs: true,
			minifyJson: true,
			packImage: true,
			bundle: true,
			babel: true,
			hashFilename: 11,
			omitEmptyJs: true,
			omitUnbundledJs: true,
			targetService: "nicolive",
			nicolive: true
		};
		mockFn.mockImplementation(params => {
			expect(params.bundle).toBeTruthy();
			expect(params.babel).toBeTruthy();
			expect(params.minify).toBeTruthy();
			expect(params.minifyJs).toBeTruthy();
			expect(params.minifyJson).toBeTruthy();
			expect(params.packImage).toBeTruthy();
			expect(params.strip).toBeTruthy();
			expect(params.source).toBe("./somewhere");
			expect(params.dest).toBe("out.zip");
			expect(params.force).toBeTruthy();
			expect(params.hashLength).toBe(11);
			expect(params.logger).toBeDefined();
			expect(params.omitUnbundledJs).toBeTruthy();
			expect(params.targetService).toBe("nicolive");
			expect(params.nicolive).toBeTruthy();

			const infoOption = params.exportInfo.option;
			expect(infoOption.quiet).toBeTruthy();
			expect(infoOption.force).toBeTruthy();
			expect(infoOption.strip).toBeTruthy();
			expect(infoOption.minify).toBeTruthy();
			expect(infoOption.minifyJs).toBeTruthy();
			expect(infoOption.minifyJson).toBeTruthy();
			expect(infoOption.bundle).toBeTruthy();
			expect(infoOption.babel).toBeTruthy();
			expect(infoOption.hashFilename).toBe(11);
			expect(infoOption.targetService).toBe("nicolive");
			expect(infoOption.nicolive).toBeTruthy();
			return Promise.resolve();
		 });
		 Promise.resolve().then(() => cli(configs))
			.then(done, done.fail);
	});

	it("nicolive parameter is true", (done) => {
		const configs = { nicolive: true };
		mockFn.mockImplementation(params => {
			expect(params.bundle).toBeTruthy();
			expect(params.babel).toBeTruthy();
			expect(params.strip).toBeTruthy();
			expect(params.bundle).toBeTruthy();
			expect(params.hashLength).toBe(20);
			expect(params.logger).toBeDefined();
			expect(params.targetService).toBe("nicolive");
			expect(params.nicolive).toBeTruthy();

			const infoOption = params.exportInfo.option;
			expect(infoOption.hashFilename).toBeTruthy();
			expect(infoOption.targetService).toBe("nicolive");
			expect(infoOption.nicolive).toBeTruthy();
			return Promise.resolve();
		});
		Promise.resolve().then(() => cli(configs))
			.then(done, done.fail);
	});

	it("when nicolive is true and there are other parameters", (done) => {
		const configs: CliConfigExportZip = {
			nicolive: true,
			bundle: false,
			hashFilename: 22,
			targetService: "none",
			omitUnbundledJs: true
		};
		mockFn.mockImplementation(params => {
			expect(params.bundle).toBeTruthy();
			expect(params.babel).toBeTruthy();
			expect(params.strip).toBeTruthy();
			expect(params.bundle).toBeTruthy();
			expect(params.omitUnbundledJs).toBeTruthy();
			expect(params.hashLength).toBe(22);
			expect(params.logger).toBeDefined();
			expect(params.targetService).toBe("nicolive");
			expect(params.nicolive).toBeTruthy();

			const infoOption = params.exportInfo.option;
			expect(infoOption.hashFilename).toBe(22);
			expect(infoOption.targetService).toBe("nicolive");
			expect(infoOption.nicolive).toBeTruthy();
			return Promise.resolve();
		});
		Promise.resolve().then(() => cli(configs))
			.then(done, done.fail);
	});
});
