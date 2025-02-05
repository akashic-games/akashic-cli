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
		"**/*.js",
		"*.cjs",
		"*.ts",
	],
}
