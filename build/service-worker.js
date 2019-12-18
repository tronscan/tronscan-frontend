/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

importScripts(
<<<<<<< Updated upstream
  "/precache-manifest.55b69d33179ef9664157b93db4d1903b.js"
=======
<<<<<<< HEAD
  "/precache-manifest.7ac79e2cf09bb593e0c653f49c374da0.js"
=======
<<<<<<< HEAD
<<<<<<< HEAD
  "/precache-manifest.4fbce0abe120104a3a1dd46895fc8b26.js"
=======
  "/precache-manifest.b313836a96af5aba92b702e43f99a588.js"
>>>>>>> origin/master
=======
  "/precache-manifest.ab4704e2a188765d902ebcaf89897e4a.js"
>>>>>>> origin/master
>>>>>>> origin/feature/freeze-charts
>>>>>>> Stashed changes
);

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

workbox.core.clientsClaim();

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerNavigationRoute(workbox.precaching.getCacheKeyForURL("/index.html"), {
  
  blacklist: [/^\/_/,/\/[^\/]+\.[^\/]+$/],
});
