const C = "servis-v1";
const FILES = ["/driver.html", "/shared.js", "/map.jpg", "/icon-192.png", "/manifest.webmanifest"];
self.addEventListener("install", e => { e.waitUntil(caches.open(C).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const r = e.request;
  if (r.method !== "GET" || new URL(r.url).pathname === "/ws") return;
  e.respondWith(fetch(r).then(res => { const cp = res.clone(); caches.open(C).then(c => c.put(r, cp)).catch(() => {}); return res; }).catch(() => caches.match(r)));
});
self.addEventListener("notificationclick", e => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: "window" }).then(l => (l.length ? l[0].focus() : self.clients.openWindow("/driver.html"))));
});
