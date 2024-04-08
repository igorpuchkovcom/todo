module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src/functions'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
};
