module.exports = {
	collectCoverage: true,
	collectCoverageFrom: [
		"lib/**/*.js",
		"!**/node_modules/**",
		"!**/templates-src/**"
	],
	coverageDirectory: "coverage",
	coverageReporters: [
		"lcov"
	],
	rootDir: "./",
	setupFiles : [],
	testEnvironment: "node",
	testPathIgnorePatterns: [
		"templates-src"
	],
	testMatch: [
		"**/*[sS]pec.ts"
	],
	moduleFileExtensions: [
		"ts",
		"js"
	],
	transform: {
		"^.+\\.ts$": "ts-jest"
	},
	globals: {
		"ts-jest": {
			tsconfig: "./src/__tests__/tsconfig.json"
		}
	}
};
