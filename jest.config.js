module.exports = {
    projects: [
      {
        displayName: 'user',
        preset: 'ts-jest',
        testEnvironment: 'node',
        testMatch: [
          '<rootDir>/apps/user/src/__tests__/*.spec.ts',
        ],
        moduleFileExtensions: ['js', 'json', 'ts'],
        rootDir: './',
        transform: {
            '^.+\\.{ts|tsx}?$': ['ts-jest', {
              babel: true,
              tsConfig: 'tsconfig.json',
            }],
          },
      },
      // Add configurations for other applications as needed
    ],
};
  