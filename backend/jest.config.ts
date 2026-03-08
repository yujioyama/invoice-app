import type { Config } from "jest";

const config: Config = {
  moduleFileExtensions: ["js", "json", "ts"], // Specifies which file extensions should be included.
  rootDir: "src", // Specifies the root directory for the tests.
  testRegex: ".*\\.spec\\.ts$", // Specifies the pattern for test files.
  transform: {
    "^.+\\.(t|j)s$": "ts-jest", // Specifies how to transform files before testing. In this case, it uses ts-jest to transform TypeScript files.
  },
  collectCoverageFrom: ["**/*.(t|j)s"], // Specifies which files to collect coverage information from.
  coverageDirectory: "../coverage", // Specifies the directory where coverage information should be stored.
  testEnvironment: "node", // Specifies the test environment. In this case, it uses the Node.js environment.
};

export default config;
