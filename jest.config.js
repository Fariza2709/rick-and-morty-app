module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/no-babel',
  testEnvironment: 'jest-environment-jsdom',
  roots: ['<rootDir>/src/'],
  moduleFileExtensions: [
    'js',
    'vue',
    'json',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.vue$': '@vue/vue3-jest',
    '^.+\\.js$': 'babel-jest',
  },
  collectCoverage: true,
  coverageReporters: ['html', 'text'],
  testMatch: ['**/specs/**/*.spec.js'],
  transformIgnorePatterns: [
    '/node_modules/(?!axios|vue|@vue)',
  ],
};
