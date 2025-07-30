const eslintConfig = require("@akashic/eslint-config");

module.exports = [
    ...eslintConfig,
    {
        files: ["src/**/*.ts"],
        languageOptions: {
            sourceType: "module",
            parserOptions: {
                project: "tsconfig.test.json",
            },
        },
        ignores: [
          "**/*.js",
          "*.cjs",
          "**/__tests__/**/*"
        ]
    }
];
