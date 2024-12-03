
export interface LintErrorInfo {
	column: number;
	line: number;
	message: string;
}

export async function validateEsCode(code: string): Promise<LintErrorInfo[]> {
	const eslint = await import("eslint");
	const errors = (new eslint.Linter()).verify(code, {
		parserOptions: {
			ecmaVersion: 2016
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
