import * as mockfs from "mock-fs";
import { FileModule } from "../../lib/FileModule";

describe("FileModuleSpec", () => {
	afterEach(function () {
		mockfs.restore();
	});

	it("read game.json", async () => {
		mockfs({
			"game": {
				"game.json": JSON.stringify({
					width: 120,
					height: 240
				})
			}
		});
		expect(
			await FileModule.readJSON("./game/game.json")
		).toEqual({
			width: 120,
			height: 240
		});
	});

	it("read game.json", async () => {
		mockfs({
			"game": {
				"game.json": JSON.stringify({})
			}
		});
		await FileModule.writeJSON("./game/game.json", { width: 120, height: 240 });
		expect(
			await FileModule.readJSON("./game/game.json")
		).toEqual({
			width: 120,
			height: 240
		})
	});
});
