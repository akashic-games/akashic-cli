module.exports = {
	root: true,
	extends: [
		"@akashic/eslint-config"
	],
	parserOptions: {
		project: "./tsconfig.test.json",
		sourceType: "module",
		tsconfigRootDir: __dirname
	},
	ignorePatterns: [
		"**/*.cjs"
	]
};
