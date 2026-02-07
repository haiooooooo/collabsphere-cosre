import '@testing-library/jest-dom';
// setupTests.js
global.IntersectionObserver = class {
    constructor() {}
  
    observe() {
      return null;
    }
  
    unobserve() {
      return null;
    }
  
    disconnect() {
      return null;
    }
  };
  