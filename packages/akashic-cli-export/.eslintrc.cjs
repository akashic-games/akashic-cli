module.exports = {
	root: true,
	ignorePatterns: [
		"*.js"
	],
	overrides: [
		{
			// ts 用
			files: ["**/*.ts"],
			extends: [
				"@akashic/eslint-config"
			],
			parserOptions: {
				project: "./tsconfig.json",
				sourceType: "module",
				tsconfigRootDir: __dirname
			}
		},
		{
			// js-template 用
			files: ["**/*.js"],
			env: {
				"browser": true,
				"commonjs": true,
				"es6": false,
				"node": true
			},
			globals: {
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
	]
};
