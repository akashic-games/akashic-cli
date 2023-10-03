import * as utils from "../../lib/utils";

describe("checkAudioAssetExtensions", () => {
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

	it("Log output when checkAudioAssetExtensions", () => {
		const spy = jest.spyOn(global.console, "warn");
		utils.checkAudioAssetExtensions(Object.values(gamejson.assets));

		/* eslint-disable max-len */
		expect(spy).toHaveBeenCalledWith("may be no sound depending on the environment because no .ogg file in assets/audio/se/audio2.");
		expect(spy).toHaveBeenCalledWith("may be no sound depending on the environment because no .m4a or .aac file in assets/audio/se/audio3.");
		/* eslint-enable max-len */
		spy.mockRestore();
	});
});
