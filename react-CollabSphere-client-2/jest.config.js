module.exports = {
    // Mock CSS files using identity-obj-proxy
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],

    moduleNameMapper: {
      "^.+\\.(css|scss)$": "identity-obj-proxy",
      "^.+\\.(jpg|jpeg|png|gif|svg)$": "<rootDir>/__mocks__/fileMock.js",
    },
  
    // Transform JavaScript and JSX files using babel-jest to handle ES modules
    transform: {
      "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
    },
  
    // Ignore node_modules except for specific ES module packages that need to be transformed (like axios)
    transformIgnorePatterns: [
      "node_modules/(?!axios)", // Include axios for transformation
    ],
  };
  