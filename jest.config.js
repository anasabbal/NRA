module.exports = {
  projects: [
    '<rootDir>/apps/user',
    //'<rootDir>/apps/driver',
    //'<rootDir>/apps/auth',
    //'<rootDir>/apps/gateway',
  ],
  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage/',  // This is the main coverage directory
  testEnvironment: 'node',
};
