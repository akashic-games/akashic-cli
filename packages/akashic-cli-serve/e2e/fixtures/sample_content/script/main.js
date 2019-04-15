function main(param) {
	var scene = new g.Scene({
		game: g.game,
		// このシーンで利用するアセットのIDを列挙し、シーンに通知します
		assetIds: ["player", "numbers", "se"]
	});
	var joinedCount = 0;
	g.game.join.add(() => {
		joinedCount++;
	});
	g.game.leave.add(() => {
		joinedCount--;
	});
	scene.loaded.add(() => {
		// ここからゲーム内容を記述します
		var playerWidth = scene.assets["player"].width;
		var playerHeight = scene.assets["player"].height;

		var numberSprite = new g.FrameSprite({
			scene: scene,
			src: scene.assets["numbers"],
			width: playerWidth,
			height: playerHeight,
			srcWidth: 28,
			srcHeight: 32,
			frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
			frameNumber: 0
		});
		scene.append(numberSprite);

		// プレイヤーを囲む矩形をプレイヤーよりも先に作成
		var rectColors = ["red", "yellow", "blue", "green", "gray"];
		var colorsIndex = -1;
		var rect = new g.FilledRect({
			scene: scene,
			cssColor: "white",
			width: playerWidth * 2,
			height: playerHeight * 2,
			x: (g.game.width - playerWidth * 2) / 2,
			y: (g.game.height - playerHeight * 2) / 2
		});
		scene.append(rect);

		// プレイヤーを生成します
		var player = new g.Sprite({
			scene: scene,
			src: scene.assets["player"],
			width: playerWidth,
			height: playerHeight,
			x: (g.game.width - playerWidth) / 2,
			y: (g.game.height - playerHeight) / 2
		});

		// 画面をタッチしたとき、プレイヤーの周りの矩形の色を変えます
		scene.pointDownCapture.add(() => {
			scene.assets["se"].play();
			colorsIndex = (colorsIndex + 1) % rectColors.length;
			rect.cssColor = rectColors[colorsIndex];
			rect.modified();
		});
		scene.append(player);

		scene.update.add(() => {
			if (joinedCount !== numberSprite.frameNumber) {
				numberSprite.frameNumber = joinedCount % 10;
				numberSprite.modified();
			}
		});
		// ここまでゲーム内容を記述します
	});
	g.game.pushScene(scene);
}

module.exports = main;
