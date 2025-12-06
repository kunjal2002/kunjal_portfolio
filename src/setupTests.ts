// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Use standard test polyfills/mocks:
// - jest-canvas-mock provides a canvas implementation for JSDOM
// - resize-observer-polyfill provides ResizeObserver for tests
// A local manual mock for `@vercel/analytics/react` is provided under `src/__mocks__`.
import 'jest-canvas-mock';
(global as any).ResizeObserver = require('resize-observer-polyfill');
