module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src/functions', '<rootDir>/src/database'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
};
