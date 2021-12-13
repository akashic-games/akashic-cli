module.exports = {
	collectCoverage: true,
	collectCoverageFrom: [
		"lib/**/*.js",
		"!**/node_modules/**"
	],
	coverageDirectory: "coverage",
	coverageReporters: [
		"lcov"
	],
	rootDir: "./",
	setupFiles : [],
	testEnvironment: "node",
	testPathIgnorePatterns: [],
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
