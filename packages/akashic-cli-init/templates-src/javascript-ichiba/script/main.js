function main(param) {
	var scene = new g.Scene({
		game: g.game,
		// このシーンで利用するアセットのIDを列挙し、シーンに通知します
		assetIds: ["player", "shot", "se"]
	});
	var time = 30; // 制限時間
	if (param.sessionParameter.totalTimeLimit) {
		time = param.sessionParameter.totalTimeLimit;
	}
	// 市場コンテンツのランキングモードでは、g.game.vars.gameState.score の値をスコアとして扱います
	g.game.vars.gameState = { score: 0 };
	scene.loaded.add(function() {
		// ここからゲーム内容を記述します

		// プレイヤーを生成します
		var player = new g.Sprite({
			scene: scene,
			src: scene.assets["player"],
			width: scene.assets["player"].width,
			height: scene.assets["player"].height
		});

		// プレイヤーの初期座標を、画面の中心に設定します
		player.x = (g.game.width - player.width) / 2;
		player.y = (g.game.height - player.height) / 2;
		player.update.add(function () {
			// 毎フレームでY座標を再計算し、プレイヤーの飛んでいる動きを表現します
			// ここではMath.sinを利用して、時間経過によって増加するg.game.ageと組み合わせて
			player.y = (g.game.height - player.height) / 2 + Math.sin(g.game.age % (g.game.fps * 10) / 4) * 10;

			// プレイヤーの座標に変更があった場合、 modified() を実行して変更をゲームに通知します
			player.modified();
		});
		scene.append(player);

		// フォントの生成
		var font = new g.DynamicFont({
			game: g.game,
			fontFamily: g.FontFamily.Serif,
			size: 48
		});

		// スコア表示用のラベル
		var scoreLabel = new g.Label({
			scene: scene,
			text: "SCORE: 0",
			font: font,
			fontSize: font.size / 2,
			textColor: "black"
		});
		scene.append(scoreLabel);

		// 残り時間表示用ラベル
		var timeLabel = new g.Label({
			scene: scene,
			text: "TIME: 0",
			font: font,
			fontSize: font.size / 2,
			textColor: "black",
			x: 0.7 * g.game.width
		});
		scene.append(timeLabel);

		// 画面をタッチしたとき、SEを鳴らします
		scene.pointDownCapture.add(function () {
			// 制限時間以内であればタッチ1回ごとにSCOREに+1します
			if (time > 0) {
				g.game.vars.gameState.score++;
				scoreLabel.text = "SCORE: " + g.game.vars.gameState.score;
				scoreLabel.invalidate();
			}
			scene.assets["se"].play();

			// プレイヤーが発射する弾を生成します
			var shot = new g.Sprite({
				scene: scene,
				src: scene.assets["shot"],
				width: scene.assets["shot"].width,
				height: scene.assets["shot"].height
			});

			// 弾の初期座標を、プレイヤーの少し右に設定します
			shot.x = player.x + player.width;
			shot.y = player.y;
			shot.update.add(function () {
				// 毎フレームで座標を確認し、画面外に出ていたら弾をシーンから取り除きます
				if (shot.x > g.game.width) shot.destroy();

				// 弾を右に動かし、弾の動きを表現します
				shot.x += 10;

				// 変更をゲームに通知します
				shot.modified();
			});
			scene.append(shot);
		});
		var updateHandler = function() {
			if (time <= 0) {
				// RPGアツマール環境であればランキングを表示します
				if (param.isAtsumaru) {
					var boardId = 1;
					window.RPGAtsumaru.experimental.scoreboards.setRecord(boardId, g.game.vars.gameState.score).then(function() {
						window.RPGAtsumaru.experimental.scoreboards.display(boardId);
					});
				}
				scene.update.remove(updateHandler); // カウントダウンを止めるためにこのイベントハンドラを削除します
			}
			// カウントダウン処理
			time -= 1 / g.game.fps;
			timeLabel.text = "TIME: " + Math.ceil(time);
			timeLabel.invalidate();
		};
		scene.update.add(updateHandler);
		// ここまでゲーム内容を記述します
	});
	g.game.pushScene(scene);
}

module.exports = main;
