// Service Worker for PWA and Offline Mode
const CACHE_NAME = 'voyager-v1'
const STATIC_CACHE = 'voyager-static-v1'
const DYNAMIC_CACHE = 'voyager-dynamic-v1'

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/src/main.jsx',
  '/src/App.jsx',
  '/src/index.css',
  '/manifest.json',
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...')
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[Service Worker] Caching static assets')
      return cache.addAll(STATIC_ASSETS)
    })
  )
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...')
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
          .map((key) => caches.delete(key))
      )
    })
  )
  return self.clients.claim()
})

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event

  // Skip non-GET requests
  if (request.method !== 'GET') return

  // Skip chrome extensions
  if (request.url.startsWith('chrome-extension://')) return

  event.respondWith(
    caches.match(request).then((response) => {
      if (response) {
        return response
      }

      return fetch(request)
        .then((response) => {
          // Don't cache non-successful responses
          if (!response || response.status !== 200 || response.type === 'error') {
            return response
          }

          // Clone the response
          const responseToCache = response.clone()

          // Cache dynamic content
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseToCache)
          })

          return response
        })
        .catch(() => {
          // Return offline page if available
          return caches.match('/offline.html')
        })
    })
  )
})

// Background Sync - for offline bookings
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Background sync', event.tag)

  if (event.tag === 'sync-bookings') {
    event.waitUntil(syncBookings())
  }

  if (event.tag === 'sync-photos') {
    event.waitUntil(syncPhotos())
  }
})

// Push Notifications
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push notification received')

  const data = event.data ? event.data.json() : {}
  const title = data.title || 'Voyager'
  const options = {
    body: data.body || 'Nueva notificación de Voyager',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: data.url || '/',
    actions: [
      { action: 'open', title: 'Ver' },
      { action: 'close', title: 'Cerrar' },
    ],
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

// Notification Click
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification clicked')

  event.notification.close()

  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.openWindow(event.notification.data || '/')
    )
  }
})

// Helper functions
async function syncBookings() {
  try {
    const cache = await caches.open('offline-bookings')
    const requests = await cache.keys()

    for (const request of requests) {
      const response = await cache.match(request)
      const data = await response.json()

      // Send to server
      await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      // Remove from cache after successful sync
      await cache.delete(request)
    }

    console.log('[Service Worker] Bookings synced successfully')
  } catch (error) {
    console.error('[Service Worker] Error syncing bookings:', error)
  }
}

async function syncPhotos() {
  try {
    const cache = await caches.open('offline-photos')
    const requests = await cache.keys()

    for (const request of requests) {
      const response = await cache.match(request)
      const formData = await response.formData()

      // Upload to server
      await fetch('/api/photos', {
        method: 'POST',
        body: formData,
      })

      await cache.delete(request)
    }

    console.log('[Service Worker] Photos synced successfully')
  } catch (error) {
    console.error('[Service Worker] Error syncing photos:', error)
  }
}
