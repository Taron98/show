"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./mocks/server");
// Establish API mocking before all tests.
beforeAll(() => server_1.server.listen({ onUnhandledRequest: 'bypass' }));
// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server_1.server.resetHandlers());
// Clean up after the tests are finished.
afterAll(() => server_1.server.close());
