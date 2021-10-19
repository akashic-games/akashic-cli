module.exports = {
	root: true,
	extends: [
		"@akashic/eslint-config"
	],
	parserOptions: {
		project: "./tsconfig.json",
		sourceType: "module",
		tsconfigRootDir: __dirname
	},
	ignorePatterns: [
		"**/*.js"
	],
	rules: {
		"@typescript-eslint/no-var-requires": "off"
	}
}
