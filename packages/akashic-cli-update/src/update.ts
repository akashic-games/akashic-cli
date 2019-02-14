import * as cmn from "@akashic/akashic-cli-commons";

export interface UpdateParameterObject {
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

	/**
	 * デバッグ用のNPMを受け取る。
	 * 省略された場合、NPMを引き渡さない。
	 */
	debugNpm?: cmn.PromisedNpm;

	/**
	 * `npm update` に引き渡すパッケージ名。
	 * 省略された場合、 引数を引き渡さない。
	 */
	moduleNames?: string[];
}

export function _completeUpdateParameterObject(param: UpdateParameterObject): void {
	param.cwd = param.cwd || process.cwd();
	param.logger = param.logger || new cmn.ConsoleLogger();
	param.debugNpm = param.debugNpm || new cmn.PromisedNpm({ logger: param.logger });
}

export function promiseUpdate(param: UpdateParameterObject): Promise<void> {
	_completeUpdateParameterObject(param);
	var restoreDirectory = cmn.Util.chdir(param.cwd);
	return Promise.resolve()
		.then(() => param.debugNpm.update(param.moduleNames))
		.then(() => param.logger.info("Done!"))
		.then(restoreDirectory)
		.catch((err) => {
			restoreDirectory();
			throw new Error(err);
		});
}

export function update(param: UpdateParameterObject, cb: (err: any) => void): void {
	promiseUpdate(param).then(cb, cb);
}
