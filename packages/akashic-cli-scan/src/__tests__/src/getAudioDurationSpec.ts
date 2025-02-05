import * as path from "path";
import { fileURLToPath } from "url";
import * as getAudioDuration from "../../getAudioDuration.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe("getAudioDuration", () => {

	it("measures the duration of ogg", async () => {
		const dur = await getAudioDuration.getAudioDuration(path.join(__dirname, "../fixtures/dummy.ogg"))
		expect(Math.ceil(dur! * 1000)).toBe(1250);
	});

	it("measures the duration of aac", async () => {
			const dur = await getAudioDuration.getAudioDuration(path.join(__dirname, "../fixtures/dummy.aac"))
			expect(Math.ceil(dur! * 1000)).toBe(302);
	});

	it("measures the duration of mp4", async () => {
		const dur = await getAudioDuration.getAudioDuration(path.join(__dirname, "../fixtures/dummy.mp4"))
		expect(Math.ceil(dur! * 1000)).toBe(302);
	});
});
