module.exports = {
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: 'apps',
    transform: {
      '^.+\\.(t|j)s$': 'ts-jest',
    },
    collectCoverageFrom: [
      '**/*.(t|j)s',
      '!**/node_modules/**',
      '!**/dist/**',
      '!**/main.ts',
    ],
    coverageDirectory: '../coverage',
    testEnvironment: 'node',
    testRegex: '.*\\.spec\\.ts$'
  };
  