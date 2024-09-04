import * as mockfs from "mock-fs";
import * as path from "path";
import * as fs from "fs";
import * as getAudioDuration from "../../getAudioDuration.js";
import { mockGetDuration } from "./helpers/MockGetDuration.js";

describe("getAudioDuration", function () {
	var DUMMY_OGG_DATA = fs.readFileSync(path.resolve(__dirname, "../fixtures/dummy.ogg"));
	var DUMMY_AAC_DATA = fs.readFileSync(path.resolve(__dirname, "../fixtures/dummy.aac"));
	var DUMMY_MP4_DATA = fs.readFileSync(path.resolve(__dirname, "../fixtures/dummy.mp4"));

	// FIXME: ES Module 移行時に削除
	beforeAll(() => {
		jest.spyOn(getAudioDuration, "getAudioDuration").mockImplementation((filepath, logger?: any) => {
			return mockGetDuration(filepath, logger);
		});
	});

	afterAll(() => {
		jest.resetAllMocks();
	});
	// FIXME: ES Module 移行時に削除ここまで

	afterEach(() => {
		mockfs.restore();
	});

	it("measures the duration of ogg", function (done) {
		mockfs({ "dum.ogg": DUMMY_OGG_DATA });
		getAudioDuration.getAudioDuration("./dum.ogg")
			.then((dur: number) => {
				expect(Math.ceil(dur * 1000)).toBe(1250);
				done();
			}, done.fail);
	});

	it("measures the duration of aac", function (done) {
		mockfs({ "dum.aac": DUMMY_AAC_DATA });
		getAudioDuration.getAudioDuration("./dum.aac")
			.then((dur: number) => {
				expect(Math.ceil(dur * 1000)).toBe(302);
				done();
			}, done.fail);
	});

	it("measures the duration of mp4", function (done) {
		mockfs({ "dum.mp4": DUMMY_MP4_DATA });
		getAudioDuration.getAudioDuration("./dum.mp4")
			.then((dur: number) => {
				expect(Math.ceil(dur * 1000)).toBe(302);
				done();
			}, done.fail);
	});
});
