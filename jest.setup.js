// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

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
    };
  },
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
    };
  },
  usePathname() {
    return '';
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));

// Mock next/server and global Response
global.Response = class Response {
  constructor(body, init = {}) {
    this.body = body;
    this.status = init.status || 200;
    this.statusText = init.statusText || '';
    this.headers = init.headers || {};
    this._json = JSON.parse(body);
  }
  json() {
    return Promise.resolve(this._json);
  }
};

jest.mock('next/server', () => ({
  NextResponse: {
    json: (body, init) => new Response(JSON.stringify(body), init),
  },
  NextRequest: class NextRequest {
    constructor(url) {
      this.url = url;
      this.method = 'GET';
      this.headers = new Map();
      this.nextUrl = new URL(url);
    }
  }
}));
