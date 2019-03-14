const { PlayTreeStore } = require("../../lib/server/domain/PlayTreeStore");

describe("PlayTree", () => {
	it("can add child play", () => {
		const playTreeStore = new PlayTreeStore();
		playTreeStore.addPlay("0");
		playTreeStore.addPlay("1");
		playTreeStore.addPlay("2");
		playTreeStore.addPlay("3");
		playTreeStore.addPlay("4");
		expect(playTreeStore.getPlayTree().length).toBe(5);

		playTreeStore.addChildToPlay("0", "1");
		playTreeStore.addChildToPlay("0", "3");
		expect(playTreeStore.getPlayTree().length).toBe(3); // 0, 2, 4
		expect(playTreeStore.getPlayTree()[0].children.length).toBe(2);
		expect(playTreeStore.getPlayTree()[0].children[0].playId).toBe("1");
		expect(playTreeStore.getPlayTree()[0].children[1].playId).toBe("3");
	});

	it("can remove play", () => {
		const playTreeStore = new PlayTreeStore();
		playTreeStore.addPlay("0");
		playTreeStore.addPlay("1");
		playTreeStore.addPlay("2");

		playTreeStore.removePlay("1");
		expect(playTreeStore.getPlayTree().length).toBe(2);
		expect(playTreeStore.getPlayTree()[0].playId).toBe("0");
		expect(playTreeStore.getPlayTree()[1].playId).toBe("2");

		playTreeStore.removePlay("0");
		expect(playTreeStore.getPlayTree().length).toBe(1);
		expect(playTreeStore.getPlayTree()[0].playId).toBe("2");

		playTreeStore.removePlay("2");
		expect(playTreeStore.getPlayTree().length).toBe(0);
	});

	it("can remove child play", () => {
		const playTreeStore = new PlayTreeStore();
		playTreeStore.addPlay("0");
		playTreeStore.addPlay("1");
		playTreeStore.addPlay("2");
		playTreeStore.addPlay("3");
		playTreeStore.addPlay("4");
		playTreeStore.addChildToPlay("0", "1");
		playTreeStore.addChildToPlay("0", "2");
		playTreeStore.addChildToPlay("0", "4");

		expect(playTreeStore.getPlayTree()[0].children.length).toBe(3); // 1, 2, 4
		expect(playTreeStore.getPlayTree()[0].children[0].playId).toBe("1");
		expect(playTreeStore.getPlayTree()[0].children[1].playId).toBe("2");
		expect(playTreeStore.getPlayTree()[0].children[2].playId).toBe("4");

		playTreeStore.removeChild("2");
		expect(playTreeStore.getPlayTree()[0].children.length).toBe(2); // 1, 4
		expect(playTreeStore.getPlayTree()[0].children[0].playId).toBe("1");
		expect(playTreeStore.getPlayTree()[0].children[1].playId).toBe("4");

		expect(playTreeStore.getPlayTree()[0].children).toEqual([]);
	});
});
