// ── Portfolio Service Worker ─────────────────────────────────────────────────
// Strategy:
//   • /_next/static/**  → cache-first  (content-hashed, immutable)
//   • navigation / HTML → network-first with 3 s timeout → cache fallback
//   • images & fonts    → stale-while-revalidate
//   • /api/**           → network-only
//
// Auto-update: skipWaiting on install so new SW takes over immediately.
// Clients reload on controllerchange (see OfflineManager.tsx).

const CACHE_VERSION = 'v8';
const DYNAMIC_CACHE = `portfolio-dynamic-${CACHE_VERSION}`;
const STATIC_CACHE  = `portfolio-static-${CACHE_VERSION}`;

const PRECACHE_URLS = ['/', '/blog', '/kernel', '/offline'];
const SLOW_MS = 5000; // threshold before falling back to cache

// ── Install ──────────────────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(DYNAMIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

// ── Activate ─────────────────────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k.startsWith('portfolio-') && k !== DYNAMIC_CACHE && k !== STATIC_CACHE)
            .map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

// ── Helpers ──────────────────────────────────────────────────────────────────
function broadcast(msg) {
  self.clients.matchAll({ includeUncontrolled: true, type: 'window' })
    .then((clients) => clients.forEach((c) => c.postMessage(msg)));
}

async function fromCache(request, cacheName) {
  const cache = await caches.open(cacheName);
  return cache.match(request);
}

async function putInCache(request, responseClone, cacheName) {
  if (responseClone && responseClone.ok && responseClone.type !== 'opaque') {
    const cache = await caches.open(cacheName);
    cache.put(request, responseClone);
  }
}

// Cache-first: used for immutable hashed assets
async function cacheFirst(request) {
  const cached = await fromCache(request, STATIC_CACHE);
  if (cached) return cached;
  const response = await fetch(request);
  putInCache(request, response.clone(), STATIC_CACHE);
  return response;
}

// Stale-while-revalidate: used for images/fonts
async function staleWhileRevalidate(request) {
  const cached = await fromCache(request, DYNAMIC_CACHE);
  const networkPromise = fetch(request).then((response) => {
    putInCache(request, response.clone(), DYNAMIC_CACHE);
    return response;
  });
  return cached || networkPromise;
}

// Network-first with timeout: used for HTML navigation
function networkFirstWithTimeout(request) {
  return new Promise((resolve) => {
    let settled = false;

    const settle = (response) => {
      if (!settled) { settled = true; resolve(response); }
    };

    // Start the network race
    fetch(request.clone())
      .then((response) => {
        putInCache(request, response.clone(), DYNAMIC_CACHE);
        settle(response);
      })
      .catch(async () => {
        // Network failed → try exact cache hit first
        const cached = await fromCache(request, DYNAMIC_CACHE);
        if (cached) {
          broadcast({ type: 'CACHE_SERVED', reason: 'offline' });
          settle(cached);
          return;
        }
        // For the /offline page itself, return a minimal fallback (avoids redirect loop)
        if (url.pathname === '/offline') {
          settle(new Response(
            '<!doctype html><html><head><meta charset="utf-8"><title>Offline</title></head><body style="background:#020b18;color:#d0e6f2;font-family:monospace;display:flex;align-items:center;justify-content:center;min-height:100vh;text-align:center"><p>You are offline. <a href="/" style="color:#00d4ff">Go home</a></p></body></html>',
            { status: 503, headers: { 'Content-Type': 'text/html' } }
          ));
          return;
        }
        // Redirect to the offline page so the user sees a proper UI
        const offlineCached = await fromCache(new Request('/offline'), DYNAMIC_CACHE);
        if (offlineCached) {
          settle(new Response(null, {
            status: 302,
            headers: { 'Location': `/offline?from=${encodeURIComponent(url.pathname)}` },
          }));
        } else {
          settle(new Response(
            `<!doctype html><html><head><meta charset="utf-8"><title>Offline</title></head><body style="background:#020b18;color:#d0e6f2;font-family:monospace;display:flex;align-items:center;justify-content:center;min-height:100vh;text-align:center"><p><b style="color:#fbbf24">Offline</b> — ${url.pathname} isn't cached.<br><a href="/" style="color:#00d4ff">Go home</a></p></body></html>`,
            { status: 503, headers: { 'Content-Type': 'text/html' } }
          ));
        }
      });

    // Slow-connection timeout
    setTimeout(async () => {
      if (settled) return;
      const cached = await fromCache(request, DYNAMIC_CACHE);
      if (cached) {
        broadcast({ type: 'CACHE_SERVED', reason: 'slow' });
        settle(cached);
      }
      // No cache yet → keep waiting for network
    }, SLOW_MS);
  });
}

// ── Fetch ────────────────────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET requests from this origin
  if (request.method !== 'GET') return;
  if (url.origin !== self.location.origin && !url.hostname.includes('fonts.g')) return;

  // Skip admin and API routes
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/admin')) return;

  // Skip connectivity probe — must reach real network
  if (url.searchParams.has('_probe')) return;

  // /offline?from=X → serve the cached /offline page directly
  if (url.pathname === '/offline' && url.searchParams.has('from')) {
    event.respondWith(
      fromCache(new Request('/offline'), DYNAMIC_CACHE).then((cached) =>
        cached || fetch(request)
      )
    );
    return;
  }

  // Immutable hashed Next.js bundles → cache-first
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Google Fonts → stale-while-revalidate
  if (url.hostname.includes('fonts.googleapis.com') || url.hostname.includes('fonts.gstatic.com')) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  // Images → stale-while-revalidate
  if (/\.(png|jpe?g|gif|webp|avif|svg|ico)(\?.*)?$/.test(url.pathname)) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  // Everything else (HTML, JS chunks w/o hashes, etc.) → network-first with timeout
  event.respondWith(networkFirstWithTimeout(request));
});

// ── Messages from client ─────────────────────────────────────────────────────
self.addEventListener('message', (event) => {
  if (event.data?.type === 'RECACHE') {
    Promise.all([
      caches.delete(DYNAMIC_CACHE),
    ]).then(() =>
      caches.open(DYNAMIC_CACHE)
        .then((cache) => cache.addAll(PRECACHE_URLS).catch(() => {}))
        .then(() => broadcast({ type: 'RECACHE_DONE' }))
    );
  }

  // Proactively cache a list of URLs in the background
  if (event.data?.type === 'PREFETCH') {
    const urls = Array.isArray(event.data.urls) ? event.data.urls : [];
    caches.open(DYNAMIC_CACHE).then((cache) => {
      urls.forEach((u) => {
        // Skip if already cached
        cache.match(u).then((hit) => {
          if (!hit) {
            fetch(u).then((r) => { if (r.ok) cache.put(u, r); }).catch(() => {});
          }
        });
      });
    });
  }
});
