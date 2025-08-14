
export default {
  testEnvironment: "node",
  transform: {},                    // no Babel; run JS as-is
  extensionsToTreatAsEsm: [".js"],  // tell Jest these are ESM
  collectCoverage: true,
  collectCoverageFrom: ["index.js"],
};
