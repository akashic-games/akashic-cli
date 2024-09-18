import * as utils from "../../lib/utils";

describe("warnLackOfAudioFile", () => {
	const gamejson: any = {
		assets: {
			audio1: {
				type: "audio",
				duration: 456,
				systemId: "sound",
				global: true,
				path: "assets/audio/se/audio1",
				hint: {
				  extensions: [".ogg", ".m4a"]
				}
			},
			audio2: {
				type: "audio",
				duration: 456,
				systemId: "sound",
				global: true,
				path: "assets/audio/se/audio2",
				hint: {
				  extensions: [".m4a"]
				}
			},
			audio3: {
				type: "audio",
				duration: 456,
				systemId: "sound",
				global: true,
				path: "assets/audio/se/audio3",
				hint: {
				  extensions: [".ogg"]
				}
			},
			audio4: {
				type: "audio",
				duration: 456,
				systemId: "sound",
				global: true,
				path: "assets/audio/se/audio4",
				hint: {
				  extensions: [".ogg", ".aac"]
				}
			},
			nohint: {
				type: "audio",
				duration: 456,
				systemId: "sound",
				path: "assets/audio/se/nohint",
				global: true
			}
		}
	};

	it("output warning logs", () => {
		const spy = jest.spyOn(global.console, "warn");
		Object.values(gamejson.assets).forEach((asset: any) => utils.warnLackOfAudioFile(asset));

		/* eslint-disable max-len */
		expect(spy).toHaveBeenCalledWith("No .ogg file found for assets/audio/se/audio2. This asset may not be played on some environments (e.g. Android)");
		expect(spy).toHaveBeenCalledWith("Neither .m4a nor .aac file found for assets/audio/se/audio3. This asset may not be played on some environments (e.g. iOS)");
		/* eslint-enable max-len */
		spy.mockRestore();
	});
});
