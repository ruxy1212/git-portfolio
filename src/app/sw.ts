/// <reference lib="webworker" />

import { defaultCache } from '@serwist/turbopack/worker'; // or "@serwist/next/worker" if using webpack mode
import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist';
import { Serwist } from 'serwist';

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache, // Handles static assets, images, JS/CSS, etc. with sensible defaults (StaleWhileRevalidate, etc.)
  fallbacks: {
    entries: [
      {
        url: '/~offline', // Your offline fallback page (create this next)
        matcher({ request }) {
          return request.destination === 'document'; // Only for HTML navigation requests
        },
      },
    ],
  },
});

serwist.addEventListeners();
