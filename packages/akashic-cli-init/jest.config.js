module.exports = {
	collectCoverage: true,
	collectCoverageFrom: [
		"**/*.js",
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
		"**/*[sS]pec.js"
	]
};