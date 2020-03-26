"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _map = _interopRequireDefault(require("@babel/runtime/core-js/map"));

var _set = _interopRequireDefault(require("@babel/runtime/core-js/set"));

var _keys = _interopRequireDefault(require("@babel/runtime/core-js/object/keys"));

var _getIterator2 = _interopRequireDefault(require("@babel/runtime/core-js/get-iterator"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _promise = _interopRequireDefault(require("@babel/runtime/core-js/promise"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _path = require("path");

var _webpackDevMiddleware = _interopRequireDefault(require("webpack-dev-middleware"));

var _webpackHotMiddleware = _interopRequireDefault(require("webpack-hot-middleware"));

var _del = _interopRequireDefault(require("del"));

var _onDemandEntryHandler = _interopRequireDefault(require("./on-demand-entry-handler"));

var _webpack = _interopRequireDefault(require("webpack"));

var _webpack2 = _interopRequireDefault(require("../build/webpack"));

var _utils = require("./utils");

var _constants = require("../lib/constants");

var HotReloader =
/*#__PURE__*/
function () {
  function HotReloader(dir) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        quiet = _ref.quiet,
        config = _ref.config,
        buildId = _ref.buildId;

    (0, _classCallCheck2.default)(this, HotReloader);
    this.buildId = buildId;
    this.dir = dir;
    this.quiet = quiet;
    this.middlewares = [];
    this.webpackDevMiddleware = null;
    this.webpackHotMiddleware = null;
    this.initialized = false;
    this.stats = null;
    this.compilationErrors = null;
    this.prevAssets = null;
    this.prevChunkNames = null;
    this.prevFailedChunkNames = null;
    this.prevChunkHashes = null;
    this.config = config;
  }

  (0, _createClass2.default)(HotReloader, [{
    key: "run",
    value: function () {
      var _run = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee(req, res) {
        var _addCorsSupport, preflight, _loop, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, fn;

        return _regenerator.default.wrap(function _callee$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                // Usually CORS support is not needed for the hot-reloader (this is dev only feature)
                // With when the app runs for multi-zones support behind a proxy,
                // the current page is trying to access this URL via assetPrefix.
                // That's when the CORS support is needed.
                _addCorsSupport = (0, _utils.addCorsSupport)(req, res), preflight = _addCorsSupport.preflight;

                if (!preflight) {
                  _context2.next = 3;
                  break;
                }

                return _context2.abrupt("return");

              case 3:
                _loop =
                /*#__PURE__*/
                _regenerator.default.mark(function _loop(fn) {
                  return _regenerator.default.wrap(function _loop$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          _context.next = 2;
                          return new _promise.default(function (resolve, reject) {
                            fn(req, res, function (err) {
                              if (err) return reject(err);
                              resolve();
                            });
                          });

                        case 2:
                        case "end":
                          return _context.stop();
                      }
                    }
                  }, _loop, this);
                });
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context2.prev = 7;
                _iterator = (0, _getIterator2.default)(this.middlewares);

              case 9:
                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                  _context2.next = 15;
                  break;
                }

                fn = _step.value;
                return _context2.delegateYield(_loop(fn), "t0", 12);

              case 12:
                _iteratorNormalCompletion = true;
                _context2.next = 9;
                break;

              case 15:
                _context2.next = 21;
                break;

              case 17:
                _context2.prev = 17;
                _context2.t1 = _context2["catch"](7);
                _didIteratorError = true;
                _iteratorError = _context2.t1;

              case 21:
                _context2.prev = 21;
                _context2.prev = 22;

                if (!_iteratorNormalCompletion && _iterator.return != null) {
                  _iterator.return();
                }

              case 24:
                _context2.prev = 24;

                if (!_didIteratorError) {
                  _context2.next = 27;
                  break;
                }

                throw _iteratorError;

              case 27:
                return _context2.finish(24);

              case 28:
                return _context2.finish(21);

              case 29:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee, this, [[7, 17, 21, 29], [22,, 24, 28]]);
      }));

      return function run(_x, _x2) {
        return _run.apply(this, arguments);
      };
    }()
  }, {
    key: "clean",
    value: function () {
      var _clean = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee2() {
        return _regenerator.default.wrap(function _callee2$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                return _context3.abrupt("return", (0, _del.default)((0, _path.join)(this.dir, this.config.distDir), {
                  force: true
                }));

              case 1:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee2, this);
      }));

      return function clean() {
        return _clean.apply(this, arguments);
      };
    }()
  }, {
    key: "start",
    value: function () {
      var _start = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee3() {
        var configs, compiler, buildTools;
        return _regenerator.default.wrap(function _callee3$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return this.clean();

              case 2:
                _context4.next = 4;
                return _promise.default.all([(0, _webpack2.default)(this.dir, {
                  dev: true,
                  isServer: false,
                  config: this.config,
                  buildId: this.buildId
                }), (0, _webpack2.default)(this.dir, {
                  dev: true,
                  isServer: true,
                  config: this.config,
                  buildId: this.buildId
                })]);

              case 4:
                configs = _context4.sent;
                compiler = (0, _webpack.default)(configs);
                _context4.next = 8;
                return this.prepareBuildTools(compiler);

              case 8:
                buildTools = _context4.sent;
                this.assignBuildTools(buildTools);
                _context4.next = 12;
                return this.waitUntilValid();

              case 12:
                this.stats = _context4.sent.stats[0];

              case 13:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee3, this);
      }));

      return function start() {
        return _start.apply(this, arguments);
      };
    }()
  }, {
    key: "stop",
    value: function () {
      var _stop = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee4(webpackDevMiddleware) {
        var middleware;
        return _regenerator.default.wrap(function _callee4$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                middleware = webpackDevMiddleware || this.webpackDevMiddleware;

                if (!middleware) {
                  _context5.next = 3;
                  break;
                }

                return _context5.abrupt("return", new _promise.default(function (resolve, reject) {
                  middleware.close(function (err) {
                    if (err) return reject(err);
                    resolve();
                  });
                }));

              case 3:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee4, this);
      }));

      return function stop(_x3) {
        return _stop.apply(this, arguments);
      };
    }()
  }, {
    key: "reload",
    value: function () {
      var _reload = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee5() {
        var configs, compiler, buildTools, oldWebpackDevMiddleware;
        return _regenerator.default.wrap(function _callee5$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                this.stats = null;
                _context6.next = 3;
                return this.clean();

              case 3:
                _context6.next = 5;
                return _promise.default.all([(0, _webpack2.default)(this.dir, {
                  dev: true,
                  isServer: false,
                  config: this.config
                }), (0, _webpack2.default)(this.dir, {
                  dev: true,
                  isServer: true,
                  config: this.config
                })]);

              case 5:
                configs = _context6.sent;
                compiler = (0, _webpack.default)(configs);
                _context6.next = 9;
                return this.prepareBuildTools(compiler);

              case 9:
                buildTools = _context6.sent;
                _context6.next = 12;
                return this.waitUntilValid(buildTools.webpackDevMiddleware);

              case 12:
                this.stats = _context6.sent;
                oldWebpackDevMiddleware = this.webpackDevMiddleware;
                this.assignBuildTools(buildTools);
                _context6.next = 17;
                return this.stop(oldWebpackDevMiddleware);

              case 17:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee5, this);
      }));

      return function reload() {
        return _reload.apply(this, arguments);
      };
    }()
  }, {
    key: "assignBuildTools",
    value: function assignBuildTools(_ref2) {
      var webpackDevMiddleware = _ref2.webpackDevMiddleware,
          webpackHotMiddleware = _ref2.webpackHotMiddleware,
          onDemandEntries = _ref2.onDemandEntries;
      this.webpackDevMiddleware = webpackDevMiddleware;
      this.webpackHotMiddleware = webpackHotMiddleware;
      this.onDemandEntries = onDemandEntries;
      this.middlewares = [webpackDevMiddleware, webpackHotMiddleware, onDemandEntries.middleware()];
    }
  }, {
    key: "prepareBuildTools",
    value: function () {
      var _prepareBuildTools = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee6(compiler) {
        var _this = this;

        var ignored, webpackDevMiddlewareConfig, webpackDevMiddleware, webpackHotMiddleware, onDemandEntries;
        return _regenerator.default.wrap(function _callee6$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                // This flushes require.cache after emitting the files. Providing 'hot reloading' of server files.
                compiler.compilers.forEach(function (singleCompiler) {
                  singleCompiler.plugin('after-emit', function (compilation, callback) {
                    var assets = compilation.assets;

                    if (_this.prevAssets) {
                      var _arr = (0, _keys.default)(assets);

                      for (var _i = 0; _i < _arr.length; _i++) {
                        var f = _arr[_i];
                        deleteCache(assets[f].existsAt);
                      }

                      var _arr2 = (0, _keys.default)(_this.prevAssets);

                      for (var _i2 = 0; _i2 < _arr2.length; _i2++) {
                        var _f = _arr2[_i2];

                        if (!assets[_f]) {
                          deleteCache(_this.prevAssets[_f].existsAt);
                        }
                      }
                    }

                    _this.prevAssets = assets;
                    callback();
                  });
                });
                compiler.compilers[0].plugin('done', function (stats) {
                  var compilation = stats.compilation;
                  var chunkNames = new _set.default(compilation.chunks.map(function (c) {
                    return c.name;
                  }).filter(function (name) {
                    return _constants.IS_BUNDLED_PAGE_REGEX.test(name);
                  }));
                  var failedChunkNames = new _set.default(compilation.errors.map(function (e) {
                    return e.module.reasons;
                  }).reduce(function (a, b) {
                    return a.concat(b);
                  }, []).map(function (r) {
                    return r.module.chunks;
                  }).reduce(function (a, b) {
                    return a.concat(b);
                  }, []).map(function (c) {
                    return c.name;
                  }));
                  var chunkHashes = new _map.default(compilation.chunks.filter(function (c) {
                    return _constants.IS_BUNDLED_PAGE_REGEX.test(c.name);
                  }).map(function (c) {
                    return [c.name, c.hash];
                  }));

                  if (_this.initialized) {
                    // detect chunks which have to be replaced with a new template
                    // e.g, pages/index.js <-> pages/_error.js
                    var added = diff(chunkNames, _this.prevChunkNames);
                    var removed = diff(_this.prevChunkNames, chunkNames);
                    var succeeded = diff(_this.prevFailedChunkNames, failedChunkNames); // reload all failed chunks to replace the templace to the error ones,
                    // and to update error content

                    var failed = failedChunkNames;
                    var rootDir = (0, _path.join)('bundles', 'pages');
                    var _iteratorNormalCompletion2 = true;
                    var _didIteratorError2 = false;
                    var _iteratorError2 = undefined;

                    try {
                      for (var _iterator2 = (0, _getIterator2.default)(new _set.default((0, _toConsumableArray2.default)(added).concat((0, _toConsumableArray2.default)(removed), (0, _toConsumableArray2.default)(failed), (0, _toConsumableArray2.default)(succeeded)))), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var _n2 = _step2.value;
                        var route = toRoute((0, _path.relative)(rootDir, _n2));

                        _this.send('reload', route);
                      }
                    } catch (err) {
                      _didIteratorError2 = true;
                      _iteratorError2 = err;
                    } finally {
                      try {
                        if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
                          _iterator2.return();
                        }
                      } finally {
                        if (_didIteratorError2) {
                          throw _iteratorError2;
                        }
                      }
                    }

                    var changedPageRoutes = [];
                    var _iteratorNormalCompletion3 = true;
                    var _didIteratorError3 = false;
                    var _iteratorError3 = undefined;

                    try {
                      for (var _iterator3 = (0, _getIterator2.default)(chunkHashes), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                        var _ref5 = _step3.value;

                        var _ref4 = (0, _slicedToArray2.default)(_ref5, 2);

                        var _n3 = _ref4[0];
                        var _hash = _ref4[1];
                        if (!_this.prevChunkHashes.has(_n3)) continue;
                        if (_this.prevChunkHashes.get(_n3) === _hash) continue;

                        var _route = toRoute((0, _path.relative)(rootDir, _n3));

                        changedPageRoutes.push(_route);
                      } // This means `/_app` is most likely included in the list, or a page was added/deleted in this compilation run.
                      // This means we should filter out `/_app` because `/_app` will be re-rendered with the page reload.

                    } catch (err) {
                      _didIteratorError3 = true;
                      _iteratorError3 = err;
                    } finally {
                      try {
                        if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
                          _iterator3.return();
                        }
                      } finally {
                        if (_didIteratorError3) {
                          throw _iteratorError3;
                        }
                      }
                    }

                    if (added.size !== 0 || removed.size !== 0 || changedPageRoutes.length > 1) {
                      changedPageRoutes = changedPageRoutes.filter(function (route) {
                        return route !== '/_app' && route !== '/_document';
                      });
                    }

                    var _iteratorNormalCompletion4 = true;
                    var _didIteratorError4 = false;
                    var _iteratorError4 = undefined;

                    try {
                      for (var _iterator4 = (0, _getIterator2.default)(changedPageRoutes), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                        var _changedPageRoute = _step4.value;

                        // notify change to recover from runtime errors
                        _this.send('change', _changedPageRoute);
                      }
                    } catch (err) {
                      _didIteratorError4 = true;
                      _iteratorError4 = err;
                    } finally {
                      try {
                        if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
                          _iterator4.return();
                        }
                      } finally {
                        if (_didIteratorError4) {
                          throw _iteratorError4;
                        }
                      }
                    }
                  }

                  _this.initialized = true;
                  _this.stats = stats;
                  _this.compilationErrors = null;
                  _this.prevChunkNames = chunkNames;
                  _this.prevFailedChunkNames = failedChunkNames;
                  _this.prevChunkHashes = chunkHashes;
                });
                ignored = [/(^|[/\\])\../, // .dotfiles
                /node_modules/];
                webpackDevMiddlewareConfig = {
                  publicPath: "/_next/webpack/",
                  noInfo: true,
                  quiet: true,
                  clientLogLevel: 'warning',
                  watchOptions: {
                    ignored: ignored
                  }
                };

                if (this.config.webpackDevMiddleware) {
                  console.log("> Using \"webpackDevMiddleware\" config function defined in ".concat(this.config.configOrigin, "."));
                  webpackDevMiddlewareConfig = this.config.webpackDevMiddleware(webpackDevMiddlewareConfig);
                }

                webpackDevMiddleware = (0, _webpackDevMiddleware.default)(compiler, webpackDevMiddlewareConfig);
                webpackHotMiddleware = (0, _webpackHotMiddleware.default)(compiler.compilers[0], {
                  path: '/_next/webpack-hmr',
                  log: false,
                  heartbeat: 2500
                });
                onDemandEntries = (0, _onDemandEntryHandler.default)(webpackDevMiddleware, compiler.compilers, (0, _objectSpread2.default)({
                  dir: this.dir,
                  dev: true,
                  reload: this.reload.bind(this),
                  pageExtensions: this.config.pageExtensions
                }, this.config.onDemandEntries));
                return _context7.abrupt("return", {
                  webpackDevMiddleware: webpackDevMiddleware,
                  webpackHotMiddleware: webpackHotMiddleware,
                  onDemandEntries: onDemandEntries
                });

              case 9:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee6, this);
      }));

      return function prepareBuildTools(_x4) {
        return _prepareBuildTools.apply(this, arguments);
      };
    }()
  }, {
    key: "waitUntilValid",
    value: function waitUntilValid(webpackDevMiddleware) {
      var middleware = webpackDevMiddleware || this.webpackDevMiddleware;
      return new _promise.default(function (resolve) {
        middleware.waitUntilValid(resolve);
      });
    }
  }, {
    key: "getCompilationErrors",
    value: function () {
      var _getCompilationErrors = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee7() {
        var _stats$compilation, compiler, errors, _iteratorNormalCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, _err, _iteratorNormalCompletion6, _didIteratorError6, _iteratorError6, _iterator6, _step6, _r, _iteratorNormalCompletion7, _didIteratorError7, _iteratorError7, _iterator7, _step7, _c, path, _errors2;

        return _regenerator.default.wrap(function _callee7$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.next = 2;
                return this.onDemandEntries.waitUntilReloaded();

              case 2:
                if (this.compilationErrors) {
                  _context8.next = 73;
                  break;
                }

                this.compilationErrors = new _map.default();

                if (!this.stats.hasErrors()) {
                  _context8.next = 73;
                  break;
                }

                _stats$compilation = this.stats.compilation, compiler = _stats$compilation.compiler, errors = _stats$compilation.errors;
                _iteratorNormalCompletion5 = true;
                _didIteratorError5 = false;
                _iteratorError5 = undefined;
                _context8.prev = 9;
                _iterator5 = (0, _getIterator2.default)(errors);

              case 11:
                if (_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done) {
                  _context8.next = 59;
                  break;
                }

                _err = _step5.value;
                _iteratorNormalCompletion6 = true;
                _didIteratorError6 = false;
                _iteratorError6 = undefined;
                _context8.prev = 16;
                _iterator6 = (0, _getIterator2.default)(_err.module.reasons);

              case 18:
                if (_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done) {
                  _context8.next = 42;
                  break;
                }

                _r = _step6.value;
                _iteratorNormalCompletion7 = true;
                _didIteratorError7 = false;
                _iteratorError7 = undefined;
                _context8.prev = 23;

                for (_iterator7 = (0, _getIterator2.default)(_r.module.chunks); !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                  _c = _step7.value;
                  // get the path of the bundle file
                  path = (0, _path.join)(compiler.outputPath, _c.name);
                  _errors2 = this.compilationErrors.get(path) || [];
                  this.compilationErrors.set(path, _errors2.concat([_err]));
                }

                _context8.next = 31;
                break;

              case 27:
                _context8.prev = 27;
                _context8.t0 = _context8["catch"](23);
                _didIteratorError7 = true;
                _iteratorError7 = _context8.t0;

              case 31:
                _context8.prev = 31;
                _context8.prev = 32;

                if (!_iteratorNormalCompletion7 && _iterator7.return != null) {
                  _iterator7.return();
                }

              case 34:
                _context8.prev = 34;

                if (!_didIteratorError7) {
                  _context8.next = 37;
                  break;
                }

                throw _iteratorError7;

              case 37:
                return _context8.finish(34);

              case 38:
                return _context8.finish(31);

              case 39:
                _iteratorNormalCompletion6 = true;
                _context8.next = 18;
                break;

              case 42:
                _context8.next = 48;
                break;

              case 44:
                _context8.prev = 44;
                _context8.t1 = _context8["catch"](16);
                _didIteratorError6 = true;
                _iteratorError6 = _context8.t1;

              case 48:
                _context8.prev = 48;
                _context8.prev = 49;

                if (!_iteratorNormalCompletion6 && _iterator6.return != null) {
                  _iterator6.return();
                }

              case 51:
                _context8.prev = 51;

                if (!_didIteratorError6) {
                  _context8.next = 54;
                  break;
                }

                throw _iteratorError6;

              case 54:
                return _context8.finish(51);

              case 55:
                return _context8.finish(48);

              case 56:
                _iteratorNormalCompletion5 = true;
                _context8.next = 11;
                break;

              case 59:
                _context8.next = 65;
                break;

              case 61:
                _context8.prev = 61;
                _context8.t2 = _context8["catch"](9);
                _didIteratorError5 = true;
                _iteratorError5 = _context8.t2;

              case 65:
                _context8.prev = 65;
                _context8.prev = 66;

                if (!_iteratorNormalCompletion5 && _iterator5.return != null) {
                  _iterator5.return();
                }

              case 68:
                _context8.prev = 68;

                if (!_didIteratorError5) {
                  _context8.next = 71;
                  break;
                }

                throw _iteratorError5;

              case 71:
                return _context8.finish(68);

              case 72:
                return _context8.finish(65);

              case 73:
                return _context8.abrupt("return", this.compilationErrors);

              case 74:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee7, this, [[9, 61, 65, 73], [16, 44, 48, 56], [23, 27, 31, 39], [32,, 34, 38], [49,, 51, 55], [66,, 68, 72]]);
      }));

      return function getCompilationErrors() {
        return _getCompilationErrors.apply(this, arguments);
      };
    }()
  }, {
    key: "send",
    value: function send(action) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      this.webpackHotMiddleware.publish({
        action: action,
        data: args
      });
    }
  }, {
    key: "ensurePage",
    value: function () {
      var _ensurePage = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee8(page) {
        return _regenerator.default.wrap(function _callee8$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                if (!(page === '/_error' || page === '/_document' || page === '/_app')) {
                  _context9.next = 2;
                  break;
                }

                return _context9.abrupt("return");

              case 2:
                _context9.next = 4;
                return this.onDemandEntries.ensurePage(page);

              case 4:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee8, this);
      }));

      return function ensurePage(_x5) {
        return _ensurePage.apply(this, arguments);
      };
    }()
  }]);
  return HotReloader;
}();

exports.default = HotReloader;

function deleteCache(path) {
  delete require.cache[path];
}

function diff(a, b) {
  return new _set.default((0, _toConsumableArray2.default)(a).filter(function (v) {
    return !b.has(v);
  }));
}

function toRoute(file) {
  var f = _path.sep === '\\' ? file.replace(/\\/g, '/') : file;
  return ('/' + f).replace(/(\/index)?\.js$/, '') || '/';
}