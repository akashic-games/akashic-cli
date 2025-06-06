import { readJSON, writeJSON } from "@akashic/akashic-cli-commons/lib/FileSystem.js";
import type { GameConfiguration } from "@akashic/akashic-cli-commons/lib/GameConfiguration.js";
import type { Logger } from "@akashic/akashic-cli-commons/lib/Logger.js";
import Prompt from "prompt";

/**
 * game.jsonの初期値として与えるパラメータ。
 */
export interface BasicParameters {
	/**
	 * ゲーム画面の幅。
	 */
	width: number;
	/**
	 * ゲーム画面の高さ。
	 */
	height: number;
	/**
	 * ゲームのFPS。
	 */
	fps: number;
}

/**
 * ユーザ入力で `BasicParameters` を取得する。
 */
function promptGetBasicParameters(current: Partial<BasicParameters>, skipAsk: boolean): Promise<BasicParameters> {

	const schema = {
		properties: {
			width: {
				type: "number",
				message: "width must be a number",
				default: current.width || 320,
				ask: () => !skipAsk
			},
			height: {
				type: "number",
				message: "height must be a number",
				default: current.height || 320,
				ask: () => !skipAsk
			},
			fps: {
				type: "number",
				message: "fps must be a number",
				default: current.fps || 30,
				ask: () => !skipAsk
			}
		}
	};
	return new Promise<BasicParameters>((resolve: (param: BasicParameters) => void, reject: (err: any) => void) => {
		Prompt.start();
		Prompt.get(schema, (err: any, result: BasicParameters) => {
			Prompt.stop();

			if (!err) err =  validateBasicParameters(result, schema.properties);

			if (err) {
				reject(err);
			} else {
				resolve(result);
			}
		});
	});
}


/**
 * basicParameter 値の妥当性チェック。
 * schema.properties.type と値の型が一致するかチェックする。
 *
 * @param params {object}
 * @param props {object}
 */
function validateBasicParameters(params: any, props: any): string {
	let errMessage = "";
	Object.keys(params).forEach((key) => {
		if (errMessage || !params.hasOwnProperty(key) || !props.hasOwnProperty(key)) return;

		if (props[key].type === "number") {
			// type　が　number　の場合で、値が NaN or null の場合、エラーとする
			if (isNaN(params[key]) || params[key] === null)
				errMessage = props[key].message;
		}
	});
	return errMessage;
}

/**
 * game.json に BasicParameters の内容をセットする。
 */
function setBasicParameters(conf: GameConfiguration, basicParams: BasicParameters): void {
	conf.width = basicParams.width;
	conf.height = basicParams.height;
	conf.fps = basicParams.fps;
}

/**
 * 指定した game.json の基本パラメータを更新する
 */
export async function updateConfigurationFile(confPath: string, logger: Logger, skipAsk: boolean): Promise<void> {
	let conf = {} as GameConfiguration;
	try {
		conf = await readJSON<GameConfiguration>(confPath);
	} catch (_e) {
		logger.info("No game.json found. Create a new one.");
	}
	const basicParams = await promptGetBasicParameters({
		width: conf.width,
		height: conf.height,
		fps: conf.fps
	}, skipAsk);

	setBasicParameters(conf, basicParams);
	return await writeJSON(confPath, conf);
}
