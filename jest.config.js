module.exports = {
  rootDir: process.cwd(),
  testEnvironment: "jest-environment-jsdom",
  transform: {
    "^.+\\.(t|j)sx?$": "@swc/jest",
  },
  reporters: ["default"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  clearMocks: true,
  setupFilesAfterEnv: ["./jest.setup.js"],
  setupFiles: ["./jest.polyfills.js"],
  testEnvironmentOptions: {
    customExportConditions: [""],
  },
};
