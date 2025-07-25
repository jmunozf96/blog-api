const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  setupFiles: ['<rootDir>/jest.setup.ts'],
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
};