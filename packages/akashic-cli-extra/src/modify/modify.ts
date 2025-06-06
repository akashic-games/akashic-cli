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

export async function promiseModifyBasicParameter(param: ModifyBasicParameterParameterObject): Promise<void> {
	const { target, value, cwd, logger } = _completeModifyBasicParameterParameterObject(param);

	if (typeof value !== "number" || isNaN(value) || value <= 0 || Math.round(value) !== value) {
		return Promise.reject(new Error(target + " must be a positive integer but '" + value + "' is given."));
	}

	const restoreDirectory = cmn.Util.chdir(cwd);
	const gameJsonPath = path.join(process.cwd(), "game.json");
	let content = {} as cmn.GameConfiguration;
	try {
		content = await cmn.FileSystem.readJSON<cmn.GameConfiguration>(path.join(process.cwd(), "game.json"));
	} catch (e) {
		logger.info("No game.json found. Create a new one.");
	}

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
			throw ("unknown target: " + target);
	};

	await cmn.FileSystem.writeJSON<cmn.GameConfiguration>(gameJsonPath, content);
	logger.info("Done!");
	await restoreDirectory();
}

export function modifyBasicParameter(param: ModifyBasicParameterParameterObject, cb: (err?: any) => void): void {
	promiseModifyBasicParameter(param).then(cb, cb);
}
