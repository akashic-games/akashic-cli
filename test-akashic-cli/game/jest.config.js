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
    "^.+\\.ts$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.jest.json"
      }
    ]
  },
  testMatch: [
    "<rootDir>/spec/**/*.ts"
  ]
};
