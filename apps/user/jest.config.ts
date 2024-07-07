module.exports = {
    displayName: 'user',
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: [
      '<rootDir>/apps/user/src/__tests__/*.spec.ts',
    ],
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: '../../', // Adjust rootDir based on your project structure
    transform: {
        '^.+\\.{ts|tsx}?$': ['ts-jest', {
          babel: true,
          tsConfig: 'tsconfig.json',
        }],
      },
};
  