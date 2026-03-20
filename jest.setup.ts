import '@testing-library/jest-dom';

import { TextDecoder, TextEncoder } from 'node:util';

const globalAny = globalThis as unknown as {
  TextEncoder?: typeof TextEncoder;
  TextDecoder?: typeof TextDecoder;
  fetch?: typeof fetch;
  Request?: typeof Request;
  Response?: typeof Response;
  Headers?: typeof Headers;
};

if (!globalAny.TextEncoder) {
  globalAny.TextEncoder = TextEncoder;
}

if (!globalAny.TextDecoder) {
  globalAny.TextDecoder = TextDecoder as typeof TextDecoder;
}

if (typeof window === 'undefined' && (!globalAny.fetch || !globalAny.Request || !globalAny.Response || !globalAny.Headers)) {
  // undici is already available in the dependency tree (Next.js runtime).
  const undici = require('undici') as {
    fetch: typeof fetch;
    Request: typeof Request;
    Response: typeof Response;
    Headers: typeof Headers;
  };
  globalAny.fetch = undici.fetch;
  globalAny.Request = undici.Request;
  globalAny.Response = undici.Response;
  globalAny.Headers = undici.Headers;
}

