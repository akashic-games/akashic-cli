var StringStream = require("../lib/StringStream").StringStream;

describe("StringStream", function () {
	it("can be instantiated", function () {
		var stream = new StringStream("fooo");
		expect(stream.content).toBe("fooo");
		expect(stream.file).toBeUndefined();

		var stream = new StringStream("zoooo", "fname");
		expect(stream.content).toBe("zoooo");
		expect(stream.file).toBe("fname");
	});

	it("can be used as a stream", function (done) {
		var str = "zooooo";
		var stream = new StringStream(str, "fname");

		var result = "";
		stream.resume();
		stream.on("data", function (data) {
			result += data;
		});
		stream.on("end", function () {
			expect(result).toBe(str);
			done();
		});
	});
});
