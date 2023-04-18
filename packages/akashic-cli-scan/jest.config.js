module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    "./src/**/*.ts",
    "!./src/__tests__/**/*.ts"
  ],
  coverageDirectory: "coverage",
  coverageReporters: [
    "lcov"
  ],
  testMatch: [
    "<rootDir>/src/__tests__/**/*[sS]pec.ts"
    
  ],
  moduleFileExtensions: [
    "ts",
    "js"
  ],
  transform: {
    "^.+\\.ts$": [
      "ts-jest", {
        tsconfig: "./src/__tests__/tsconfig.json"
      }
    ]
  }
};
