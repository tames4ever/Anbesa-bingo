self.addEventListener("install", e=>{
  e.waitUntil(
    caches.open("anbesa").then(cache=>{
      return cache.addAll(["./","index.html","app.js","manifest.json","logo.png","bingo_cards.json"]);
    })
  );
});

self.addEventListener("fetch", e=>{
  e.respondWith(
    caches.match(e.request).then(res=> res || fetch(e.request))
  );
});
