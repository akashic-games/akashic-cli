import { StringStream } from "../StringStream.js";

describe("StringStream", () => {
	it("can be instantiated", () => {
		const stream1 = new StringStream("fooo");
		expect(stream1.content).toBe("fooo");
		expect(stream1.file).toBeUndefined();

		const stream2 = new StringStream("zoooo", "fname");
		expect(stream2.content).toBe("zoooo");
		expect(stream2.file).toBe("fname");
	});

	it("can be used as a stream", async () => {
		const str = "zooooo";
		const stream = new StringStream(str, "fname");
		let result = "";

		await new Promise((resolve, reject) => {
			stream.resume();
			stream.on("data", (data) => {
				result += data;
			});
			stream.on("end", resolve);
			stream.on("error", reject);
		});

		expect(result).toBe(str);
	});
});
