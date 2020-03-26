"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.render = render;
exports.renderToHTML = renderToHTML;
exports.renderError = renderError;
exports.renderErrorToHTML = renderErrorToHTML;
exports.renderScriptError = renderScriptError;
exports.sendHTML = sendHTML;
exports.sendJSON = sendJSON;
exports.serveStatic = serveStatic;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _getIterator2 = _interopRequireDefault(require("@babel/runtime/core-js/get-iterator"));

var _promise = _interopRequireDefault(require("@babel/runtime/core-js/promise"));

var _stringify = _interopRequireDefault(require("@babel/runtime/core-js/json/stringify"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _path = require("path");

var _react = require("react");

var _server = require("react-dom/server");

var _send = _interopRequireDefault(require("send"));

var _etag = _interopRequireDefault(require("etag"));

var _fresh = _interopRequireDefault(require("fresh"));

var _require = _interopRequireDefault(require("./require"));

var _router = require("../lib/router");

var _utils = require("../lib/utils");

var _utils2 = require("./utils");

var _head = _interopRequireWildcard(require("../lib/head"));

var _errorDebug = _interopRequireDefault(require("../lib/error-debug"));

var _dynamic = require("../lib/dynamic");

var _constants = require("../lib/constants");

var _sourceMapSupport = require("./lib/source-map-support");

var logger = console;

function render(_x, _x2, _x3, _x4, _x5) {
  return _render.apply(this, arguments);
}

function _render() {
  _render = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee(req, res, pathname, query, opts) {
    var html;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return renderToHTML(req, res, pathname, query, opts);

          case 2:
            html = _context.sent;
            sendHTML(req, res, html, req.method, opts);

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return _render.apply(this, arguments);
}

function renderToHTML(req, res, pathname, query, opts) {
  return doRender(req, res, pathname, query, opts);
}

function renderError(_x6, _x7, _x8, _x9, _x10, _x11) {
  return _renderError.apply(this, arguments);
}

function _renderError() {
  _renderError = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee2(err, req, res, pathname, query, opts) {
    var html;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return renderErrorToHTML(err, req, res, query, opts);

          case 2:
            html = _context2.sent;
            sendHTML(req, res, html, req.method, opts);

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
  return _renderError.apply(this, arguments);
}

function renderErrorToHTML(err, req, res, pathname, query) {
  var opts = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
  return doRender(req, res, pathname, query, (0, _objectSpread2.default)({}, opts, {
    err: err,
    page: '/_error'
  }));
}

function doRender(_x12, _x13, _x14, _x15) {
  return _doRender.apply(this, arguments);
}

function _doRender() {
  _doRender = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee3(req, res, pathname, query) {
    var _ref4,
        err,
        page,
        buildId,
        hotReloader,
        assetPrefix,
        runtimeConfig,
        availableChunks,
        distDir,
        dir,
        _ref4$dev,
        dev,
        _ref4$staticMarkup,
        staticMarkup,
        _ref4$nextExport,
        nextExport,
        documentPath,
        appPath,
        buildManifest,
        _ref5,
        _ref6,
        Component,
        Document,
        App,
        asPath,
        ctx,
        router,
        props,
        renderPage,
        docProps,
        doc,
        _args3 = arguments;

    return _regenerator.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _ref4 = _args3.length > 4 && _args3[4] !== undefined ? _args3[4] : {}, err = _ref4.err, page = _ref4.page, buildId = _ref4.buildId, hotReloader = _ref4.hotReloader, assetPrefix = _ref4.assetPrefix, runtimeConfig = _ref4.runtimeConfig, availableChunks = _ref4.availableChunks, distDir = _ref4.distDir, dir = _ref4.dir, _ref4$dev = _ref4.dev, dev = _ref4$dev === void 0 ? false : _ref4$dev, _ref4$staticMarkup = _ref4.staticMarkup, staticMarkup = _ref4$staticMarkup === void 0 ? false : _ref4$staticMarkup, _ref4$nextExport = _ref4.nextExport, nextExport = _ref4$nextExport === void 0 ? false : _ref4$nextExport;
            page = page || pathname;
            _context3.next = 4;
            return (0, _sourceMapSupport.applySourcemaps)(err);

          case 4:
            if (!hotReloader) {
              _context3.next = 7;
              break;
            }

            _context3.next = 7;
            return ensurePage(page, {
              dir: dir,
              hotReloader: hotReloader
            });

          case 7:
            documentPath = (0, _path.join)(distDir, _constants.SERVER_DIRECTORY, 'bundles', 'pages', '_document');
            appPath = (0, _path.join)(distDir, _constants.SERVER_DIRECTORY, 'bundles', 'pages', '_app');
            buildManifest = require((0, _path.join)(distDir, _constants.BUILD_MANIFEST));
            _context3.next = 12;
            return _promise.default.all([(0, _require.default)(page, {
              distDir: distDir
            }), require(documentPath), require(appPath)]);

          case 12:
            _ref5 = _context3.sent;
            _ref6 = (0, _slicedToArray2.default)(_ref5, 3);
            Component = _ref6[0];
            Document = _ref6[1];
            App = _ref6[2];
            Component = Component.default || Component;

            if (!(typeof Component !== 'function')) {
              _context3.next = 20;
              break;
            }

            throw new Error("The default export is not a React Component in page: \"".concat(pathname, "\""));

          case 20:
            App = App.default || App;
            Document = Document.default || Document;
            asPath = req.url;
            ctx = {
              err: err,
              req: req,
              res: res,
              pathname: pathname,
              query: query,
              asPath: asPath
            };
            router = new _router.Router(pathname, query, asPath);
            _context3.next = 27;
            return (0, _utils.loadGetInitialProps)(App, {
              Component: Component,
              router: router,
              ctx: ctx
            });

          case 27:
            props = _context3.sent;

            if (!(0, _utils.isResSent)(res)) {
              _context3.next = 30;
              break;
            }

            return _context3.abrupt("return");

          case 30:
            renderPage = function renderPage() {
              var enhancer = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (Page) {
                return Page;
              };
              var app = (0, _react.createElement)(App, (0, _objectSpread2.default)({
                Component: enhancer(Component),
                router: router
              }, props));
              var render = staticMarkup ? _server.renderToStaticMarkup : _server.renderToString;
              var html;
              var head;
              var errorHtml = '';

              try {
                if (err && dev) {
                  errorHtml = render((0, _react.createElement)(_errorDebug.default, {
                    error: err
                  }));
                } else if (err) {
                  html = render(app);
                } else {
                  html = render(app);
                }
              } finally {
                head = _head.default.rewind() || (0, _head.defaultHead)();
              }

              var chunks = loadChunks({
                dev: dev,
                distDir: distDir,
                availableChunks: availableChunks
              });
              return {
                html: html,
                head: head,
                errorHtml: errorHtml,
                chunks: chunks,
                buildManifest: buildManifest
              };
            };

            _context3.next = 33;
            return (0, _utils.loadGetInitialProps)(Document, (0, _objectSpread2.default)({}, ctx, {
              renderPage: renderPage
            }));

          case 33:
            docProps = _context3.sent;

            if (!(0, _utils.isResSent)(res)) {
              _context3.next = 36;
              break;
            }

            return _context3.abrupt("return");

          case 36:
            if (!(!Document.prototype || !Document.prototype.isReactComponent)) {
              _context3.next = 38;
              break;
            }

            throw new Error('_document.js is not exporting a React component');

          case 38:
            doc = (0, _react.createElement)(Document, (0, _objectSpread2.default)({
              __NEXT_DATA__: {
                props: props,
                page: page,
                // the rendered page
                pathname: pathname,
                // the requested path
                query: query,
                buildId: buildId,
                assetPrefix: assetPrefix,
                runtimeConfig: runtimeConfig,
                nextExport: nextExport,
                err: err ? serializeError(dev, err) : null
              },
              dev: dev,
              dir: dir,
              staticMarkup: staticMarkup,
              buildManifest: buildManifest
            }, docProps));
            return _context3.abrupt("return", '<!DOCTYPE html>' + (0, _server.renderToStaticMarkup)(doc));

          case 40:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));
  return _doRender.apply(this, arguments);
}

function renderScriptError(_x16, _x17, _x18, _x19) {
  return _renderScriptError.apply(this, arguments);
}

function _renderScriptError() {
  _renderScriptError = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee4(req, res, page, error) {
    return _regenerator.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            // Asks CDNs and others to not to cache the errored page
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

            if (!(error.code === 'ENOENT' || error.message === 'INVALID_BUILD_ID')) {
              _context4.next = 5;
              break;
            }

            res.statusCode = 404;
            res.end('404 - Not Found');
            return _context4.abrupt("return");

          case 5:
            logger.error(error.stack);
            res.statusCode = 500;
            res.end('500 - Internal Error');

          case 8:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));
  return _renderScriptError.apply(this, arguments);
}

function sendHTML(req, res, html, method, _ref) {
  var dev = _ref.dev,
      generateEtags = _ref.generateEtags;
  if ((0, _utils.isResSent)(res)) return;
  var etag = generateEtags && (0, _etag.default)(html);

  if ((0, _fresh.default)(req.headers, {
    etag: etag
  })) {
    res.statusCode = 304;
    res.end();
    return;
  }

  if (dev) {
    // In dev, we should not cache pages for any reason.
    // That's why we do this.
    res.setHeader('Cache-Control', 'no-store, must-revalidate');
  }

  if (etag) {
    res.setHeader('ETag', etag);
  }

  if (!res.getHeader('Content-Type')) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
  }

  res.setHeader('Content-Length', Buffer.byteLength(html));
  res.end(method === 'HEAD' ? null : html);
}

function sendJSON(res, obj, method) {
  if ((0, _utils.isResSent)(res)) return;
  var json = (0, _stringify.default)(obj);
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Length', Buffer.byteLength(json));
  res.end(method === 'HEAD' ? null : json);
}

function errorToJSON(err) {
  var name = err.name,
      message = err.message,
      stack = err.stack;
  var json = {
    name: name,
    message: message,
    stack: stack
  };

  if (err.module) {
    // rawRequest contains the filename of the module which has the error.
    var rawRequest = err.module.rawRequest;
    json.module = {
      rawRequest: rawRequest
    };
  }

  return json;
}

function serializeError(dev, err) {
  if (dev) {
    return errorToJSON(err);
  }

  return {
    message: '500 - Internal Server Error.'
  };
}

function serveStatic(req, res, path) {
  return new _promise.default(function (resolve, reject) {
    (0, _send.default)(req, path).on('directory', function () {
      // We don't allow directories to be read.
      var err = new Error('No directory access');
      err.code = 'ENOENT';
      reject(err);
    }).on('error', reject).pipe(res).on('finish', resolve);
  });
}

function ensurePage(_x20, _x21) {
  return _ensurePage.apply(this, arguments);
}

function _ensurePage() {
  _ensurePage = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee5(page, _ref2) {
    var dir, hotReloader;
    return _regenerator.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            dir = _ref2.dir, hotReloader = _ref2.hotReloader;

            if (!(page === '/_error')) {
              _context5.next = 3;
              break;
            }

            return _context5.abrupt("return");

          case 3:
            _context5.next = 5;
            return hotReloader.ensurePage(page);

          case 5:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));
  return _ensurePage.apply(this, arguments);
}

function loadChunks(_ref3) {
  var dev = _ref3.dev,
      distDir = _ref3.distDir,
      availableChunks = _ref3.availableChunks;
  var flushedChunks = (0, _dynamic.flushChunks)();
  var response = {
    names: [],
    filenames: []
  };

  if (dev) {
    availableChunks = (0, _utils2.getAvailableChunks)(distDir, dev);
  }

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = (0, _getIterator2.default)(flushedChunks), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var chunk = _step.value;
      var filename = availableChunks[chunk];

      if (filename) {
        response.names.push(chunk);
        response.filenames.push(filename);
      }
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

  return response;
}