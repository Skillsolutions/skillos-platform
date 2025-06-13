/**
 * Test setup file for SkillOS platform
 * 
 * This file configures the testing environment and provides
 * global utilities for all test files.
 */

import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';
import { server } from './mocks/server';
import { beforeAll, afterEach, afterAll } from '@jest/globals';

// Create a local mock function to avoid TypeScript namespace issues
const mockFn = () => {
  const fn: any = function() {
    return fn;
  };
  fn.mockImplementation = (impl: (...args: any[]) => any) => {
    fn.implementation = impl;
    return fn;
  };
  fn.mockReturnValue = (val: any) => {
    fn.returnValue = val;
    return fn;
  };
  return fn;
};

// Increase timeout for async tests
// Note: Timeout is now configured in jest.config.js instead of here
// to avoid TypeScript namespace issues

// Configure testing library
configure({
  testIdAttribute: 'data-testid',
});

// Setup MSW server for API mocking
beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Mock IntersectionObserver
class MockIntersectionObserver {
  readonly root: Element | null;
  readonly rootMargin: string;
  readonly thresholds: ReadonlyArray<number>;
  
  constructor() {
    this.root = null;
    this.rootMargin = '';
    this.thresholds = [0];
  }
  
  disconnect() {
    return null;
  }
  
  observe() {
    return null;
  }
  
  takeRecords() {
    return [];
  }
  
  unobserve() {
    return null;
  }
}

global.IntersectionObserver = MockIntersectionObserver;

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: mockFn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: mockFn(),
    removeListener: mockFn(),
    addEventListener: mockFn(),
    removeEventListener: mockFn(),
    dispatchEvent: mockFn(),
  })),
});

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock scrollTo
window.scrollTo = mockFn();

// Mock console methods to catch test warnings
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

console.error = (...args) => {
  // Check if this is a React testing library warning we want to ignore
  const isIgnoredWarning = args.some(
    arg => typeof arg === 'string' && (
      arg.includes('Warning: ReactDOM.render is no longer supported') ||
      arg.includes('Warning: useLayoutEffect does nothing on the server')
    )
  );
  
  if (!isIgnoredWarning) {
    originalConsoleError(...args);
  }
};

console.warn = (...args) => {
  // Check if this is a warning we want to ignore
  const isIgnoredWarning = args.some(
    arg => typeof arg === 'string' && (
      arg.includes('Warning: React does not recognize the') ||
      arg.includes('Warning: The tag <')
    )
  );
  
  if (!isIgnoredWarning) {
    originalConsoleWarn(...args);
  }
};
