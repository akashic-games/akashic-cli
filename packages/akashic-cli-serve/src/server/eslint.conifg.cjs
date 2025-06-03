const eslintConfig = require("@akashic/eslint-config");

module.exports = [
    ...eslintConfig,
    {
        files: ["src/server/**/*.ts"],
        languageOptions: {
            sourceType: "module",
            parserOptions: {
                project: "./tsconfig.test.json",
				tsconfigRootDir: __dirname,
            }
        },
        ignores: [
          "**/*.js",
          "*.cjs",
        ]
    }
];