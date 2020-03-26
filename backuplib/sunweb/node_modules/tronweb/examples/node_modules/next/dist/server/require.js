"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pageNotFoundError = pageNotFoundError;
exports.normalizePagePath = normalizePagePath;
exports.getPagePath = getPagePath;
exports.default = requirePage;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _path = require("path");

var _constants = require("../lib/constants");

function pageNotFoundError(page) {
  var err = new Error("Cannot find module for page: ".concat(page));
  err.code = 'ENOENT';
  return err;
}

function normalizePagePath(page) {
  // If the page is `/` we need to append `/index`, otherwise the returned directory root will be bundles instead of pages
  if (page === '/') {
    page = '/index';
  } // Resolve on anything that doesn't start with `/`


  if (page[0] !== '/') {
    page = "/".concat(page);
  } // Throw when using ../ etc in the pathname


  var resolvedPage = _path.posix.normalize(page);

  if (page !== resolvedPage) {
    throw new Error('Requested and resolved page mismatch');
  }

  return page;
}

function getPagePath(page, _ref) {
  var distDir = _ref.distDir;
  var serverBuildPath = (0, _path.join)(distDir, _constants.SERVER_DIRECTORY);

  var pagesManifest = require((0, _path.join)(serverBuildPath, _constants.PAGES_MANIFEST));

  try {
    page = normalizePagePath(page);
  } catch (err) {
    console.error(err);
    throw pageNotFoundError(page);
  }

  if (!pagesManifest[page]) {
    throw pageNotFoundError(page);
  }

  return (0, _path.join)(serverBuildPath, pagesManifest[page]);
}

function requirePage(_x, _x2) {
  return _requirePage.apply(this, arguments);
}

function _requirePage() {
  _requirePage = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee(page, _ref2) {
    var distDir, pagePath;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            distDir = _ref2.distDir;
            pagePath = getPagePath(page, {
              distDir: distDir
            });
            return _context.abrupt("return", require(pagePath));

          case 3:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return _requirePage.apply(this, arguments);
}