// 通常このファイルを編集する必要はありません。ゲームの処理は main.js に記述してください
import { GameMainParameterObject, RPGAtsumaruWindow } from "./parameterObject";
import { main } from "./main";

declare const window: RPGAtsumaruWindow;

export = (originalParam: g.GameMainParameterObject) => {
	const param: any = {} as GameMainParameterObject;
	Object.keys(originalParam).forEach((key) => {
		param[key] = (originalParam as any)[key];
	});
	// セッションパラメーター
	param.sessionParameter = {};
	// コンテンツが動作している環境がゲームアツマール上かどうか
	param.isAtsumaru = typeof window !== "undefined" && typeof window.RPGAtsumaru !== "undefined";
	// 乱数生成器
	param.random = g.game.random;

	const limitTickToWait = 3; // セッションパラメーターが来るまでに待つtick数

	const scene = new g.Scene({
		game: g.game
	});
	// セッションパラメーターを受け取ってゲームを開始します
	scene.onMessage.add((msg) => {
		if (msg.data && msg.data.type === "start" && msg.data.parameters) {
			param.sessionParameter = msg.data.parameters; // sessionParameterフィールドを追加
			if (msg.data.parameters.randomSeed != null) {
				param.random = new g.XorshiftRandomGenerator(msg.data.parameters.randomSeed);
			}
			g.game.popScene();
			main(param);
		}
	});
	scene.onLoad.add(() => {
		let currentTickCount = 0;
		scene.onUpdate.add(function() {
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
