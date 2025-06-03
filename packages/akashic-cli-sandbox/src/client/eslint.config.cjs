const eslintConfig = require("@akashic/eslint-config");

module.exports = [
	...eslintConfig,
	{
		files: ["src/client/*.ts", "src/client/**/*.ts"],
		languageOptions: {
			sourceType: "module",
			parserOptions: {
				project: "./tsconfig.json",
				tsconfigRootDir: __dirname,
			}
		},
		ignores: [
			"**/*.js",
			"*.cjs"
		]
	}
];
