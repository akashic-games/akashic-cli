module.exports = {
	root: true,
	extends: [
		"@akashic/eslint-config",
		"plugin:react/recommended"
	],
	env: {
		node: true
	},
	parserOptions: {
		project: "./tsconfig.json",
		sourceType: "module",
		tsconfigRootDir: __dirname,
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: 12
	},
	ignorePatterns: [
		"**/*.js"
	],
	plugins: [
		"react"
	],
	rules: {
		"@typescript-eslint/typedef": ["error", {
			"arrowParameter": false
		}],
		"react/jsx-uses-react": "error",
		"react/jsx-uses-vars": "error",
		"@typescript-eslint/naming-convention": [
			"error",
			{
				"selector": "variable",
				"format": ["camelCase", "UPPER_CASE", "PascalCase"]
			}
		]
	},
	settings: {
		react: {
			version: "detect"
		},
	},
}
