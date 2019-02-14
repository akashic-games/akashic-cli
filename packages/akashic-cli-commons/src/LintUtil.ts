import * as eslint from "eslint";

export interface LintErrorInfo {
	column: number;
	line: number;
	message: string;
}

export function validateEs5Code(code: string): LintErrorInfo[] {
	const errors = (new eslint.Linter()).verify(code, {
		parserOptions: {
			ecmaVersion: 5
		}
	});
	return errors.map(error => {
		return {
			column: error.column,
			line: error.line,
			message: error.message
		};
	});
}
