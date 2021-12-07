import * as fs from "fs";
import * as path from "path";
import * as cmn from "@akashic/akashic-cli-commons";
import * as fsx from "fs-extra";
import * as apiUtil from "../../../lib/html/apiUtil";
import * as atsumaru from "../../../lib/html/exportAtsumaru";
import { ExportHTMLParameterObject } from "../../../lib/html/exportHTML";

// zipの型定義ファイルが存在しないのでimportではなくrequireする
const zip = require("zip");

describe("exportAtsumaru", function () {
	const dirPath = path.join(__dirname, "..", "..", "fixtures", "sample_game");
	const outputDirPath = path.join(dirPath, "output");
	let cliParam: ExportHTMLParameterObject;
	let mockApiUtil: jest.SpyInstance = null;
	beforeEach(function() {
		cliParam = {
			logger: undefined,
			cwd: dirPath,
			source: ".",
			output: "output",
			hashLength: 20,
			bundle: true,
			force: true,
			needsUntaintedImageAsset: true,
			strip: true,
			minify: false,
			magnify: false,
			unbundleText: false,
			lint: false
		};
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
		mockApiUtil = jest.spyOn(apiUtil, "getFromHttps").mockResolvedValue(
			JSON.stringify(versionTbl)
		);
	});
	afterAll(() => {
		mockApiUtil.mockRestore();
	});

	describe("promiseExportAtsumaru", function () {
		it("output bundeled file(index.html) and hashed files", function (done: jest.DoneCallback) {
			Promise.resolve()
				.then(function () {
					return atsumaru.promiseExportAtsumaru(cliParam);
				})
				.then(function (dest: string) {
					expect(dest).toBe(outputDirPath);
					expect(fs.existsSync(path.join(outputDirPath, "index.html"))).toBe(true);
					const expectedFilePath = cmn.Renamer.hashFilepath("script/aez_bundle_main.js", 20);
					expect(fs.existsSync(path.join(outputDirPath, expectedFilePath))).toBe(true);
					expect(fs.existsSync(path.join(outputDirPath, "script", "main.js"))).toBe(false);
				})
				.then(done, done.fail);
		});
		it("add untainted to image assets on game.json", function (done: jest.DoneCallback) {
			Promise.resolve()
				.then(function () {
					return atsumaru.promiseExportAtsumaru(cliParam);
				})
				.then(function (dest: string) {
					expect(dest).toBe(outputDirPath);
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
		it("add information about environment to game.json (v1)", function (done: jest.DoneCallback) {
			Promise.resolve()
				.then(function () {
					return atsumaru.promiseExportAtsumaru(cliParam);
				})
				.then(function (dest: string) {
					expect(dest).toBe(outputDirPath);
					const gameJson = require(path.join(outputDirPath, "game.json"));
					expect(gameJson.environment.external.send).toBe("0");
					expect(gameJson.environment["akashic-runtime"].version).toMatch(/^~1\.1\.\d+(-.*)?$/);
					expect(gameJson.environment["akashic-runtime"].flavor).toBe(undefined);
				})
				.then(done, done.fail);
		});
		it("add information about environment to game.json (v2)", function (done: jest.DoneCallback) {
			const targetDirPath = path.join(__dirname, "..", "..", "fixtures", "sample_game_v2");
			const outputDirPath = path.join(targetDirPath, "output");
			Promise.resolve()
				.then(function () {
					cliParam.cwd = targetDirPath;
					return atsumaru.promiseExportAtsumaru(cliParam);
				})
				.then(function (dest: string) {
					expect(dest).toBe(outputDirPath);
					const gameJson = require(path.join(outputDirPath, "game.json"));
					expect(gameJson.environment.external.send).toBe("0");
					expect(gameJson.environment["akashic-runtime"].version).toMatch(/^~2\.1\.\d+(-.*)?$/);
					expect(gameJson.environment["akashic-runtime"].flavor).toBe("-canvas");
				})
				.then(function() {
					fsx.removeSync(outputDirPath);
				})
				.then(done, done.fail);
		});
		it("add information about environment to game.json (v3), keep environment.nicolive", function (done: jest.DoneCallback) {
			const targetDirPath = path.join(__dirname, "..", "..", "fixtures", "sample_game_v3");
			const outputDirPath = path.join(targetDirPath, "output");
			Promise.resolve()
				.then(function () {
					cliParam.cwd = targetDirPath;
					return atsumaru.promiseExportAtsumaru(cliParam);
				})
				.then(function (dest: string) {
					expect(dest).toBe(outputDirPath);
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
		it("does not add akashic-runtime-information about environment to game.json, if it is already written", (done: jest.DoneCallback) =>{
			const targetDirPath = path.join(__dirname, "..", "..", "fixtures", "sample_game_with_akashic_runtime");
			const outputDirPath = path.join(targetDirPath, "output");
			Promise.resolve()
				.then(function () {
					cliParam.cwd = targetDirPath;
					return atsumaru.promiseExportAtsumaru(cliParam);
				})
				.then(function (dest: string) {
					expect(dest).toBe(outputDirPath);
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
		it("create zip when output destination includes '.zip'", function (done: jest.DoneCallback) {
			cliParam.output = outputDirPath + ".zip";
			Promise.resolve()
				.then(function () {
					return atsumaru.promiseExportAtsumaru(cliParam);
				})
				.then(function (dest: string) {
					expect(dest).toBe(outputDirPath + ".zip");
					const files = zip.Reader(fs.readFileSync(outputDirPath + ".zip")).toObject("utf8");
					const fileNames = Object.keys(files);
					expect(fileNames).toContain("output/game.json");
					expect(fileNames).toContain("output/index.html");
					const expectedFilePath = cmn.Renamer.hashFilepath("script/aez_bundle_main.js", 20);
					expect(fileNames).toContain("output/" + expectedFilePath);
				})
				.then(function() {
					fsx.removeSync(outputDirPath + ".zip");
				})
				.then(done, done.fail);
		});
		it("throw error when output destination is not specified", function (done: jest.DoneCallback) {
			delete cliParam.output;
			Promise.resolve()
				.then(function () {
					return atsumaru.promiseExportAtsumaru(cliParam);
				})
				.then(function () {
					return done.fail();
				})
				.catch(function (err: any) {
					expect(err.message).toBe("--output option must be specified.");
					done();
				});
		});
		it("If already outputted, force option error will be returned", function (done: jest.DoneCallback) {
			const targetDirPath = path.join(__dirname, "..", "..", "fixtures", "sample_game_with_akashic_runtime");
			const outputDirPath = path.join(targetDirPath, "output");
			Promise.resolve()
				.then(function () {
					return atsumaru.promiseExportAtsumaru(cliParam);
				})
				.then(function () {
					delete cliParam.force;
					return atsumaru.promiseExportAtsumaru(cliParam);
				})
				.catch(function (err: any) {
					expect(err.indexOf("Cannot overwrite without force option.") !== -1).toBeTruthy();
					fsx.removeSync(outputDirPath);
					done();
				});
		});
	});
});
