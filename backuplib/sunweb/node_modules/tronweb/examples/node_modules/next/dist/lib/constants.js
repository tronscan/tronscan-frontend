"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DEFAULT_PAGES_DIR = exports.NEXT_PROJECT_ROOT_NODE_MODULES = exports.NEXT_PROJECT_ROOT_DIST = exports.NEXT_PROJECT_ROOT = exports.ROUTE_NAME_REGEX = exports.IS_BUNDLED_PAGE_REGEX = exports.BLOCKED_PAGES = exports.BUILD_ID_FILE = exports.CONFIG_FILE = exports.SERVER_DIRECTORY = exports.BUILD_MANIFEST = exports.PAGES_MANIFEST = exports.PHASE_DEVELOPMENT_SERVER = exports.PHASE_PRODUCTION_SERVER = exports.PHASE_PRODUCTION_BUILD = exports.PHASE_EXPORT = void 0;

var _path = require("path");

var PHASE_EXPORT = 'phase-export';
exports.PHASE_EXPORT = PHASE_EXPORT;
var PHASE_PRODUCTION_BUILD = 'phase-production-build';
exports.PHASE_PRODUCTION_BUILD = PHASE_PRODUCTION_BUILD;
var PHASE_PRODUCTION_SERVER = 'phase-production-server';
exports.PHASE_PRODUCTION_SERVER = PHASE_PRODUCTION_SERVER;
var PHASE_DEVELOPMENT_SERVER = 'phase-development-server';
exports.PHASE_DEVELOPMENT_SERVER = PHASE_DEVELOPMENT_SERVER;
var PAGES_MANIFEST = 'pages-manifest.json';
exports.PAGES_MANIFEST = PAGES_MANIFEST;
var BUILD_MANIFEST = 'build-manifest.json';
exports.BUILD_MANIFEST = BUILD_MANIFEST;
var SERVER_DIRECTORY = 'server';
exports.SERVER_DIRECTORY = SERVER_DIRECTORY;
var CONFIG_FILE = 'next.config.js';
exports.CONFIG_FILE = CONFIG_FILE;
var BUILD_ID_FILE = 'BUILD_ID';
exports.BUILD_ID_FILE = BUILD_ID_FILE;
var BLOCKED_PAGES = ['/_document', '/_app', '/_error'];
exports.BLOCKED_PAGES = BLOCKED_PAGES;
var IS_BUNDLED_PAGE_REGEX = /^bundles[/\\]pages.*\.js$/;
exports.IS_BUNDLED_PAGE_REGEX = IS_BUNDLED_PAGE_REGEX;
var ROUTE_NAME_REGEX = /^bundles[/\\]pages[/\\](.*)\.js$/;
exports.ROUTE_NAME_REGEX = ROUTE_NAME_REGEX;
var NEXT_PROJECT_ROOT = (0, _path.join)(__dirname, '..', '..');
exports.NEXT_PROJECT_ROOT = NEXT_PROJECT_ROOT;
var NEXT_PROJECT_ROOT_DIST = (0, _path.join)(NEXT_PROJECT_ROOT, 'dist');
exports.NEXT_PROJECT_ROOT_DIST = NEXT_PROJECT_ROOT_DIST;
var NEXT_PROJECT_ROOT_NODE_MODULES = (0, _path.join)(NEXT_PROJECT_ROOT, 'node_modules');
exports.NEXT_PROJECT_ROOT_NODE_MODULES = NEXT_PROJECT_ROOT_NODE_MODULES;
var DEFAULT_PAGES_DIR = (0, _path.join)(NEXT_PROJECT_ROOT_DIST, 'pages');
exports.DEFAULT_PAGES_DIR = DEFAULT_PAGES_DIR;