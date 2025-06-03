const eslintConfig = require("@akashic/eslint-config");

module.exports = [
	...eslintConfig,
	{
		files: ["src/**/*.ts"],
		languageOptions: {
			sourceType: "module",
			parserOptions: {
				project: "tsconfig.json",
			}
		},
		ignores: [
			"*.js",
			"*.cjs",
			"typings/**/*",
			"**/__tests__/**/*"
		]
	}
];
