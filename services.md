# The service layer design

The service layer is a collection of modules that solve infrastructure concerns. It consists of core services and processors. They directly access the infrastructure (browser APIs) and never access any of the other layers above it (application code, state store, etc.). The purpose of the service layer is to organize and centralize infrastructure concerns.

## Directory organization

All service layer code is housed under a `services` directory.

```text
services/
  types.ts
  index.ts
  core/
    http.ts
    injection.ts
    redirect.ts
    storage.ts
    ...
  processors/
    auth/
      index.ts
      http.ts
      redirect.ts
    locale/
      index.ts
      http.ts
      injection.ts
      redirect.ts
    brands/
      index.ts
      http.ts
    ....
```

At the root of the `services` folder, the `types.ts` module provides the interfaces that establishes the contract between the core services and processors.

The `services/index.ts` module implements the discovery of processors, and configures the services. It serves as a central place from which the configured services are imported.

The `services/core` directory contains the core services. Each service is implemented in a separate modules.

The processors are implemented as groups of modules in the `services/processors` directory. Each group is a folder named after the domain it handles. The `index.ts` collects all processors within the group. The modules in the processor group other than `index.ts` are named after the core service modules they relate to.

## The core services

The core services directly represent infrastructure concerns like HTTP requests, redirects, and similar.

The core service module is expected to expose a single function `init()` which initializes the service and returns an object that represents the service's public interface. The `init()` function must accept a list of processors for the service. There are no restrictions on the public interface.

The core service modules **must not** import libraries that are not related to infrastructure concerns (e.g., Redux is not an infrastructure concern). They also **must not** import other service modules.

## Processors

Processors are object that conform to a processor interface specified in the types module. Each core service has one matching processor interface, and the processor objects are expected to implement exactly one of them.

The processors are instantiated once during application initialization and they may retain internal state throughout the lifecycle. For instance, an HTTP processor for authentication may keep a JWE token as its internal state. Or even share it using `sessionStorage`.

## Example

The following is an example of the HTTP service with a processor.

### Interfaces

The interfaces in `types.ts` describe the universe of the service layer. These types are shared between the core services and processor and serve as an explicit contract between them.

```typescript
// services/types.ts

// We alias Request/Response so that we have a bit more flexibility when modifying the underlying implementation
export type HttpRequest = Request;
export type HttpResponse = Response;

// Type aliases for readability
export type Endpoint = string;
export type QueryParams = Record<string, string>;
export type CacheStrategy = 'network-only' | 'session' | 'expiry' | 'keyed';

// API contracts
export type HttpOptions = RequestInit & {
  cacheStrategy?: CacheStrategy;
  cacheKey?: string;
  auth?: boolean;
  // ....
};
export type Fetcher = (
  request: HttpRequest,
  options: HttpOptions
) => Promise<HttpResponse>;
// Middleware-style processor (same as ExpressJS or ConnectJS)
export type ProcessFetch = (fetcher: Fetcher) => Fetcher;
export type HttpProcessor = {
  processFetch?: ProcessFetch;
};
```

### Core module

```typescript
// services/core/http.ts
import {
  HttpProcessor,
  Endpoint,
  QueryParams,
  HttpOptions,
  HttpRequest,
  HttpResponse,
} from '@/services/types';

type SuccessResult<T> {
  content: T; // Name it 'content' so we don't get the awkward `data.data`
  status: number;
  error: null;
}

type ErrorResult<T> {
  content: null;
  status: number;
  error: Error;
}

type Result<T> = SuccessResult<T> | ErrorResult<T>;
type FetchInit = {
  signal?: AbortSignal;
};

const baseFetcher: Fetcher = (request, options) => {
  const fetchInit: FetchInit = {};
  if (options.abort)
    fetchInit.signal = options.abort.signal;
  if (options.cacheStrategy)
    request.headers.set('X-Cache-Strategy', options.cacheStrategy);
  if (options.cacheKey)
    request.headers.set('X-Cache-Key', options.cacheKey);
  return fetch(request, fetchInit);
};

class HttpService {
  doRequest: Fetcher;

  constructor(processors: HttpProcessor[]) {
    // Here, we are using functional composition for processors function
    this.doRequest = processors.reduce(
      (f, p) => p.processFetch?.(f) ?? f,
      baseFetcher
    );
  }

  postProcess<T>(response: HttpResponse, error: Error): Result<T> {
    if (error) {
      return {content: null, status: -1, error: error};
    }

    const contentType = response.headers.get('content-type') || '';
    const responseData = contentType.includes('application/json')
      ? response.json()
      : response.text();

    return responseData.then(
      payload => ({
        content,
        status: response.status,
        error: null,
      }),
      error => ({
        content: null,
        status: response.status,
        error,
      })
    );
  }

  async request<T>(request: HttpRequest, options: HttpOptions): Result<T> {
    let response
    let error
    try {
      response = await this.doRequest(request);
    } catch (e) {
      error
    }
    return this.postProcess<T>(response, error);
  }

  GET<T = any>(path: Endpoint, params: QueryParams, options: HttpOptions): Result<T> {
    const url = new URL(path, location.origin);
    for (let k in params) url.searchParams.set(k, params[k]);
    const request = new Request(url, {method: 'GET'});
    return this.request<T>(request, options);
  }

  POST<T = any, U = Record<string, any>>(path: string, params: U, options: HttpOptions): Result<T> {
    const request = new Request(url, {method: 'POST', body: JSON.stringify(params)});
    return this.request<T>(request, options);
  }
}
```

### Processor

Here I will give an example of an auth processor.

```typescript
// services/processors/auth/http.ts
import { HttpOptions, HttpProcessor, HttpRequest } from '@/services/types';

class AuthHttpProcessor implements HttpProcessor {
  getToken() {
    return sessionStorage.authToken;
  }

  setToken(token) {
    sessionStorage.authToken = token;
  }

  processFetch(next) {
    // 1. Any set up during initial composition (none here)

    return async (request: HttpRequest, options: HttpOptions) => {
      // 2. Process the request
      if (options.auth ?? true) {
        const token = this.getToken();
        console.assert(
          token,
          'Must have token in storage before making authenticated requests'
        );
        if (token) request.headers.set('Authorization', `Bearer ${token}`);
      }

      // 3. Invoke the next fetcher, let the errors propagate...
      //    unless the purpose of the processor is to deal with errors
      const response = await next(request, options);

      // 4. Process the response (capture the token for auth requests)
      if (request.url.endsWith('/authenticate') && response.ok) {
        const originalResponse = response.clone();
        try {
          const { token } = await originalResponse.json();
          this.setToken(token);
        } catch (e) {
          console.error('Error extracting auth token', error);
        }
      }

      // 5. Return the response
      return response;
    };
  }
}
```

## Injections

One of the key requirements for the service layer is to abstract the infrastructure concerns away from the rest of the code. Because of this, it cannot depend directly on any code outside the layer.

However, the layer may still require information found in other layers. To solve this issue, the application is given a way to inject information into the service layer.

Injections are domain-specific (that is, information required by domain-specific processors, not core services). We therefore decided to implement injection itself as a core service, with processors handling individual injections.

Here's how this may be implemented:

### Interfaces

Since injections can be used in arbitrary ways by the processors, the interface is very simple.

```typescript
// services/types.ts

type Injection = {
  // Arbitrary injections, all keys are optional
  getCmsLocale?: () => string;
};

type ProcessInjection = (injection: Injection) => void;

type InjectionProcessor = {
  processInjection: ProcessInjection;
};
```

### The core service

```typescript
// services/core/injections.ts

import {Injections, InjectionProcessor} from '@/services/types'

class Injections = {
  processors: InjectionProcessor[];

  constructor(processors: InjectionProcessor[]) {
    this.processors = processors;
  }

  inject(injection: Injection) {
    // No composition. Each processor handles injections independently.
    this.processors.forEach(processor => processor.processInjection(injection));
  }
}
```

### Injection processor

The individual processors can 'process' injections and retain the injections as local in-memory state:

```typescript
// services/processors/locale/injections.ts
import { InjectionProcessor } from '@/services/types';

let getCmsLocale = () => '';

class LocaleInjectionsProcessor implements InjectionProcessor {
  processInjection(injection) {
    if ('getCmsLocale' in injection) getCmsLocale = injection.getCmsLocale;
  }
}
```

Another locale processor may use the injection processor's state:

```typescript
// services/processors/locale/http.ts

import {HttpProcessor, HttpRequest, HttpResponse, HttpOptions} from '@/services/types'

import {getCmsLocale} from './injections';

class LocaleHttpProcessor implements HttpProcessor {
  processFetch(next) {
    return (request: HttpRequest, options: HttpOptions): HttpRequest => {
      const url = new URL(request.url);

      // Check if it's an API URL (starts with /api/)
      if (url.pathname.match(/^\/api\//)) {
        url.searchParams.set('l', getCmsLocale());

      // Check if it's a NextJS API events URL
      else if (url.pathname.match(/^\/nextapi\/xapi\/rest\/events/))
        url.searchParams.set('cmsLocale', getCmsLocale());

      // Make the request with an updated request object
      return next(new Request(url, request), options);
    }
  }
}
```

### Reverse injections

Reverse injection is not a special feature of the injections service. Rather, it's a usage pattern.

If you inject a function, the processors are able to call that function with arbitrary values as defined in the injections interface. For example, when the auth endpoint completes the request, and the user profile information is obtained, the injected callback can be invoked with the profile data. And so on.

The implication of this design is that that the entire service layer can be used as an **observable**.

```typescript
// services/processors/auth/http.ts
import {
  HttpOptions,
  HttpProcessor,
  HttpRequest,
  HttpResponse
} from '@/services/types';

import { onLogin } from './injections';

class AuthHttpProcessor implements HttpProcessor {
  getToken() {
    return sessionStorage.authToken;
  }

  setToken(token) {
    sessionStorage.authToken = token;
  }

  processFetch(next) {
    return async (request: HttpRequest, options: HttpOptions) => {
      if (options.auth ?? true) {
        const token = this.getToken();
        console.assert(
          token,
          'Must have token in storage before making authenticated requests'
        );
        if (token) request.headers.set('Authorization', `Bearer ${token}`);
      }

      const response = await next(request, options);

      if (request.url.endsWith('/authenticate') && response.ok) {
        const originalResponse = response.clone();
        try {
          const { token, ...data } = await originalResponse.json();
          this.setToken(token);
          onLogin(data); // <-- invoke the listener
        } catch (e) {
          console.error('Error extracting auth token', error);
        }
      }

      return response;
    };
  }
}
```

## Caching

Service Workers are the ideal technology for implementing caching in modern web applications for several reasons:

1. Standardized Evergreen Technology—Service Workers are a W3C standard supported by all modern browsers. They receive continuous updates and improvements, ensuring long-term viability without vendor lock-in.

2. Framework-Agnostic—Unlike framework-specific caching solutions, Service Workers operate at the browser level. This means the caching layer remains intact even if you migrate from Next.js to another framework, protecting your infrastructure investment.

3. Client-Side Only—Service Workers only run in the browser where caching actually provides performance benefits. Server-side caching is a different concern with different optimization strategies. By using Service Workers, we avoid the complexity of isomorphic caching logic.

4. Specialized for the Task—Service Workers were specifically designed for intercepting network requests and implementing caching strategies. They provide granular control over request/response handling that would be difficult to achieve through application-level code.

5. Offline-First Capabilities—Service Workers enable true offline functionality, allowing the application to serve cached content even without network connectivity—crucial for mobile users with intermittent connections.

### Adding Service Worker to Next.js

To integrate a Service Worker with Next.js, create the worker file in the `public` directory:

```javascript
// public/sw.js
self.addEventListener('install', (event) => {
  // Perform install steps
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Clean up old caches
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Implement caching strategies here
});
```

Register the Service Worker in your Next.js app:

```typescript
// app/providers/ServiceWorkerProvider.tsx
'use client';

import { useEffect } from 'react';

// app/providers/ServiceWorkerProvider.tsx

// app/providers/ServiceWorkerProvider.tsx

export function ServiceWorkerProvider({ children }) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then(
        (registration) => console.log('SW registered:', registration),
        (error) => console.log('SW registration failed:', error)
      );
    }
  }, []);

  return children;
}
```

### HTTP Service Integration

The HTTP core service communicates caching intent through the `HttpOptions`:

```typescript
// services/core/http.ts
const baseFetcher: Fetcher = (request, options) => {
  // Add caching headers that the Service Worker will read
  if (options.cacheStrategy) {
    request.headers.set('X-Cache-Strategy', options.cacheStrategy);
  }
  if (options.cacheKey) {
    request.headers.set('X-Cache-Key', options.cacheKey);
  }
  if (options.cacheTTL) {
    request.headers.set('X-Cache-TTL', options.cacheTTL.toString());
  }

  return fetch(request);
};
```

Usage example:

```typescript
// Application code
const result = await http.GET(
  '/api/settings',
  {},
  {
    cacheStrategy: 'expiry',
    cacheTTL: 86400000 // 24 hours
  }
);

const events = await http.GET(
  '/api/events',
  { sport: 'football' },
  {
    cacheStrategy: 'network-first',
    cacheTTL: 60000 // 1 minute
  }
);
```

### Caching Strategy Implementations

Here are three caching strategies implemented in the Service Worker:

#### 1. Network-First Strategy (for Fresh Data)

Best for data that changes frequently but should work offline with stale data:

```javascript
// public/sw.js
self.addEventListener('fetch', (event) => {
  const strategy = event.request.headers.get('X-Cache-Strategy');

  if (strategy === 'network-first') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Clone the response before caching
          const responseToCache = response.clone();
          caches.open('api-cache').then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return response;
        })
        .catch(() => {
          // Network failed, try cache
          return caches.match(event.request);
        })
    );
  }
});
```

#### 2. Expiry Strategy (Time-Based Cache)

For data that's expensive to fetch and changes predictably:

```javascript
// public/sw.js
async function expiryStrategy(request) {
  const cache = await caches.open('expiry-cache');
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    const cachedTime = cachedResponse.headers.get('X-Cached-Time');
    const ttl = parseInt(request.headers.get('X-Cache-TTL') || '3600000');

    if (Date.now() - parseInt(cachedTime) < ttl) {
      return cachedResponse; // Still fresh
    }
  }

  // Fetch fresh data
  const response = await fetch(request);
  const responseToCache = response.clone();

  // Add timestamp header
  const headers = new Headers(responseToCache.headers);
  headers.set('X-Cached-Time', Date.now().toString());

  const timedResponse = new Response(responseToCache.body, {
    status: responseToCache.status,
    statusText: responseToCache.statusText,
    headers: headers
  });

  await cache.put(request, timedResponse);
  return response;
}
```

## Service index and discovery

The core services and processors are collected into the respective index modules. These are:

- `src/services/core/index.ts`—to gether all the core services.
- `src/services/processors/index.ts`—to gether all the processors.
- `src/services/processors/{processorName}/index.ts`—to gether individual processor interfaces.

### Core service index

The core service simply collects all core services under one object.

```typescript
// services/core/index.ts
import { HttpService } from './http';
import { InjectionService } from './injection';
import { RedirectService } from './redirect';

//....

export default {
  http: HttpService,
  redirect: RedirectService,
  injection: InjectionService
  // ....
};
```

### Processor index

The root processor index collects all domains under one roof:

```typescript
// services/processors/index.ts

import auth from './auth';
import locale from './locale';
import brands from './brands';
// ....

export [ // It's an array, but the order doesn't actually matter
  auth,
  locale,
  brands,
  // ....
];
```

In each processor directory, we have an index module that collects the processors for that domain.

```typescript
// services/processors/auth/index.ts
import { AuthHttpService } from './http';
import { AuthRedirectService } from './redirect';

export default {
  http: AuthHttpProcessor,
  redirect: AuthRedirectServices
};
```

### Service index

The service index is built semi-dynamically based on the core service and processor indexes:

```typescript
import coreServices from './core';
import processors from './processors';
import { ProcessorIndex, ServiceIndex } from './types';

const processorIndex: ProcessorIndex = {};
// Declare beforehand that the index will be fully populated in the end
const serviceIndex: ServiceIndex = {} as unknown as ServiceIndex;

for (const p of processors)
  for (const serviceType in processor) {
    processorIndex[serviceType] ??= [];
    processorIndex[serviceType].push(processor[serviceType]);
  }

for (const serviceType in coreServices) {
  const Service = coreServices[serviceType];
  const processors = processorIndex[serviceType] ?? [];
  serviceIndex[serviceType] = new Service(processors);
}

export default Object.freeze(serviceIndex);
```

## TODO

The service layer architecture addresses processor composition but several implementation details need to be specified:

### Service Instance Lifecycle

Services need different instantiation strategies for server vs client contexts due to their fundamentally different execution environments.

**Server Context Requirements:**

- Services must be stateless and created per-request to prevent user data bleeding between requests
- Processors cannot maintain persistent state across requests
- Auth tokens and user context must be request-scoped

**Client Context Requirements:**

- Services can be singletons for performance optimization
- Processors can maintain persistent state in localStorage/sessionStorage
- Auth tokens and user context can persist across the session

**Questions:**

- Should services use a factory pattern that creates different implementations based on execution context?
- How do we ensure processors adapt their behavior (stateless vs stateful) based on the instantiation context?
- Can we load different processor modules entirely for server vs client contexts?

### Migration Strategy

How do you transition from the current axios instance proliferation to the service layer?

**Questions:**

- Can the service layer coexist with existing axios instances during migration?
- How do you migrate existing interceptors to processors without breaking existing functionality?
- What backward compatibility guarantees are needed for existing HTTP client usage?

#### 3. Keyed Strategy (User-Specific Caching)

For personalized data that should be cached per user:

```javascript
// public/sw.js
async function keyedStrategy(request) {
  const cacheKey = request.headers.get('X-Cache-Key');
  if (!cacheKey) return fetch(request); // No key, no cache

  // Create a cache-specific URL with the key
  const cacheUrl = new URL(request.url);
  cacheUrl.searchParams.set('_cacheKey', cacheKey);
  const cacheRequest = new Request(cacheUrl.toString());

  const cache = await caches.open('keyed-cache');
  const cachedResponse = await cache.match(cacheRequest);

  if (cachedResponse) {
    return cachedResponse;
  }

  const response = await fetch(request);
  await cache.put(cacheRequest, response.clone());
  return response;
}

// Example usage in HTTP service:
// await http.GET('/api/user-settings', {}, {
//   cacheStrategy: 'keyed',
//   cacheKey: userId,
// });
```

### Cache Management

The Service Worker should also implement cache cleanup and versioning:

```javascript
// public/sw.js
const CACHE_VERSION = 'v1';
const CACHE_NAMES = [
  `api-cache-${CACHE_VERSION}`,
  `expiry-cache-${CACHE_VERSION}`,
  `keyed-cache-${CACHE_VERSION}`
];

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => !CACHE_NAMES.includes(name))
          .map((name) => caches.delete(name))
      );
    })
  );
});
```
