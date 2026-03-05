// Service worker disabled — unregister self
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", () => {
  self.clients.matchAll({ includeUncontrolled: true }).then(clients => {
    clients.forEach(c => c.postMessage({ type: "SW_UNREGISTERED" }));
  });
  self.registration.unregister();
});
