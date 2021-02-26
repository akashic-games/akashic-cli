window.gLocalAssetContainer["main"] = function(g) { (function(exports, require, module, __filename, __dirname) {
function main(param) {
	var scene = new g.Scene({game: g.game});
	scene.loaded.handle(function() {
		// 以下にゲームのロジックを記述します。
		var rect = new g.FilledRect({
			scene: scene,
			cssColor: "#ff0000",
			width: 32,
			height: 32
		});
		rect.update.handle(function () {
			// 以下のコードは毎フレーム実行されます。
			rect.x++;
			if (rect.x > g.game.width) rect.x = 0;
			rect.modified();
		});
		scene.append(rect);
	});
	g.game.pushScene(scene);
}

module.exports = main;

})(g.module.exports, g.module.require, g.module, g.filename, g.dirname);
}