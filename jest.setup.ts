import '@testing-library/jest-dom';

// Add fetch polyfill for Node environment
import 'whatwg-fetch';

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost:54321';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'mock-anon-key';
process.env.AUTH0_SECRET = 'mock-auth0-secret';
process.env.AUTH0_BASE_URL = 'http://localhost:3000';
process.env.AUTH0_ISSUER_BASE_URL = 'https://mock-tenant.auth0.com';
process.env.AUTH0_CLIENT_ID = 'mock-client-id';
process.env.AUTH0_CLIENT_SECRET = 'mock-client-secret';

// Mock fetch globally
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  })
) as jest.Mock;

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: {},
      asPath: '',
      push: jest.fn(),
      replace: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn(),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
      isFallback: false,
    };
  },
}));

// Mock window.alert
Object.defineProperty(window, 'alert', {
  writable: true,
  value: jest.fn(),
});

// Clean up mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});

// Extend expect matchers
expect.extend({
  toHaveBeenCalledWith(received: jest.Mock, ...expected: any[]) {
    const pass = received.mock.calls.some(call =>
      expected.every((arg, index) => this.equals(call[index], arg))
    );

    return {
      pass,
      message: () =>
        pass
          ? `expected ${received.getMockName()} not to have been called with ${expected}`
          : `expected ${received.getMockName()} to have been called with ${expected}`,
    };
  },
});
