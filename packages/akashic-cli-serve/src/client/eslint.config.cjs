const react = require("eslint-plugin-react");
const globals = require("globals");
const eslintConfig = require("@akashic/eslint-config");

module.exports = [
    ...eslintConfig,
    {
        files: ["src/client/**/*.ts", "src/common/**/*.ts", "src/client/**/*.tsx"],
        plugins: {
            react,
        },

        languageOptions: {
            globals: {
                ...globals.node
            },
            ecmaVersion: 12,
            sourceType: "module",
            parserOptions: {
                project: "./tsconfig.json",
                tsconfigRootDir: __dirname,
                ecmaFeatures: {
                    jsx: true
                }
            }
        },
        settings: {
            react: {
                version: "detect",
            },
        },
        ignores: [
            "**/*.js",
            "**/*.cjs",
            "**/vite.config.mts"
        ],
        rules: {
            "@typescript-eslint/typedef": ["error", {
                arrowParameter: false,
            }],

            "react/jsx-uses-react": "error",
            "react/jsx-uses-vars": "error",

            "@typescript-eslint/naming-convention": ["error", {
                selector: "variable",
                format: ["camelCase", "UPPER_CASE", "PascalCase"],
            }],
        },
    }
];