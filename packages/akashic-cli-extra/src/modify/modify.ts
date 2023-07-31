import * as path from "path";
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

type NormalizedModifyBasicParameterParameterObject = Required<ModifyBasicParameterParameterObject>;

function _completeModifyBasicParameterParameterObject(
	param: ModifyBasicParameterParameterObject
): NormalizedModifyBasicParameterParameterObject {
	return {
		target: param.target,
		value: param.value,
		cwd: param.cwd || process.cwd(),
		logger: param.logger || new cmn.ConsoleLogger()
	};
}

export function promiseModifyBasicParameter(param: ModifyBasicParameterParameterObject): Promise<void> {
	const { target, value, cwd, logger } = _completeModifyBasicParameterParameterObject(param);

	if (typeof value !== "number" || isNaN(value) || value <= 0 || Math.round(value) !== value) {
		return Promise.reject(new Error(target + " must be a positive integer but '" + value + "' is given."));
	}

	const restoreDirectory = cmn.Util.chdir(cwd);
	const gameJsonPath = path.join(process.cwd(), "game.json");
	return Promise.resolve()
		.then(() => cmn.ConfigurationFile.read(gameJsonPath, logger))
		.then((content: cmn.GameConfiguration) => {
			return new Promise<void>((resolve, reject) => {
				switch (target) {
					case "width":
						content.width = value;
						break;
					case "height":
						content.height = value;
						break;
					case "fps":
						content.fps = value;
						break;
					default:
						return reject("unknown target: " + target);
				}
				resolve();
			})
				.then(async() => await cmn.FileSystem.writeJSON<cmn.GameConfiguration>(gameJsonPath, content))
				.then(() => logger.info("Done!"));
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
