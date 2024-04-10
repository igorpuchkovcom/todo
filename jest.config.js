const {pathsToModuleNameMapper} = require('ts-jest');
const { compilerOptions } = require('./tsconfig.json');

module.exports = {
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testTimeout: 20000
};
