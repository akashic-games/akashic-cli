import * as path from "path";
import * as commons from "@akashic/akashic-cli-commons";
import * as stat from "../../../lib/stat/stat";

function testWithSize(basepath: string, raw: boolean, limit?: string): Promise<void> {
	const logger = new commons.ConsoleLogger({ debugLogMethod: _msg => { /* do nothing */ } });
	return commons.ConfigurationFile.read(path.join(basepath, "game.json"), logger)
		.then(game => stat.size({ logger, basepath, game, raw, limit }));
}

describe("stat.size dummy game", () => {
	const gamePath = path.join(__dirname, "..", "..", "fixtures", "dummyGame1");

	it("you can call size with empty option", done => {
		testWithSize(gamePath, false)
			.then(done, done.fail);
	});

	it("stat size --limit 0", done => {
		testWithSize(gamePath, false, "0")
			.catch(err => expect(err).toBe("file size limit exceeded (650B)"))
			.then(done);
	});

	it("stat size --limit 123", done => {
		testWithSize(gamePath, false, "123")
			.catch(err => expect(err).toBe("file size limit exceeded (527B)"))
			.then(done);
	});

	it("stat size --limit 123B", done => {
		testWithSize(gamePath, false, "123B")
			.catch(err => expect(err).toBe("file size limit exceeded (527B)"))
			.then(done);
	});

	it("stat size --limit 123K", done => {
		testWithSize(gamePath, false, "123K")
			.then(done, done.fail);
	});

	it("stat size --limit 123KB", done => {
		testWithSize(gamePath, false, "123KB")
			.then(done, done.fail);
	});

	it("stat size --limit 123k", done => {
		testWithSize(gamePath, false, "123k")
			.then(done, done.fail);
	});

	it("stat size --limit 123kb", done => {
		testWithSize(gamePath, false, "123kb")
			.then(done, done.fail);
	});

	it("stat size --limit 123M", done => {
		testWithSize(gamePath, false, "123M")
			.then(done, done.fail);
	});

	it("stat size --limit 123MB", done => {
		testWithSize(gamePath, false, "123MB")
			.then(done, done.fail);
	});

	it("stat size --limit 123G", done => {
		testWithSize(gamePath, false, "123G")
			.then(done, done.fail);
	});

	it("stat size --raw", done => {
		testWithSize(gamePath, true)
			.then(done, done.fail);
	});

	it("stat size --limit 123 --raw", done => {
		testWithSize(gamePath, true, "123")
			.catch(err => expect(err).toBe("file size limit exceeded (527B)"))
			.then(done);
	});
});

describe("stat.size with sound and audio", () => {
	const gamePath = path.join(__dirname, "..", "..", "fixtures", "dummyGame2");

	it("stat size with empty option", done => {
		testWithSize(gamePath, false)
			.then(done, done.fail);
	});

	it("stat size --limit 0", done => {
		testWithSize(gamePath, false, "0")
			.catch(err => expect(err).toBe("file size limit exceeded (8.43KB)"))
			.then(done);
	});

	it("stat size --limit 64K", done => {
		testWithSize(gamePath, false, "64K")
			.then(done, done.fail);
	});
});

describe("stat.size with incomplete game.json", () => {
	const gamePath = path.join(__dirname, "..", "..", "fixtures", "dummyGame3");

	it("stat size without command option", done => {
		testWithSize(gamePath, false)
			.then(done, done.fail);
	});
});

describe("format stat result", () => {
	const expectedText =
		"image: 144B (2%)\n" +
		"vector-image: 0B (0%)\n" +
		"text: 0B (0%)\n" +
		"ogg audio: 7.45KB (88%)\n" +
		"mp4 audio: 5.31KB\n" +
		"aac audio: 4.16KB\n" +
		"m4a audio: 4.75KB\n" +
		"script: 494B (6%)\n" +
		"binary: 0B (0%)\n" +
		"other: 367B (4%)\n" +
		"  game.json: 367B\n" +
		"[*] TOTAL SIZE (using ogg): 8.43KB (8632B)\n" +
		"[ ] TOTAL SIZE (using aac): 5.14KB (5267B)\n" +
		"[ ] TOTAL SIZE (using m4a): 5.73KB (5872B)\n" +
		"[ ] TOTAL SIZE (using mp4): 6.29KB (6443B)\n" +
		"WARN: MP4 (.mp4) is deprecated. Use AAC(.aac) or M4A(.m4a) instead.\n";

	it("will output following text", done => {
		let buffer = "";
		const logger = new commons.ConsoleLogger({ debugLogMethod: msg => {
			buffer += msg + "\n";
		} });
		const basepath = path.join(__dirname, "..", "..", "fixtures", "dummyGame2");
		return commons.ConfigurationFile.read(
			path.join(basepath, "game.json"),
			logger
		)
			.then(game => stat.size({ logger, basepath, game, raw: false }))
			.then(() => {
				expect(buffer).toBe(expectedText);
			})
			.then(done, done.fail);
	});
});

describe("format stat result - drop aac", () => {
	const expectedText =
		"image: 0B (0%)\n" +
		"vector-image: 0B (0%)\n" +
		"text: 0B (0%)\n" +
		"ogg audio: 7.45KB (98%)\n" +
		"m4a audio: 4.75KB\n" +
		"script: 0B (0%)\n" +
		"binary: 0B (0%)\n" +
		"other: 169B (2%)\n" +
		"  game.json: 169B\n" +
		"[*] TOTAL SIZE (using ogg): 7.61KB (7796B)\n" +
		"[ ] TOTAL SIZE (using m4a): 4.92KB (5036B)\n";

	it("will output following text", done => {
		let buffer = "";
		const logger = new commons.ConsoleLogger({ quiet: true, debugLogMethod: msg => {
			buffer += msg + "\n";
		} });
		const basepath = path.join(__dirname, "..", "..", "fixtures", "dummyGame3");
		return commons.ConfigurationFile.read(
			path.join(basepath, "game.json"),
			logger
		)
			.then(game => stat.size({ logger, basepath, game, raw: false }))
			.then(() => {
				expect(buffer).toBe(expectedText);
			})
			.then(done, done.fail);
	});
});

describe("format stat result - maximum mp4, drop m4a", () => {
	const expectedText =
		"image: 0B (0%)\n" +
		"vector-image: 0B (0%)\n" +
		"text: 0B (0%)\n" +
		"ogg audio: 7.45KB\n" +
		"mp4 audio: 9.31KB (98%)\n" +
		"aac audio: 4.16KB\n" +
		"script: 0B (0%)\n" +
		"binary: 0B (0%)\n" +
		"other: 168B (2%)\n" +
		"  game.json: 168B\n" +
		"[ ] TOTAL SIZE (using ogg): 7.61KB (7795B)\n" +
		"[ ] TOTAL SIZE (using aac): 4.33KB (4430B)\n" +
		"[*] TOTAL SIZE (using mp4): 9.48KB (9704B)\n" +
		"WARN: MP4 (.mp4) is deprecated. Use AAC(.aac) or M4A(.m4a) instead.\n";

	it("will output following text", done => {
		let buffer = "";
		const logger = new commons.ConsoleLogger({ quiet: true, debugLogMethod: msg => {
			buffer += msg + "\n";
		} });
		const basepath = path.join(__dirname, "..", "..", "fixtures", "dummyGame4");
		return commons.ConfigurationFile.read(
			path.join(basepath, "game.json"),
			logger
		)
			.then(game => stat.size({ logger, basepath, game, raw: false }))
			.then(() => {
				expect(buffer).toBe(expectedText);
			})
			.then(done, done.fail);
	});
});

describe("format stat result - drop m4a and aac", () => {
	const expectedText =
		"WARN: audio/dummy.m4a or .aac, No such file.\n" +
		"image: 144B (2%)\n" +
		"vector-image: 0B (0%)\n" +
		"text: 0B (0%)\n" +
		"ogg audio: 7.45KB (88%)\n" +
		"mp4 audio: 5.31KB\n" +
		"script: 494B (6%)\n" +
		"binary: 0B (0%)\n" +
		"other: 367B (4%)\n" +
		"  game.json: 367B\n" +
		"[*] TOTAL SIZE (using ogg): 8.43KB (8632B)\n" +
		"[ ] TOTAL SIZE (using aac): 1005B (1005B)\n" +
		"[ ] TOTAL SIZE (using mp4): 6.29KB (6443B)\n" +
		"WARN: MP4 (.mp4) is deprecated. Use AAC(.aac) or M4A(.m4a) instead.\n";

	it("will output following text", done => {
		let buffer = "";
		const logger = new commons.ConsoleLogger({ debugLogMethod: msg => {
			buffer += msg + "\n";
		} });
		const basepath = path.join(__dirname, "..", "..", "fixtures", "dummyGame5");
		return commons.ConfigurationFile.read(
			path.join(basepath, "game.json"),
			logger
		)
			.then(game => stat.size({ logger, basepath, game, raw: false }))
			.then(() => {
				expect(buffer).toBe(expectedText);
			})
			.then(done, done.fail);
	});
});


describe("format stat result - vector-image and binary", () => {
	const expectedText =
		"image: 0B (0%)\n" +
		"vector-image: 159B (16%)\n" +
		"text: 0B (0%)\n" +
		"ogg audio: 0B\n" +
		"script: 494B (49%)\n" +
		"binary: 9B (1%)\n" +
		"other: 355B (35%)\n" +
		"  game.json: 355B\n" +
		"[ ] TOTAL SIZE (using ogg): 1017B (1017B)\n" +
		"[*] TOTAL SIZE (using aac): 1017B (1017B)\n";

	it("will output following text", done => {
		let buffer = "";
		const logger = new commons.ConsoleLogger({ debugLogMethod: msg => {
			buffer += msg + "\n";
		} });
		const basepath = path.join(__dirname, "..", "..", "fixtures", "dummyGame6_bin_vector");
		return commons.ConfigurationFile.read(
			path.join(basepath, "game.json"),
			logger
		)
			.then(game => stat.size({ logger, basepath, game, raw: false }))
			.then(() => {
				expect(buffer).toBe(expectedText);
			})
			.then(done, done.fail);
	});
});
