export interface Logger {
	/**
	 * 任意の文字列を記録する。
	 * @param message 記録するメッセージ
	 */
	print(message: string): void;

	/**
	 * エラーを記録する。
	 * @param message 記録するメッセージ
	 * @param cause エラーの原因。この値の処理方法は、実装者に委ねられる。
	 */
	error(message: string, cause?: any): void;

	/**
	 * 警告を記録する。
	 * @param message 記録するメッセージ
	 * @param cause 警告の原因。この値の処理方法は、実装者に委ねられる。
	 */
	warn(message: string, cause?: any): void;

	/**
	 * 情報を記録する。
	 * @param message 記録するメッセージ
	 * @param cause 情報の原因。この値の処理方法は、実装者に委ねられる。
	 */
	info(message: string, cause?: any): void;
}
