"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _from = _interopRequireDefault(require("@babel/runtime/core-js/array/from"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _keys = _interopRequireDefault(require("@babel/runtime/core-js/object/keys"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _promise = _interopRequireDefault(require("@babel/runtime/core-js/promise"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _path = require("path");

var _url = require("url");

var _querystring = require("querystring");

var _fs = _interopRequireDefault(require("fs"));

var _http = _interopRequireWildcard(require("http"));

var _promisify = _interopRequireDefault(require("../lib/promisify"));

var _render3 = require("./render");

var _router = _interopRequireDefault(require("./router"));

var _utils = require("./utils");

var _config = _interopRequireDefault(require("./config"));

var _constants = require("../lib/constants");

var asset = _interopRequireWildcard(require("../lib/asset"));

var envConfig = _interopRequireWildcard(require("../lib/runtime-config"));

var _utils2 = require("../lib/utils");

var _isAsyncSupported = _interopRequireDefault(require("./lib/is-async-supported"));

var _package = _interopRequireDefault(require("../../package"));

/* eslint-disable import/first, no-return-await */
// We need to go up one more level since we are in the `dist` directory
var access = (0, _promisify.default)(_fs.default.access);

var Server =
/*#__PURE__*/
function () {
  function Server() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$dir = _ref.dir,
        dir = _ref$dir === void 0 ? '.' : _ref$dir,
        _ref$dev = _ref.dev,
        dev = _ref$dev === void 0 ? false : _ref$dev,
        _ref$staticMarkup = _ref.staticMarkup,
        staticMarkup = _ref$staticMarkup === void 0 ? false : _ref$staticMarkup,
        _ref$quiet = _ref.quiet,
        quiet = _ref$quiet === void 0 ? false : _ref$quiet,
        _ref$conf = _ref.conf,
        conf = _ref$conf === void 0 ? null : _ref$conf;

    (0, _classCallCheck2.default)(this, Server);
    this.dir = (0, _path.resolve)(dir);
    this.dev = dev;
    this.quiet = quiet;
    this.router = new _router.default();
    this.http = null;
    var phase = dev ? _constants.PHASE_DEVELOPMENT_SERVER : _constants.PHASE_PRODUCTION_SERVER;
    this.nextConfig = (0, _config.default)(phase, this.dir, conf);
    this.distDir = (0, _path.join)(this.dir, this.nextConfig.distDir); // Only serverRuntimeConfig needs the default
    // publicRuntimeConfig gets it's default in client/index.js

    var _nextConfig = this.nextConfig,
        _nextConfig$serverRun = _nextConfig.serverRuntimeConfig,
        serverRuntimeConfig = _nextConfig$serverRun === void 0 ? {} : _nextConfig$serverRun,
        publicRuntimeConfig = _nextConfig.publicRuntimeConfig,
        assetPrefix = _nextConfig.assetPrefix,
        generateEtags = _nextConfig.generateEtags;

    if (!dev && !_fs.default.existsSync((0, _path.resolve)(this.distDir, _constants.BUILD_ID_FILE))) {
      console.error("> Could not find a valid build in the '".concat(this.distDir, "' directory! Try building your app with 'next build' before starting the server."));
      process.exit(1);
    }

    this.buildId = !dev ? this.readBuildId() : '-';
    this.hotReloader = dev ? this.getHotReloader(this.dir, {
      quiet: quiet,
      config: this.nextConfig,
      buildId: this.buildId
    }) : null;
    this.renderOpts = {
      dev: dev,
      staticMarkup: staticMarkup,
      distDir: this.distDir,
      hotReloader: this.hotReloader,
      buildId: this.buildId,
      availableChunks: dev ? {} : (0, _utils.getAvailableChunks)(this.distDir, dev),
      generateEtags: generateEtags // Only the `publicRuntimeConfig` key is exposed to the client side
      // It'll be rendered as part of __NEXT_DATA__ on the client side

    };

    if (publicRuntimeConfig) {
      this.renderOpts.runtimeConfig = publicRuntimeConfig;
    } // Initialize next/config with the environment configuration


    envConfig.setConfig({
      serverRuntimeConfig: serverRuntimeConfig,
      publicRuntimeConfig: publicRuntimeConfig
    });
    this.setAssetPrefix(assetPrefix);
  }

  (0, _createClass2.default)(Server, [{
    key: "getHotReloader",
    value: function getHotReloader(dir, options) {
      var HotReloader = require('./hot-reloader').default;

      return new HotReloader(dir, options);
    }
  }, {
    key: "handleRequest",
    value: function handleRequest(req, res, parsedUrl) {
      var _this = this;

      // Parse url if parsedUrl not provided
      if (!parsedUrl || (0, _typeof2.default)(parsedUrl) !== 'object') {
        parsedUrl = (0, _url.parse)(req.url, true);
      } // Parse the querystring ourselves if the user doesn't handle querystring parsing


      if (typeof parsedUrl.query === 'string') {
        parsedUrl.query = (0, _querystring.parse)(parsedUrl.query);
      }

      res.statusCode = 200;
      return this.run(req, res, parsedUrl).catch(function (err) {
        if (!_this.quiet) console.error(err);
        res.statusCode = 500;
        res.end(_http.STATUS_CODES[500]);
      });
    }
  }, {
    key: "getRequestHandler",
    value: function getRequestHandler() {
      return this.handleRequest.bind(this);
    }
  }, {
    key: "setAssetPrefix",
    value: function setAssetPrefix(prefix) {
      this.renderOpts.assetPrefix = prefix ? prefix.replace(/\/$/, '') : '';
      asset.setAssetPrefix(this.renderOpts.assetPrefix);
    }
  }, {
    key: "prepare",
    value: function () {
      var _prepare = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee() {
        var checkForUpdate, update;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(this.dev && process.stdout.isTTY && (0, _isAsyncSupported.default)())) {
                  _context.next = 12;
                  break;
                }

                _context.prev = 1;
                checkForUpdate = require('update-check');
                _context.next = 5;
                return checkForUpdate(_package.default, {
                  distTag: _package.default.version.includes('canary') ? 'canary' : 'latest'
                });

              case 5:
                update = _context.sent;

                if (update) {
                  // bgRed from chalk
                  console.log("\x1B[41mUPDATE AVAILABLE\x1B[49m The latest version of `next` is ".concat(update.latest));
                }

                _context.next = 12;
                break;

              case 9:
                _context.prev = 9;
                _context.t0 = _context["catch"](1);
                console.error('Error checking updates', _context.t0);

              case 12:
                _context.next = 14;
                return this.defineRoutes();

              case 14:
                if (!this.hotReloader) {
                  _context.next = 17;
                  break;
                }

                _context.next = 17;
                return this.hotReloader.start();

              case 17:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[1, 9]]);
      }));

      return function prepare() {
        return _prepare.apply(this, arguments);
      };
    }()
  }, {
    key: "close",
    value: function () {
      var _close = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee2() {
        var _this2 = this;

        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!this.hotReloader) {
                  _context2.next = 3;
                  break;
                }

                _context2.next = 3;
                return this.hotReloader.stop();

              case 3:
                if (!this.http) {
                  _context2.next = 6;
                  break;
                }

                _context2.next = 6;
                return new _promise.default(function (resolve, reject) {
                  _this2.http.close(function (err) {
                    if (err) return reject(err);
                    return resolve();
                  });
                });

              case 6:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      return function close() {
        return _close.apply(this, arguments);
      };
    }()
  }, {
    key: "defineRoutes",
    value: function () {
      var _defineRoutes = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee12() {
        var _this3 = this;

        var routes, exportPathMap, _loop, path, _arr, _i, method, _arr2, _i2, p;

        return _regenerator.default.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                routes = {
                  // This is to support, webpack dynamic imports in production.
                  '/_next/webpack/chunks/:name': function () {
                    var _nextWebpackChunksName2 = (0, _asyncToGenerator2.default)(
                    /*#__PURE__*/
                    _regenerator.default.mark(function _callee3(req, res, params) {
                      var p;
                      return _regenerator.default.wrap(function _callee3$(_context3) {
                        while (1) {
                          switch (_context3.prev = _context3.next) {
                            case 0:
                              // Cache aggressively in production
                              if (!_this3.dev) {
                                res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
                              }

                              p = (0, _path.join)(_this3.distDir, 'chunks', params.name);
                              _context3.next = 4;
                              return _this3.serveStatic(req, res, p);

                            case 4:
                            case "end":
                              return _context3.stop();
                          }
                        }
                      }, _callee3, this);
                    }));

                    return function _nextWebpackChunksName(_x, _x2, _x3) {
                      return _nextWebpackChunksName2.apply(this, arguments);
                    };
                  }(),
                  // This is to support, webpack dynamic import support with HMR
                  '/_next/webpack/:id': function () {
                    var _nextWebpackId2 = (0, _asyncToGenerator2.default)(
                    /*#__PURE__*/
                    _regenerator.default.mark(function _callee4(req, res, params) {
                      var p;
                      return _regenerator.default.wrap(function _callee4$(_context4) {
                        while (1) {
                          switch (_context4.prev = _context4.next) {
                            case 0:
                              p = (0, _path.join)(_this3.distDir, 'chunks', params.id);
                              _context4.next = 3;
                              return _this3.serveStatic(req, res, p);

                            case 3:
                            case "end":
                              return _context4.stop();
                          }
                        }
                      }, _callee4, this);
                    }));

                    return function _nextWebpackId(_x4, _x5, _x6) {
                      return _nextWebpackId2.apply(this, arguments);
                    };
                  }(),
                  '/_next/:buildId/page/:path*.js.map': function () {
                    var _nextBuildIdPagePathJsMap2 = (0, _asyncToGenerator2.default)(
                    /*#__PURE__*/
                    _regenerator.default.mark(function _callee5(req, res, params) {
                      var paths, page, path;
                      return _regenerator.default.wrap(function _callee5$(_context5) {
                        while (1) {
                          switch (_context5.prev = _context5.next) {
                            case 0:
                              paths = params.path || [''];
                              page = "/".concat(paths.join('/'));

                              if (!_this3.dev) {
                                _context5.next = 12;
                                break;
                              }

                              _context5.prev = 3;
                              _context5.next = 6;
                              return _this3.hotReloader.ensurePage(page);

                            case 6:
                              _context5.next = 12;
                              break;

                            case 8:
                              _context5.prev = 8;
                              _context5.t0 = _context5["catch"](3);
                              _context5.next = 12;
                              return _this3.render404(req, res);

                            case 12:
                              path = (0, _path.join)(_this3.distDir, 'bundles', 'pages', "".concat(page, ".js.map"));
                              _context5.next = 15;
                              return (0, _render3.serveStatic)(req, res, path);

                            case 15:
                            case "end":
                              return _context5.stop();
                          }
                        }
                      }, _callee5, this, [[3, 8]]);
                    }));

                    return function _nextBuildIdPagePathJsMap(_x7, _x8, _x9) {
                      return _nextBuildIdPagePathJsMap2.apply(this, arguments);
                    };
                  }(),
                  '/_next/:buildId/page/:path*.js': function () {
                    var _nextBuildIdPagePathJs2 = (0, _asyncToGenerator2.default)(
                    /*#__PURE__*/
                    _regenerator.default.mark(function _callee6(req, res, params) {
                      var paths, page, error, compilationErr, p;
                      return _regenerator.default.wrap(function _callee6$(_context6) {
                        while (1) {
                          switch (_context6.prev = _context6.next) {
                            case 0:
                              paths = params.path || [''];
                              page = "/".concat(paths.join('/'));

                              if (_this3.handleBuildId(params.buildId, res)) {
                                _context6.next = 7;
                                break;
                              }

                              error = new Error('INVALID_BUILD_ID');
                              _context6.next = 6;
                              return (0, _render3.renderScriptError)(req, res, page, error);

                            case 6:
                              return _context6.abrupt("return", _context6.sent);

                            case 7:
                              if (!(_this3.dev && page !== '/_error' && page !== '/_app')) {
                                _context6.next = 25;
                                break;
                              }

                              _context6.prev = 8;
                              _context6.next = 11;
                              return _this3.hotReloader.ensurePage(page);

                            case 11:
                              _context6.next = 18;
                              break;

                            case 13:
                              _context6.prev = 13;
                              _context6.t0 = _context6["catch"](8);
                              _context6.next = 17;
                              return (0, _render3.renderScriptError)(req, res, page, _context6.t0);

                            case 17:
                              return _context6.abrupt("return", _context6.sent);

                            case 18:
                              _context6.next = 20;
                              return _this3.getCompilationError();

                            case 20:
                              compilationErr = _context6.sent;

                              if (!compilationErr) {
                                _context6.next = 25;
                                break;
                              }

                              _context6.next = 24;
                              return (0, _render3.renderScriptError)(req, res, page, compilationErr);

                            case 24:
                              return _context6.abrupt("return", _context6.sent);

                            case 25:
                              p = (0, _path.join)(_this3.distDir, 'bundles', 'pages', "".concat(page, ".js")); // [production] If the page is not exists, we need to send a proper Next.js style 404
                              // Otherwise, it'll affect the multi-zones feature.

                              _context6.prev = 26;
                              _context6.next = 29;
                              return access(p, (_fs.default.constants || _fs.default).R_OK);

                            case 29:
                              _context6.next = 36;
                              break;

                            case 31:
                              _context6.prev = 31;
                              _context6.t1 = _context6["catch"](26);
                              _context6.next = 35;
                              return (0, _render3.renderScriptError)(req, res, page, {
                                code: 'ENOENT'
                              });

                            case 35:
                              return _context6.abrupt("return", _context6.sent);

                            case 36:
                              _context6.next = 38;
                              return _this3.serveStatic(req, res, p);

                            case 38:
                            case "end":
                              return _context6.stop();
                          }
                        }
                      }, _callee6, this, [[8, 13], [26, 31]]);
                    }));

                    return function _nextBuildIdPagePathJs(_x10, _x11, _x12) {
                      return _nextBuildIdPagePathJs2.apply(this, arguments);
                    };
                  }(),
                  '/_next/static/:path*': function () {
                    var _nextStaticPath2 = (0, _asyncToGenerator2.default)(
                    /*#__PURE__*/
                    _regenerator.default.mark(function _callee7(req, res, params) {
                      var p;
                      return _regenerator.default.wrap(function _callee7$(_context7) {
                        while (1) {
                          switch (_context7.prev = _context7.next) {
                            case 0:
                              // The commons folder holds commonschunk files
                              // In development they don't have a hash, and shouldn't be cached by the browser.
                              if (params.path[0] === 'commons') {
                                if (_this3.dev) {
                                  res.setHeader('Cache-Control', 'no-store, must-revalidate');
                                } else {
                                  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
                                }
                              }

                              p = _path.join.apply(void 0, [_this3.distDir, 'static'].concat((0, _toConsumableArray2.default)(params.path || [])));
                              _context7.next = 4;
                              return _this3.serveStatic(req, res, p);

                            case 4:
                            case "end":
                              return _context7.stop();
                          }
                        }
                      }, _callee7, this);
                    }));

                    return function _nextStaticPath(_x13, _x14, _x15) {
                      return _nextStaticPath2.apply(this, arguments);
                    };
                  }(),
                  // It's very important keep this route's param optional.
                  // (but it should support as many as params, seperated by '/')
                  // Othewise this will lead to a pretty simple DOS attack.
                  // See more: https://github.com/zeit/next.js/issues/2617
                  '/_next/:path*': function () {
                    var _nextPath2 = (0, _asyncToGenerator2.default)(
                    /*#__PURE__*/
                    _regenerator.default.mark(function _callee8(req, res, params) {
                      var p;
                      return _regenerator.default.wrap(function _callee8$(_context8) {
                        while (1) {
                          switch (_context8.prev = _context8.next) {
                            case 0:
                              p = _path.join.apply(void 0, [__dirname, '..', 'client'].concat((0, _toConsumableArray2.default)(params.path || [])));
                              _context8.next = 3;
                              return _this3.serveStatic(req, res, p);

                            case 3:
                            case "end":
                              return _context8.stop();
                          }
                        }
                      }, _callee8, this);
                    }));

                    return function _nextPath(_x16, _x17, _x18) {
                      return _nextPath2.apply(this, arguments);
                    };
                  }(),
                  // It's very important keep this route's param optional.
                  // (but it should support as many as params, seperated by '/')
                  // Othewise this will lead to a pretty simple DOS attack.
                  // See more: https://github.com/zeit/next.js/issues/2617
                  '/static/:path*': function () {
                    var _staticPath = (0, _asyncToGenerator2.default)(
                    /*#__PURE__*/
                    _regenerator.default.mark(function _callee9(req, res, params) {
                      var p;
                      return _regenerator.default.wrap(function _callee9$(_context9) {
                        while (1) {
                          switch (_context9.prev = _context9.next) {
                            case 0:
                              p = _path.join.apply(void 0, [_this3.dir, 'static'].concat((0, _toConsumableArray2.default)(params.path || [])));
                              _context9.next = 3;
                              return _this3.serveStatic(req, res, p);

                            case 3:
                            case "end":
                              return _context9.stop();
                          }
                        }
                      }, _callee9, this);
                    }));

                    return function staticPath(_x19, _x20, _x21) {
                      return _staticPath.apply(this, arguments);
                    };
                  }()
                };

                if (!this.nextConfig.useFileSystemPublicRoutes) {
                  _context12.next = 10;
                  break;
                }

                if (!(this.dev && this.nextConfig.exportPathMap)) {
                  _context12.next = 9;
                  break;
                }

                console.log('Defining routes from exportPathMap');
                _context12.next = 6;
                return this.nextConfig.exportPathMap({});

              case 6:
                exportPathMap = _context12.sent;

                _loop = function _loop(path) {
                  var _exportPathMap$path = exportPathMap[path],
                      page = _exportPathMap$path.page,
                      _exportPathMap$path$q = _exportPathMap$path.query,
                      query = _exportPathMap$path$q === void 0 ? {} : _exportPathMap$path$q;

                  routes[path] =
                  /*#__PURE__*/
                  function () {
                    var _ref2 = (0, _asyncToGenerator2.default)(
                    /*#__PURE__*/
                    _regenerator.default.mark(function _callee10(req, res, params, parsedUrl) {
                      var urlQuery, mergedQuery;
                      return _regenerator.default.wrap(function _callee10$(_context10) {
                        while (1) {
                          switch (_context10.prev = _context10.next) {
                            case 0:
                              urlQuery = parsedUrl.query;
                              (0, _keys.default)(urlQuery).filter(function (key) {
                                return query[key] === undefined;
                              }).forEach(function (key) {
                                return console.warn("Url defines a query parameter '".concat(key, "' that is missing in exportPathMap"));
                              });
                              mergedQuery = (0, _objectSpread2.default)({}, urlQuery, query);
                              _context10.next = 5;
                              return _this3.render(req, res, page, mergedQuery, parsedUrl);

                            case 5:
                            case "end":
                              return _context10.stop();
                          }
                        }
                      }, _callee10, this);
                    }));

                    return function (_x22, _x23, _x24, _x25) {
                      return _ref2.apply(this, arguments);
                    };
                  }();
                };

                // In development we can't give a default path mapping
                for (path in exportPathMap) {
                  _loop(path);
                }

              case 9:
                routes['/:path*'] =
                /*#__PURE__*/
                function () {
                  var _ref3 = (0, _asyncToGenerator2.default)(
                  /*#__PURE__*/
                  _regenerator.default.mark(function _callee11(req, res, params, parsedUrl) {
                    var pathname, query;
                    return _regenerator.default.wrap(function _callee11$(_context11) {
                      while (1) {
                        switch (_context11.prev = _context11.next) {
                          case 0:
                            pathname = parsedUrl.pathname, query = parsedUrl.query;
                            _context11.next = 3;
                            return _this3.render(req, res, pathname, query, parsedUrl);

                          case 3:
                          case "end":
                            return _context11.stop();
                        }
                      }
                    }, _callee11, this);
                  }));

                  return function (_x26, _x27, _x28, _x29) {
                    return _ref3.apply(this, arguments);
                  };
                }();

              case 10:
                _arr = ['GET', 'HEAD'];

                for (_i = 0; _i < _arr.length; _i++) {
                  method = _arr[_i];
                  _arr2 = (0, _keys.default)(routes);

                  for (_i2 = 0; _i2 < _arr2.length; _i2++) {
                    p = _arr2[_i2];
                    this.router.add(method, p, routes[p]);
                  }
                }

              case 12:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee12, this);
      }));

      return function defineRoutes() {
        return _defineRoutes.apply(this, arguments);
      };
    }()
  }, {
    key: "start",
    value: function () {
      var _start = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee13(port, hostname) {
        var _this4 = this;

        return _regenerator.default.wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                _context13.next = 2;
                return this.prepare();

              case 2:
                this.http = _http.default.createServer(this.getRequestHandler());
                _context13.next = 5;
                return new _promise.default(function (resolve, reject) {
                  // This code catches EADDRINUSE error if the port is already in use
                  _this4.http.on('error', reject);

                  _this4.http.on('listening', function () {
                    return resolve();
                  });

                  _this4.http.listen(port, hostname);
                });

              case 5:
              case "end":
                return _context13.stop();
            }
          }
        }, _callee13, this);
      }));

      return function start(_x30, _x31) {
        return _start.apply(this, arguments);
      };
    }()
  }, {
    key: "run",
    value: function () {
      var _run = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee14(req, res, parsedUrl) {
        var fn;
        return _regenerator.default.wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                if (!this.hotReloader) {
                  _context14.next = 3;
                  break;
                }

                _context14.next = 3;
                return this.hotReloader.run(req, res);

              case 3:
                fn = this.router.match(req, res, parsedUrl);

                if (!fn) {
                  _context14.next = 8;
                  break;
                }

                _context14.next = 7;
                return fn();

              case 7:
                return _context14.abrupt("return");

              case 8:
                if (!(req.method === 'GET' || req.method === 'HEAD')) {
                  _context14.next = 13;
                  break;
                }

                _context14.next = 11;
                return this.render404(req, res, parsedUrl);

              case 11:
                _context14.next = 15;
                break;

              case 13:
                res.statusCode = 501;
                res.end(_http.STATUS_CODES[501]);

              case 15:
              case "end":
                return _context14.stop();
            }
          }
        }, _callee14, this);
      }));

      return function run(_x32, _x33, _x34) {
        return _run.apply(this, arguments);
      };
    }()
  }, {
    key: "render",
    value: function () {
      var _render = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee15(req, res, pathname, query, parsedUrl) {
        var html;
        return _regenerator.default.wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                if (!(0, _utils.isInternalUrl)(req.url)) {
                  _context15.next = 2;
                  break;
                }

                return _context15.abrupt("return", this.handleRequest(req, res, parsedUrl));

              case 2:
                if (!(_constants.BLOCKED_PAGES.indexOf(pathname) !== -1)) {
                  _context15.next = 6;
                  break;
                }

                _context15.next = 5;
                return this.render404(req, res, parsedUrl);

              case 5:
                return _context15.abrupt("return", _context15.sent);

              case 6:
                _context15.next = 8;
                return this.renderToHTML(req, res, pathname, query);

              case 8:
                html = _context15.sent;

                if (!(0, _utils2.isResSent)(res)) {
                  _context15.next = 11;
                  break;
                }

                return _context15.abrupt("return");

              case 11:
                if (this.nextConfig.poweredByHeader) {
                  res.setHeader('X-Powered-By', "Next.js ".concat(_package.default.version));
                }

                return _context15.abrupt("return", (0, _render3.sendHTML)(req, res, html, req.method, this.renderOpts));

              case 13:
              case "end":
                return _context15.stop();
            }
          }
        }, _callee15, this);
      }));

      return function render(_x35, _x36, _x37, _x38, _x39) {
        return _render.apply(this, arguments);
      };
    }()
  }, {
    key: "renderToHTML",
    value: function () {
      var _renderToHTML2 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee16(req, res, pathname, query) {
        var compilationErr, out, _require, applySourcemaps;

        return _regenerator.default.wrap(function _callee16$(_context16) {
          while (1) {
            switch (_context16.prev = _context16.next) {
              case 0:
                if (!this.dev) {
                  _context16.next = 7;
                  break;
                }

                _context16.next = 3;
                return this.getCompilationError();

              case 3:
                compilationErr = _context16.sent;

                if (!compilationErr) {
                  _context16.next = 7;
                  break;
                }

                res.statusCode = 500;
                return _context16.abrupt("return", this.renderErrorToHTML(compilationErr, req, res, pathname, query));

              case 7:
                _context16.prev = 7;
                _context16.next = 10;
                return (0, _render3.renderToHTML)(req, res, pathname, query, this.renderOpts);

              case 10:
                out = _context16.sent;
                return _context16.abrupt("return", out);

              case 14:
                _context16.prev = 14;
                _context16.t0 = _context16["catch"](7);

                if (!(_context16.t0.code === 'ENOENT')) {
                  _context16.next = 21;
                  break;
                }

                res.statusCode = 404;
                return _context16.abrupt("return", this.renderErrorToHTML(null, req, res, pathname, query));

              case 21:
                _require = require('./lib/source-map-support'), applySourcemaps = _require.applySourcemaps;
                _context16.next = 24;
                return applySourcemaps(_context16.t0);

              case 24:
                if (!this.quiet) console.error(_context16.t0);
                res.statusCode = 500;
                return _context16.abrupt("return", this.renderErrorToHTML(_context16.t0, req, res, pathname, query));

              case 27:
              case "end":
                return _context16.stop();
            }
          }
        }, _callee16, this, [[7, 14]]);
      }));

      return function renderToHTML(_x40, _x41, _x42, _x43) {
        return _renderToHTML2.apply(this, arguments);
      };
    }()
  }, {
    key: "renderError",
    value: function () {
      var _renderError = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee17(err, req, res, pathname, query) {
        var html;
        return _regenerator.default.wrap(function _callee17$(_context17) {
          while (1) {
            switch (_context17.prev = _context17.next) {
              case 0:
                _context17.next = 2;
                return this.renderErrorToHTML(err, req, res, pathname, query);

              case 2:
                html = _context17.sent;
                return _context17.abrupt("return", (0, _render3.sendHTML)(req, res, html, req.method, this.renderOpts));

              case 4:
              case "end":
                return _context17.stop();
            }
          }
        }, _callee17, this);
      }));

      return function renderError(_x44, _x45, _x46, _x47, _x48) {
        return _renderError.apply(this, arguments);
      };
    }()
  }, {
    key: "renderErrorToHTML",
    value: function () {
      var _renderErrorToHTML2 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee18(err, req, res, pathname, query) {
        var compilationErr;
        return _regenerator.default.wrap(function _callee18$(_context18) {
          while (1) {
            switch (_context18.prev = _context18.next) {
              case 0:
                if (!this.dev) {
                  _context18.next = 7;
                  break;
                }

                _context18.next = 3;
                return this.getCompilationError();

              case 3:
                compilationErr = _context18.sent;

                if (!compilationErr) {
                  _context18.next = 7;
                  break;
                }

                res.statusCode = 500;
                return _context18.abrupt("return", (0, _render3.renderErrorToHTML)(compilationErr, req, res, pathname, query, this.renderOpts));

              case 7:
                _context18.prev = 7;
                _context18.next = 10;
                return (0, _render3.renderErrorToHTML)(err, req, res, pathname, query, this.renderOpts);

              case 10:
                return _context18.abrupt("return", _context18.sent);

              case 13:
                _context18.prev = 13;
                _context18.t0 = _context18["catch"](7);

                if (!this.dev) {
                  _context18.next = 21;
                  break;
                }

                if (!this.quiet) console.error(_context18.t0);
                res.statusCode = 500;
                return _context18.abrupt("return", (0, _render3.renderErrorToHTML)(_context18.t0, req, res, pathname, query, this.renderOpts));

              case 21:
                throw _context18.t0;

              case 22:
              case "end":
                return _context18.stop();
            }
          }
        }, _callee18, this, [[7, 13]]);
      }));

      return function renderErrorToHTML(_x49, _x50, _x51, _x52, _x53) {
        return _renderErrorToHTML2.apply(this, arguments);
      };
    }()
  }, {
    key: "render404",
    value: function () {
      var _render2 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee19(req, res) {
        var parsedUrl,
            pathname,
            query,
            _args19 = arguments;
        return _regenerator.default.wrap(function _callee19$(_context19) {
          while (1) {
            switch (_context19.prev = _context19.next) {
              case 0:
                parsedUrl = _args19.length > 2 && _args19[2] !== undefined ? _args19[2] : (0, _url.parse)(req.url, true);
                pathname = parsedUrl.pathname, query = parsedUrl.query;
                res.statusCode = 404;
                return _context19.abrupt("return", this.renderError(null, req, res, pathname, query));

              case 4:
              case "end":
                return _context19.stop();
            }
          }
        }, _callee19, this);
      }));

      return function render404(_x54, _x55) {
        return _render2.apply(this, arguments);
      };
    }()
  }, {
    key: "serveStatic",
    value: function () {
      var _serveStatic2 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee20(req, res, path) {
        return _regenerator.default.wrap(function _callee20$(_context20) {
          while (1) {
            switch (_context20.prev = _context20.next) {
              case 0:
                if (this.isServeableUrl(path)) {
                  _context20.next = 2;
                  break;
                }

                return _context20.abrupt("return", this.render404(req, res));

              case 2:
                _context20.prev = 2;
                _context20.next = 5;
                return (0, _render3.serveStatic)(req, res, path);

              case 5:
                return _context20.abrupt("return", _context20.sent);

              case 8:
                _context20.prev = 8;
                _context20.t0 = _context20["catch"](2);

                if (!(_context20.t0.code === 'ENOENT')) {
                  _context20.next = 14;
                  break;
                }

                this.render404(req, res);
                _context20.next = 15;
                break;

              case 14:
                throw _context20.t0;

              case 15:
              case "end":
                return _context20.stop();
            }
          }
        }, _callee20, this, [[2, 8]]);
      }));

      return function serveStatic(_x56, _x57, _x58) {
        return _serveStatic2.apply(this, arguments);
      };
    }()
  }, {
    key: "isServeableUrl",
    value: function isServeableUrl(path) {
      var resolved = (0, _path.resolve)(path);

      if (resolved.indexOf((0, _path.join)(this.distDir) + _path.sep) !== 0 && resolved.indexOf((0, _path.join)(this.dir, 'static') + _path.sep) !== 0) {
        // Seems like the user is trying to traverse the filesystem.
        return false;
      }

      return true;
    }
  }, {
    key: "readBuildId",
    value: function readBuildId() {
      var buildIdPath = (0, _path.join)(this.distDir, _constants.BUILD_ID_FILE);

      var buildId = _fs.default.readFileSync(buildIdPath, 'utf8');

      return buildId.trim();
    }
  }, {
    key: "handleBuildId",
    value: function handleBuildId(buildId, res) {
      if (this.dev) {
        res.setHeader('Cache-Control', 'no-store, must-revalidate');
        return true;
      }

      if (buildId !== this.renderOpts.buildId) {
        return false;
      }

      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      return true;
    }
  }, {
    key: "getCompilationError",
    value: function () {
      var _getCompilationError = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee21() {
        var errors;
        return _regenerator.default.wrap(function _callee21$(_context21) {
          while (1) {
            switch (_context21.prev = _context21.next) {
              case 0:
                if (this.hotReloader) {
                  _context21.next = 2;
                  break;
                }

                return _context21.abrupt("return");

              case 2:
                _context21.next = 4;
                return this.hotReloader.getCompilationErrors();

              case 4:
                errors = _context21.sent;

                if (errors.size) {
                  _context21.next = 7;
                  break;
                }

                return _context21.abrupt("return");

              case 7:
                return _context21.abrupt("return", (0, _from.default)(errors.values())[0][0]);

              case 8:
              case "end":
                return _context21.stop();
            }
          }
        }, _callee21, this);
      }));

      return function getCompilationError() {
        return _getCompilationError.apply(this, arguments);
      };
    }()
  }, {
    key: "send404",
    value: function send404(res) {
      res.statusCode = 404;
      res.end('404 - Not Found');
    }
  }]);
  return Server;
}();

exports.default = Server;