const eslintConfig = require("@akashic/eslint-config");

module.exports = [
	...eslintConfig,
	{
		files: ["src/server/*.ts", "src/server/**/*.ts"],
		languageOptions: {
			sourceType: "module",
			parserOptions: {
				project: "./tsconfig.json",
				tsconfigRootDir: __dirname,
			}
		},
		ignores: [
			"**/*.js",
			"*.cjs",
		]
	}
];
