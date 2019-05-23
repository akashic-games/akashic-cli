// 通常このファイルを編集する必要はありません。ゲームの処理は main.js に記述してください
var main = require("./main.js");

module.exports = function (originalParam) {
	var param = {};
	Object.keys(originalParam).forEach(function (key) {
		param[key] = originalParam[key];
	});
	// セッションパラメーター
	param.sessionParameter = {};
	// コンテンツが動作している環境がRPGアツマール上かどうか
	param.isAtsumaru = typeof window !== "undefined" && typeof window.RPGAtsumaru !== "undefined";

	var limitTickToWait = 3; // セッションパラメーターが来るまでに待つtick数

	var scene = new g.Scene({
		game: g.game
	});
	// セッションパラメーターを受け取ってゲームを開始します
	scene.message.add(function (msg) {
		if (msg.data && msg.data.type === "start" && msg.data.parameters) {
			param.sessionParameter = msg.data.parameters; // sessionParameterフィールドを追加
			g.game.popScene();
			main(param);
		}
	});
	scene.loaded.add(function() {
		var currentTickCount = 0;
		scene.update.add(function() {
			currentTickCount++;
			// 待ち時間を超えた場合はゲームを開始します
			if (currentTickCount > limitTickToWait) {
				g.game.popScene();
				main(param);
			}
		});
	});
	g.game.pushScene(scene);
};
