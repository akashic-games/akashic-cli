import * as Prompt from "prompt";
import * as commons from "@akashic/akashic-cli-commons";

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
function promptGetBasicParameters(current: BasicParameters): Promise<BasicParameters> {

	var schema = {
		properties: {
			width: {
				type: "number",
				message: "width must be a number",
				default: current.width || 320
			},
			height: {
				type: "number",
				message: "height must be a number",
				default: current.height || 320
			},
			fps: {
				type: "number",
				message: "fps must be a number",
				default: current.fps || 30
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
function setBasicParameters(conf: commons.GameConfiguration, basicParams: BasicParameters): void {
	conf.width = basicParams.width;
	conf.height = basicParams.height;
	conf.fps = basicParams.fps;
}

/**
 * 指定した game.json の基本パラメータを更新する
 */
export function updateConfigurationFile(confPath: string, logger: commons.Logger): Promise<void> {
	return commons.ConfigurationFile.read(confPath, logger)
		.then(conf =>
			promptGetBasicParameters({
				width: conf.width,
				height: conf.height,
				fps: conf.fps
			})
				.then(basicParams => {
					setBasicParameters(conf, basicParams);
					return commons.ConfigurationFile.write(conf, confPath, logger);
				})
		);
}
