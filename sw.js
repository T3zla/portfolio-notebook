const PREFIX='portfolio-notebook-'+encodeURIComponent(self.registration.scope)+'-';
const CACHE=PREFIX+'v23';
const ASSETS=['./','./index.html','./styles.css','./js/app.js','./js/questions.js','./js/storage.js','./js/export.js','./manifest.webmanifest','./icon.svg','./icon-180.png','./icon-192.png','./icon-512.png','./assets/highlighter.svg','./assets/underline.svg'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith(PREFIX)&&k!==CACHE).map(k=>caches.delete(k))))));
self.addEventListener('fetch',e=>{if(e.request.method==='GET'&&new URL(e.request.url).origin===location.origin)e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));});
