const siteCacheName = 'stite-static-v1.1';
const dynamicCacheName = 'site-dynamic-v1.1';

const assets = [
    '/',
    '/index.html',
    '/pages/fallback.html',
    '/pages/404.html',
    '/css/style.css',
    '/img/img-main.gif',
    '/img/app-logo.png',
    '/js/app.js',
    '/js/jquery.js',
    '/manifest.json',
    '/sw.js'
];


self.addEventListener('install', event => {
    console.log("Service worker installed");
    event.waitUntil(
        caches.open(siteCacheName).then(cache => {
            console.log('caching shell assets');
            cache.addAll(assets);
        })
    )
});


self.addEventListener('activate', event => {
    console.log("Service worker activated");
    event.waitUntil(
        caches.keys().then(keys => {
            // console.log(key);
            return Promise.all(
                keys.filter(key => key != siteCacheName && key != dynamicCacheName)
                    .map(key => caches.delete(key))
            );
        })
    )
});



self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(async (cacheRes) => {
            if (cacheRes) {
                return cacheRes;
            } else {
                const fetchRes = await fetch(event.request);
                if (fetchRes.status == 404) {
                    if (event.request.url.indexOf('.html') > -1) {
                        return caches.match('/pages/404.html');
                    } else {
                        return fetchRes;
                    }
                } else {
                    return caches.open(dynamicCacheName).then(cache => {
                        cache.put(event.request.url, fetchRes.clone()).then(() => fetchRes);
                    });
                }
            }
        }).catch(() => {
            if (event.request.url.indexOf('.html') > -1) {
                return caches.match('/pages/fallback.html');
            }
        })
    );
});
