import * as cmn from "@akashic/akashic-cli-commons";

export interface ModifyBasicParameterParameterObject {
	/**
	 * 設定する対象。
	 * `"width"`, `"height"`, `"fps"` のいずれか。
	 */
	target: string;

	/**
	 * 設定する値。
	 */
	value: number;

	/**
	 * 作業ディレクトリ。
	 * 省略された場合、 `process.cwd()` 。
	 */
	cwd?: string;

	/**
	 * コマンドの出力を受け取るロガー。
	 * 省略された場合、akashic-cli-commons の `new ConsoleLogger()` 。
	 */
	logger?: cmn.Logger;
}

export function _completeModifyBasicParameterParameterObject(param: ModifyBasicParameterParameterObject): void {
	param.cwd = param.cwd || process.cwd();
	param.logger = param.logger || new cmn.ConsoleLogger();
}

export function promiseModifyBasicParameter(param: ModifyBasicParameterParameterObject): Promise<void> {
	_completeModifyBasicParameterParameterObject(param);

	if (typeof param.value !== "number" || isNaN(param.value) || param.value <= 0 || Math.round(param.value) !== param.value) {
		return Promise.reject(new Error(param.target + " must be a positive integer but '" + param.value + "' is given."));
	}

	var restoreDirectory = cmn.Util.chdir(param.cwd);
	return Promise.resolve()
		.then(() => cmn.ConfigurationFile.read("./game.json", param.logger))
		.then((content: cmn.GameConfiguration) => {
			return new Promise<void>((resolve, reject) => {
				switch (param.target) {
				case "width":
					content.width = param.value;
					break;
				case "height":
					content.height = param.value;
					break;
				case "fps":
					content.fps = param.value;
					break;
				default:
					return reject("unknown target: " + param.target);
				}
				resolve();
			})
			.then(() => cmn.ConfigurationFile.write(content, "./game.json", param.logger))
			.then(() => param.logger.info("Done!"));
		})
		.then(restoreDirectory)
		.catch((err) => {
			restoreDirectory();
			throw new Error(err);
		});
}

export function modifyBasicParameter(param: ModifyBasicParameterParameterObject, cb: (err?: any) => void): void {
	promiseModifyBasicParameter(param).then(cb, cb);
}
