"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPages = getPages;
exports.getPagePaths = getPagePaths;
exports.createEntry = createEntry;
exports.getPageEntries = getPageEntries;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _getIterator2 = _interopRequireDefault(require("@babel/runtime/core-js/get-iterator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _path = _interopRequireDefault(require("path"));

var _promisify = _interopRequireDefault(require("../../lib/promisify"));

var _glob = _interopRequireDefault(require("glob"));

var glob = (0, _promisify.default)(_glob.default);

function getPages(_x, _x2) {
  return _getPages.apply(this, arguments);
}

function _getPages() {
  _getPages = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee(dir, _ref) {
    var nextPagesDir, dev, isServer, pageExtensions, pageFiles;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            nextPagesDir = _ref.nextPagesDir, dev = _ref.dev, isServer = _ref.isServer, pageExtensions = _ref.pageExtensions;
            _context.next = 3;
            return getPagePaths(dir, {
              dev: dev,
              isServer: isServer,
              pageExtensions: pageExtensions
            });

          case 3:
            pageFiles = _context.sent;
            return _context.abrupt("return", getPageEntries(pageFiles, {
              nextPagesDir: nextPagesDir,
              isServer: isServer,
              pageExtensions: pageExtensions
            }));

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return _getPages.apply(this, arguments);
}

function getPagePaths(_x3, _x4) {
  return _getPagePaths.apply(this, arguments);
} // Convert page path into single entry


function _getPagePaths() {
  _getPagePaths = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee2(dir, _ref2) {
    var dev, isServer, pageExtensions, pages;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            dev = _ref2.dev, isServer = _ref2.isServer, pageExtensions = _ref2.pageExtensions;

            if (!dev) {
              _context2.next = 7;
              break;
            }

            _context2.next = 4;
            return glob("pages/+(_document|_app|_error).+(".concat(pageExtensions, ")"), {
              cwd: dir
            });

          case 4:
            pages = _context2.sent;
            _context2.next = 10;
            break;

          case 7:
            _context2.next = 9;
            return glob(isServer ? "pages/**/*.+(".concat(pageExtensions, ")") : "pages/**/!(_document)*.+(".concat(pageExtensions, ")"), {
              cwd: dir
            });

          case 9:
            pages = _context2.sent;

          case 10:
            return _context2.abrupt("return", pages);

          case 11:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
  return _getPagePaths.apply(this, arguments);
}

function createEntry(filePath) {
  var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      name = _ref3.name,
      pageExtensions = _ref3.pageExtensions;

  var parsedPath = _path.default.parse(filePath);

  var entryName = name || filePath; // This makes sure we compile `pages/blog/index.js` to `pages/blog.js`.
  // Excludes `pages/index.js` from this rule since we do want `/` to route to `pages/index.js`

  if (parsedPath.dir !== 'pages' && parsedPath.name === 'index') {
    entryName = "".concat(parsedPath.dir, ".js");
  } // Makes sure supported extensions are stripped off. The outputted file should always be `.js`


  if (pageExtensions) {
    entryName = entryName.replace(new RegExp("\\.+(".concat(pageExtensions, ")$")), '.js');
  }

  return {
    name: _path.default.join('bundles', entryName),
    files: [parsedPath.root ? filePath : "./".concat(filePath)] // The entry always has to be an array.

  };
} // Convert page paths into entries


function getPageEntries(pagePaths) {
  var _ref4 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      nextPagesDir = _ref4.nextPagesDir,
      _ref4$isServer = _ref4.isServer,
      isServer = _ref4$isServer === void 0 ? false : _ref4$isServer,
      pageExtensions = _ref4.pageExtensions;

  var entries = {};
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = (0, _getIterator2.default)(pagePaths), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _filePath = _step.value;
      var entry = createEntry(_filePath, {
        pageExtensions: pageExtensions
      });
      entries[entry.name] = entry.files;
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  var appPagePath = _path.default.join(nextPagesDir, '_app.js');

  var appPageEntry = createEntry(appPagePath, {
    name: 'pages/_app.js'
  }); // default app.js

  if (!entries[appPageEntry.name]) {
    entries[appPageEntry.name] = appPageEntry.files;
  }

  var errorPagePath = _path.default.join(nextPagesDir, '_error.js');

  var errorPageEntry = createEntry(errorPagePath, {
    name: 'pages/_error.js'
  }); // default error.js

  if (!entries[errorPageEntry.name]) {
    entries[errorPageEntry.name] = errorPageEntry.files;
  }

  if (isServer) {
    var documentPagePath = _path.default.join(nextPagesDir, '_document.js');

    var documentPageEntry = createEntry(documentPagePath, {
      name: 'pages/_document.js'
    }); // default _document.js

    if (!entries[documentPageEntry.name]) {
      entries[documentPageEntry.name] = documentPageEntry.files;
    }
  }

  return entries;
}