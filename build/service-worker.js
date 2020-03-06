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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
  "/precache-manifest.adec9b0884ffddd6e1e4b9a0341f3b49.js"
=======
  "/precache-manifest.ce5d0bd55321cc83ad176f404933adef.js"
>>>>>>> a45c4a512... build for test
=======
  "/precache-manifest.26d9d65c215013965d168ffdbe8506ca.js"
>>>>>>> 88192a6f3... tron trx price show
=======
  "/precache-manifest.2b328c81baf8410f29a033765905008a.js"
>>>>>>> f1a0f176e... trx change online api build
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
