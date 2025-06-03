const eslintConfig = require("@akashic/eslint-config");
const globals = require("globals");

module.exports = [
    ...eslintConfig,
    {
		// ts 用
        files: ["src/**/*.ts"],
        languageOptions: {
            sourceType: "module",
            parserOptions: {
                project: "tsconfig.test.json",
            },
        },
        ignores: [
          "**/*.js",
          "*.ts",
          "**/__tests__/**/*"
        ]
    },
	{
		// js-template 用
		files: ["**/*.js"],
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.commonjs,
				...globals.node,

				"Atomics": "readonly",
				"SharedArrayBuffer": "readonly",
				"Promise": "readonly",
				"engineFiles": "readonly",
				"driver": "readonly",
				"LocalScriptAsset": "readonly",
				"LocalTextAsset": "readonly",
				"LocalScriptAssetV3": "readonly",
				"LocalTextAssetV3": "readonly"
			},
			parserOptions: {
				"ecmaVersion": 5
			}
		}
	}
];
