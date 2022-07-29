import * as fs from "fs";
import * as path from "path";
import { CliConfigExportHtml } from "@akashic/akashic-cli-commons";
import * as Renamer from "@akashic/akashic-cli-commons/lib/Renamer";
import * as fsx from "fs-extra";
import { cli } from "../../../lib/html/cli";
import * as transformCompleteEnvironment from "../../../lib/zip/transformCompleteEnvironment";

// zipの型定義ファイルが存在しないのでimportではなくrequireする
const zip = require("zip");

describe("exportAtsumaru", function () {
	const dirPath = path.join(__dirname, "..", "..", "fixtures", "sample_game");
	const outputDirPath = path.join(dirPath, "output");
	let mockApiUtil: jest.SpyInstance = null!;

	const paramBase: CliConfigExportHtml = {
		cwd: dirPath,
		source: ".",
		output: "output",
		force: true,
		packImage: true,
		magnify: true,
		atsumaru: true,
	};

	beforeEach(function() {
		// do nothing.
	});
	afterEach(function() {
		fsx.removeSync(outputDirPath);
	});
	beforeAll(() => {
		const versionTbl = {
			"latest": {
				"1": "1.1.16-1",
				"2": "2.1.49-2",
				"3": "3.0.2-3"
			}
		};
		mockApiUtil = jest.spyOn(transformCompleteEnvironment, "getFromHttps").mockResolvedValue(
			JSON.stringify(versionTbl)
		);
	});
	afterAll(() => {
		mockApiUtil.mockRestore();
	});

	describe("atsumaru: true", function () {
		it("output bundeled file(index.html) and hashed files", (done) => {
			const cliParam = { ...paramBase };
			Promise.resolve()
				.then(function () {
					return cli(cliParam);
				})
				.then(function () {
					expect(fs.existsSync(path.join(outputDirPath, "index.html"))).toBe(true);
					const expectedFilePath = Renamer.hashFilepath("script/aez_bundle_main.js", 20);
					expect(fs.existsSync(path.join(outputDirPath, expectedFilePath))).toBe(true);
					expect(fs.existsSync(path.join(outputDirPath, "script", "main.js"))).toBe(false);
				})
				.then(done, done.fail);
		});

		it("add untainted to image assets on game.json", (done) => {
			const cliParam = { ...paramBase };
			Promise.resolve()
				.then(function () {
					return cli(cliParam);
				})
				.then(function () {
					const gameJson = require(path.join(outputDirPath, "game.json"));
					// ImageAssetならばuntaintedオプションが付与されることを確認
					expect(gameJson.assets.sample.type).toBe("image");
					expect(gameJson.assets.sample.hint.untainted).toBeTruthy();
					// ImageAsset以外のアセットに対してはuntaintedオプションは付与されない
					expect(gameJson.assets.aez_bundle_main.type).toBe("script");
					expect(gameJson.assets.aez_bundle_main.hint).toBeUndefined();
				})
				.then(done, done.fail);
		});

		it("add information about environment to game.json (v1)", (done) => {
			const cliParam = { ...paramBase };
			Promise.resolve()
				.then(function () {
					return cli(cliParam);
				})
				.then(function () {
					const gameJson = require(path.join(outputDirPath, "game.json"));
					expect(gameJson.environment.external.send).toBe("0");
					expect(gameJson.environment["akashic-runtime"].version).toMatch(/^~1\.\d+\.\d+(-.*)?$/);
					expect(gameJson.environment["akashic-runtime"].flavor).toBe(undefined);
				})
				.then(done, done.fail);
		});

		it("add information about environment to game.json (v2)", (done) => {
			const targetDirPath = path.join(__dirname, "..", "..", "fixtures", "sample_game_v2");
			const outputDirPath = path.join(targetDirPath, "output");
			const cliParam = { ...paramBase, cwd: targetDirPath };
			Promise.resolve()
				.then(function () {
					return cli(cliParam);
				})
				.then(function () {
					const gameJson = require(path.join(outputDirPath, "game.json"));
					expect(gameJson.environment.external.send).toBe("0");
					expect(gameJson.environment["akashic-runtime"].version).toMatch(/^~2\.\d+\.\d+(-.*)?$/);
					expect(gameJson.environment["akashic-runtime"].flavor).toBe("-canvas");
				})
				.then(function() {
					fsx.removeSync(outputDirPath);
				})
				.then(done, done.fail);
		});

		it("add information about environment to game.json (v3), keep environment.nicolive", (done) => {
			const targetDirPath = path.join(__dirname, "..", "..", "fixtures", "sample_game_v3");
			const outputDirPath = path.join(targetDirPath, "output");
			const cliParam = { ...paramBase, cwd: targetDirPath };
			Promise.resolve()
				.then(function () {
					return cli(cliParam);
				})
				.then(function () {
					const gameJson = require(path.join(outputDirPath, "game.json"));
					expect(gameJson.environment.external.send).toBe("0");
					expect(gameJson.environment["akashic-runtime"].version).toMatch(/^~3\.\d+\.\d+(-.*)?$/);
					expect(gameJson.environment["akashic-runtime"].flavor).toBe("-canvas");
					expect(gameJson.environment.nicolive.supportedModes.length).toBe(1);
					expect(gameJson.environment.nicolive.supportedModes).toContain("single");
				})
				.then(function() {
					fsx.removeSync(outputDirPath);
				})
				.then(done, done.fail);
		});

		// eslint-disable-next-line max-len
		it("does not add akashic-runtime-information about environment to game.json, if it is already written", (done) => {
			const targetDirPath = path.join(__dirname, "..", "..", "fixtures", "sample_game_with_akashic_runtime");
			const outputDirPath = path.join(targetDirPath, "output");
			const cliParam = { ...paramBase, cwd: targetDirPath };
			Promise.resolve()
				.then(function () {
					return cli(cliParam);
				})
				.then(function () {
					const gameJson = require(path.join(outputDirPath, "game.json"));
					expect(gameJson.environment.external.send).toBe("0");
					expect(gameJson.environment["akashic-runtime"].version).toBe("~1.0.9-beta");
					expect(gameJson.environment["akashic-runtime"].flavor).toBe(undefined);
					expect(gameJson.environment.nicolive.supportedModes.length).toBe(2);
					expect(gameJson.environment.nicolive.supportedModes).toContain("single");
					expect(gameJson.environment.nicolive.supportedModes).toContain("ranking");
				})
				.then(function() {
					fsx.removeSync(outputDirPath);
				})
				.then(done, done.fail);
		});

		it("create zip when output destination includes '.zip'", (done) => {
			const output = outputDirPath + ".zip";
			const cliParam = { ...paramBase, output };
			Promise.resolve()
				.then(function () {
					return cli(cliParam);
				})
				.then(function () {
					const files = zip.Reader(fs.readFileSync(output)).toObject("utf8");
					const fileNames = Object.keys(files);
					expect(fileNames).toContain("game.json");
					expect(fileNames).toContain("index.html");
					const expectedFilePath = Renamer.hashFilepath("script/aez_bundle_main.js", 20);
					expect(fileNames).toContain(expectedFilePath);
				})
				.then(function() {
					fsx.removeSync(outputDirPath + ".zip");
				})
				.then(done, done.fail);
		});

		it("throw error when output destination is not specified", (done) => {
			const cliParam = { ...paramBase, output: undefined as any as string }; // 型上ありえないが異常系確認のため
			Promise.resolve()
				.then(function () {
					return cli(cliParam);
				})
				.then(function () {
					return done.fail();
				})
				.catch(function (err: any) {
					expect(err.message).toBe("--output option must be specified.");
					done();
				});
		});

		it("If already outputted, force option error will be returned", (done) => {
			const cliParam = { ...paramBase };
			Promise.resolve()
				.then(function () {
					return cli(cliParam);
				})
				.then(function () {
					delete cliParam.force;
					return cli(cliParam);
				})
				.catch(function (err: any) {
					expect(err.message.indexOf("already exists. Use --force option to overwrite.") !== -1).toBeTruthy();
					fsx.removeSync(outputDirPath);
					done();
				});
		});
	});
});
