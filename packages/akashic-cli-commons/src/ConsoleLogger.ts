import { Logger } from "./Logger";

/**
 * `ConsoleLogger` のコンストラクタに指定できる引数の型。
 */
export interface ConsoleLoggerParameterObject {
	/**
	 * ログ出力量を抑えるか否か。
	 * 真の場合、 `info()` の呼び出しは無視される。
	 * 省略された場合、偽。
	 */
	quiet?: boolean;

	/**
	 * デバッグ用: ログ出力を行う関数。
	 * 省略された場合、 `console.log.bind(console)` 。
	 */
	debugLogMethod?: (msg: any) => void;
}

/**
 * ログを `console` に出力するロガー。
 */
export class ConsoleLogger implements Logger {
	quiet: boolean;
	_log: (msg: any) => void;

	constructor(param: ConsoleLoggerParameterObject = {}) {
		this.quiet = !!param.quiet;
		this._log = param.debugLogMethod || console.log.bind(console);
	}

	/**
	 * 任意の文字列を記録する。
	 * @param message 記録するメッセージ
	 */
	print(message: string): void {
		this._log(message);
	}

	/**
	 * エラーを記録する。
	 * @param message 記録するメッセージ
	 * @param cause エラーの原因
	 */
	error(message: string, cause?: any): void {
		this.print("ERROR: " + message);
		if (cause)
			this.print(cause);
	}

	/**
	 * 警告を記録する。
	 * @param message 記録するメッセージ
	 * @param cause 警告の原因
	 */
	warn(message: string, cause?: any): void {
		this.print("WARN: " + message);
		if (cause)
			this.print(cause);
	}

	/**
	 * 情報を記録する。
	 * @param message 記録するメッセージ
	 * @param cause 情報の原因
	 */
	info(message: string, cause?: any): void {
		if (this.quiet)
			return;
		this.print("INFO: " + message);
		if (cause)
			this.print(cause);
	}
}
