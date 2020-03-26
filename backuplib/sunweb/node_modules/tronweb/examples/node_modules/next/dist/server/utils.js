"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getChunkNameFromFilename = getChunkNameFromFilename;
exports.getAvailableChunks = getAvailableChunks;
exports.isInternalUrl = isInternalUrl;
exports.addCorsSupport = addCorsSupport;

var _path = require("path");

var _fs = require("fs");

function getChunkNameFromFilename(filename, dev) {
  if (dev) {
    return filename.replace(/\.[^.]*$/, '');
  }

  return filename.replace(/-[^-]*$/, '');
}

function getAvailableChunks(distDir, dev) {
  var chunksDir = (0, _path.join)(distDir, 'chunks');
  if (!(0, _fs.existsSync)(chunksDir)) return {};
  var chunksMap = {};
  var chunkFiles = (0, _fs.readdirSync)(chunksDir);
  chunkFiles.forEach(function (filename) {
    if (/\.js$/.test(filename)) {
      var chunkName = getChunkNameFromFilename(filename, dev);
      chunksMap[chunkName] = filename;
    }
  });
  return chunksMap;
}

var internalPrefixes = [/^\/_next\//, /^\/static\//];

function isInternalUrl(url) {
  for (var _i = 0; _i < internalPrefixes.length; _i++) {
    var prefix = internalPrefixes[_i];

    if (prefix.test(url)) {
      return true;
    }
  }

  return false;
}

function addCorsSupport(req, res) {
  if (!req.headers.origin) {
    return {
      preflight: false
    };
  }

  res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET'); // Based on https://github.com/primus/access-control/blob/4cf1bc0e54b086c91e6aa44fb14966fa5ef7549c/index.js#L158

  if (req.headers['access-control-request-headers']) {
    res.setHeader('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
  }

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return {
      preflight: true
    };
  }

  return {
    preflight: false
  };
}