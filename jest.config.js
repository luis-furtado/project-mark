/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  testMatch: ['**/*.test.ts'],
  transform: {
    "^.+\.tsx?$": ["ts-jest",{}],
  },
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/build/',
    '/coverage/',
    '/scripts/', 
    '/__tests__/utils/',
    '/src/strategies/',
    '/src/validation.ts',
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/build/',
    '/coverage/',
    '/scripts/', 
    '/__tests__/utils/',
    '/src/strategies/',
    '/src/shared/errors/',
  ],
};