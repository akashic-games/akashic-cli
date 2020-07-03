module.exports = {
	collectCoverage: true,
	coverageDirectory: "coverage",
	collectCoverageFrom: [
		"./src/**/*.ts"
	],
	coverageReporters: [
		"lcov"
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
			tsConfig: "tsconfig.jest.json"
		}
	},
	testMatch: [
		"<rootDir>/spec/**/*.ts"
	]
};
