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

interface NormalizedUpdateParameterObject extends Required<Omit<UpdateParameterObject, "debugNpm">> {
	debugNpm: cmn.PromisedNpm | null;
}

function _normalizeUpdateParameterObject(param: UpdateParameterObject): NormalizedUpdateParameterObject {
	return {
		cwd: param.cwd ?? process.cwd(),
		logger: param.logger ?? new cmn.ConsoleLogger(),
		debugNpm: param.debugNpm ?? null,
		moduleNames: param.moduleNames ?? []
	};
}

export function promiseUpdate(param: UpdateParameterObject): Promise<void> {
	const normalizedParam = _normalizeUpdateParameterObject(param);
	const npm = normalizedParam.debugNpm ?? new cmn.PromisedNpm({ logger: param.logger });
	const restoreDirectory = cmn.Util.chdir(normalizedParam.cwd);
	return Promise.resolve()
		.then(() => npm.update(normalizedParam.moduleNames))
		.then(() => normalizedParam.logger.info("Done!"))
		.finally(restoreDirectory);
}

export function update(param: UpdateParameterObject, cb: (err: any) => void): void {
	promiseUpdate(param).then(cb, cb);
}
