// api/jest.config.js

module.exports = {
    testEnvironment: 'node',
    coverageDirectory: 'coverage',
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
    setupFiles: ['dotenv/config'],
};
