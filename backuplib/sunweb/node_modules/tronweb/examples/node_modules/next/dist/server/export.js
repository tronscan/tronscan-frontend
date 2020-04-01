"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _getIterator2 = _interopRequireDefault(require("@babel/runtime/core-js/get-iterator"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _keys = _interopRequireDefault(require("@babel/runtime/core-js/object/keys"));

var _promise = _interopRequireDefault(require("@babel/runtime/core-js/promise"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _del = _interopRequireDefault(require("del"));

var _recursiveCopy = _interopRequireDefault(require("recursive-copy"));

var _mkdirpThen = _interopRequireDefault(require("mkdirp-then"));

var _walk = _interopRequireDefault(require("walk"));

var _path2 = require("path");

var _fs = require("fs");

var _config = _interopRequireDefault(require("./config"));

var _constants = require("../lib/constants");

var _render = require("./render");

var _utils = require("./utils");

var _asset = require("../lib/asset");

var envConfig = _interopRequireWildcard(require("../lib/runtime-config"));

function _default(_x, _x2, _x3) {
  return _ref.apply(this, arguments);
}

function _ref() {
  _ref = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee2(dir, options, configuration) {
    var nextConfig, distDir, buildId, pagesManifest, pages, defaultPathMap, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _page2, outDir, renderOpts, serverRuntimeConfig, publicRuntimeConfig, exportPathMap, exportPaths, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, _path, _exportPathMap$_path, _page3, _exportPathMap$_path$, query, req, res, htmlFilename, baseDir, htmlFilepath, html, log;

    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            log = function _ref3(message) {
              if (options.silent) return;
              console.log(message);
            };

            dir = (0, _path2.resolve)(dir);
            nextConfig = configuration || (0, _config.default)(_constants.PHASE_EXPORT, dir);
            distDir = (0, _path2.join)(dir, nextConfig.distDir);
            log("> using build directory: ".concat(distDir));

            if ((0, _fs.existsSync)(distDir)) {
              _context2.next = 7;
              break;
            }

            throw new Error("Build directory ".concat(distDir, " does not exist. Make sure you run \"next build\" before running \"next start\" or \"next export\"."));

          case 7:
            buildId = (0, _fs.readFileSync)((0, _path2.join)(distDir, _constants.BUILD_ID_FILE), 'utf8');
            pagesManifest = require((0, _path2.join)(distDir, _constants.SERVER_DIRECTORY, _constants.PAGES_MANIFEST));
            pages = (0, _keys.default)(pagesManifest);
            defaultPathMap = {};
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context2.prev = 14;
            _iterator = (0, _getIterator2.default)(pages);

          case 16:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context2.next = 24;
              break;
            }

            _page2 = _step.value;

            if (!(_page2 === '/_document' || _page2 === '/_app')) {
              _context2.next = 20;
              break;
            }

            return _context2.abrupt("continue", 21);

          case 20:
            defaultPathMap[_page2] = {
              page: _page2
            };

          case 21:
            _iteratorNormalCompletion = true;
            _context2.next = 16;
            break;

          case 24:
            _context2.next = 30;
            break;

          case 26:
            _context2.prev = 26;
            _context2.t0 = _context2["catch"](14);
            _didIteratorError = true;
            _iteratorError = _context2.t0;

          case 30:
            _context2.prev = 30;
            _context2.prev = 31;

            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }

          case 33:
            _context2.prev = 33;

            if (!_didIteratorError) {
              _context2.next = 36;
              break;
            }

            throw _iteratorError;

          case 36:
            return _context2.finish(33);

          case 37:
            return _context2.finish(30);

          case 38:
            // Initialize the output directory
            outDir = options.outdir;
            _context2.next = 41;
            return (0, _del.default)((0, _path2.join)(outDir, '*'));

          case 41:
            _context2.next = 43;
            return (0, _mkdirpThen.default)((0, _path2.join)(outDir, '_next', buildId));

          case 43:
            if (!(0, _fs.existsSync)((0, _path2.join)(dir, 'static'))) {
              _context2.next = 47;
              break;
            }

            log('  copying "static" directory');
            _context2.next = 47;
            return (0, _recursiveCopy.default)((0, _path2.join)(dir, 'static'), (0, _path2.join)(outDir, 'static'), {
              expand: true
            });

          case 47:
            if (!(0, _fs.existsSync)((0, _path2.join)(distDir, 'static'))) {
              _context2.next = 51;
              break;
            }

            log('  copying "static build" directory');
            _context2.next = 51;
            return (0, _recursiveCopy.default)((0, _path2.join)(distDir, 'static'), (0, _path2.join)(outDir, '_next', 'static'));

          case 51:
            if (!(0, _fs.existsSync)((0, _path2.join)(distDir, 'chunks'))) {
              _context2.next = 57;
              break;
            }

            log('  copying dynamic import chunks');
            _context2.next = 55;
            return (0, _mkdirpThen.default)((0, _path2.join)(outDir, '_next', 'webpack'));

          case 55:
            _context2.next = 57;
            return (0, _recursiveCopy.default)((0, _path2.join)(distDir, 'chunks'), (0, _path2.join)(outDir, '_next', 'webpack', 'chunks'));

          case 57:
            _context2.next = 59;
            return copyPages(distDir, outDir, buildId);

          case 59:
            // Get the exportPathMap from the config file
            if (typeof nextConfig.exportPathMap !== 'function') {
              console.log("> No \"exportPathMap\" found in \"".concat(_constants.CONFIG_FILE, "\". Generating map from \"./pages\""));

              nextConfig.exportPathMap =
              /*#__PURE__*/
              function () {
                var _ref2 = (0, _asyncToGenerator2.default)(
                /*#__PURE__*/
                _regenerator.default.mark(function _callee(defaultMap) {
                  return _regenerator.default.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          return _context.abrupt("return", defaultMap);

                        case 1:
                        case "end":
                          return _context.stop();
                      }
                    }
                  }, _callee, this);
                }));

                return function (_x4) {
                  return _ref2.apply(this, arguments);
                };
              }();
            } // Start the rendering process


            renderOpts = {
              dir: dir,
              buildId: buildId,
              nextExport: true,
              assetPrefix: nextConfig.assetPrefix.replace(/\/$/, ''),
              distDir: distDir,
              dev: false,
              staticMarkup: false,
              hotReloader: null,
              availableChunks: (0, _utils.getAvailableChunks)(distDir, false)
            };
            serverRuntimeConfig = nextConfig.serverRuntimeConfig, publicRuntimeConfig = nextConfig.publicRuntimeConfig;

            if (publicRuntimeConfig) {
              renderOpts.runtimeConfig = publicRuntimeConfig;
            }

            envConfig.setConfig({
              serverRuntimeConfig: serverRuntimeConfig,
              publicRuntimeConfig: publicRuntimeConfig
            }); // set the assetPrefix to use for 'next/asset'

            (0, _asset.setAssetPrefix)(renderOpts.assetPrefix); // We need this for server rendering the Link component.

            global.__NEXT_DATA__ = {
              nextExport: true
            };
            _context2.next = 68;
            return nextConfig.exportPathMap(defaultPathMap);

          case 68:
            exportPathMap = _context2.sent;
            exportPaths = (0, _keys.default)(exportPathMap);
            _iteratorNormalCompletion2 = true;
            _didIteratorError2 = false;
            _iteratorError2 = undefined;
            _context2.prev = 73;
            _iterator2 = (0, _getIterator2.default)(exportPaths);

          case 75:
            if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
              _context2.next = 96;
              break;
            }

            _path = _step2.value;
            log("> exporting path: ".concat(_path));

            if (_path.startsWith('/')) {
              _context2.next = 80;
              break;
            }

            throw new Error("path \"".concat(_path, "\" doesn't start with a backslash"));

          case 80:
            _exportPathMap$_path = exportPathMap[_path], _page3 = _exportPathMap$_path.page, _exportPathMap$_path$ = _exportPathMap$_path.query, query = _exportPathMap$_path$ === void 0 ? {} : _exportPathMap$_path$;
            req = {
              url: _path
            };
            res = {};
            htmlFilename = "".concat(_path).concat(_path2.sep, "index.html");

            if ((0, _path2.extname)(_path) !== '') {
              // If the path has an extension, use that as the filename instead
              htmlFilename = _path;
            } else if (_path === '/') {
              // If the path is the root, just use index.html
              htmlFilename = 'index.html';
            }

            baseDir = (0, _path2.join)(outDir, (0, _path2.dirname)(htmlFilename));
            htmlFilepath = (0, _path2.join)(outDir, htmlFilename);
            _context2.next = 89;
            return (0, _mkdirpThen.default)(baseDir);

          case 89:
            _context2.next = 91;
            return (0, _render.renderToHTML)(req, res, _page3, query, renderOpts);

          case 91:
            html = _context2.sent;
            (0, _fs.writeFileSync)(htmlFilepath, html, 'utf8');

          case 93:
            _iteratorNormalCompletion2 = true;
            _context2.next = 75;
            break;

          case 96:
            _context2.next = 102;
            break;

          case 98:
            _context2.prev = 98;
            _context2.t1 = _context2["catch"](73);
            _didIteratorError2 = true;
            _iteratorError2 = _context2.t1;

          case 102:
            _context2.prev = 102;
            _context2.prev = 103;

            if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
              _iterator2.return();
            }

          case 105:
            _context2.prev = 105;

            if (!_didIteratorError2) {
              _context2.next = 108;
              break;
            }

            throw _iteratorError2;

          case 108:
            return _context2.finish(105);

          case 109:
            return _context2.finish(102);

          case 110:
            // Add an empty line to the console for the better readability.
            log('');

          case 111:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this, [[14, 26, 30, 38], [31,, 33, 37], [73, 98, 102, 110], [103,, 105, 109]]);
  }));
  return _ref.apply(this, arguments);
}

function copyPages(distDir, outDir, buildId) {
  // TODO: do some proper error handling
  return new _promise.default(function (resolve, reject) {
    var nextBundlesDir = (0, _path2.join)(distDir, 'bundles', 'pages');

    var walker = _walk.default.walk(nextBundlesDir, {
      followLinks: false
    });

    walker.on('file', function (root, stat, next) {
      var filename = stat.name;
      var fullFilePath = "".concat(root).concat(_path2.sep).concat(filename);
      var relativeFilePath = fullFilePath.replace(nextBundlesDir, ''); // We should not expose this page to the client side since
      // it has no use in the client side.

      if (relativeFilePath === "".concat(_path2.sep, "_document.js")) {
        next();
        return;
      }

      var destFilePath = null;

      if (relativeFilePath === "".concat(_path2.sep, "index.js")) {
        destFilePath = (0, _path2.join)(outDir, '_next', buildId, 'page', relativeFilePath);
      } else if (/index\.js$/.test(filename)) {
        var newRelativeFilePath = relativeFilePath.replace("".concat(_path2.sep, "index.js"), '.js');
        destFilePath = (0, _path2.join)(outDir, '_next', buildId, 'page', newRelativeFilePath);
      } else {
        destFilePath = (0, _path2.join)(outDir, '_next', buildId, 'page', relativeFilePath);
      }

      (0, _recursiveCopy.default)(fullFilePath, destFilePath).then(next).catch(reject);
    });
    walker.on('end', resolve);
  });
}