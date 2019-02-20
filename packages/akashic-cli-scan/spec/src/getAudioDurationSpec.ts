import * as mockfs from "mock-fs";
import * as path from "path";
import * as fs from "fs";
import { getAudioDuration } from "../../lib/getAudioDuration";

describe("getAudioDuration", function () {
	var DUMMY_OGG_DATA = fs.readFileSync(path.resolve(__dirname, "../fixtures/dummy.ogg"));
	var DUMMY_AAC_DATA = fs.readFileSync(path.resolve(__dirname, "../fixtures/dummy.aac"));
	var DUMMY_MP4_DATA = fs.readFileSync(path.resolve(__dirname, "../fixtures/dummy.mp4"));

	afterEach(() => {
		mockfs.restore();
	});

	it("measures the duration of ogg", function (done) {
		mockfs({ "dum.ogg": DUMMY_OGG_DATA });
		getAudioDuration("./dum.ogg")
			.then((dur: number) => {
				expect(Math.ceil(dur * 1000)).toBe(1250);
				done();
			}, done.fail);
	});

	it("measures the duration of aac", function (done) {
		mockfs({ "dum.aac": DUMMY_AAC_DATA });
		getAudioDuration("./dum.aac")
			.then((dur: number) => {
				expect(Math.ceil(dur * 1000)).toBe(302);
				done();
			}, done.fail);
	});

	it("measures the duration of mp4", function (done) {
		mockfs({ "dum.mp4": DUMMY_MP4_DATA });
		getAudioDuration("./dum.mp4")
			.then((dur: number) => {
				expect(Math.ceil(dur * 1000)).toBe(302);
				done();
			}, done.fail);
	});
});
