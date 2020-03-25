"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.render = render;
exports.renderError = renderError;
exports.default = exports.emitter = exports.ErrorComponent = exports.router = void 0;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _getIterator2 = _interopRequireDefault(require("@babel/runtime/core-js/get-iterator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _promise = _interopRequireDefault(require("@babel/runtime/core-js/promise"));

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _headManager = _interopRequireDefault(require("./head-manager"));

var _router2 = require("../lib/router");

var _EventEmitter = _interopRequireDefault(require("../lib/EventEmitter"));

var _utils = require("../lib/utils");

var _pageLoader = _interopRequireDefault(require("../lib/page-loader"));

var asset = _interopRequireWildcard(require("../lib/asset"));

var envConfig = _interopRequireWildcard(require("../lib/runtime-config"));

var _errorBoundary = _interopRequireDefault(require("./error-boundary"));

// Polyfill Promise globally
// This is needed because Webpack2's dynamic loading(common chunks) code
// depends on Promise.
// So, we need to polyfill it.
// See: https://github.com/webpack/webpack/issues/4254
if (!window.Promise) {
  window.Promise = _promise.default;
}

var _window = window,
    _window$__NEXT_DATA__ = _window.__NEXT_DATA__,
    props = _window$__NEXT_DATA__.props,
    err = _window$__NEXT_DATA__.err,
    page = _window$__NEXT_DATA__.page,
    pathname = _window$__NEXT_DATA__.pathname,
    query = _window$__NEXT_DATA__.query,
    buildId = _window$__NEXT_DATA__.buildId,
    chunks = _window$__NEXT_DATA__.chunks,
    assetPrefix = _window$__NEXT_DATA__.assetPrefix,
    runtimeConfig = _window$__NEXT_DATA__.runtimeConfig,
    location = _window.location; // With dynamic assetPrefix it's no longer possible to set assetPrefix at the build time
// So, this is how we do it in the client side at runtime

__webpack_public_path__ = "".concat(assetPrefix, "/_next/webpack/"); //eslint-disable-line
// Initialize next/asset with the assetPrefix

asset.setAssetPrefix(assetPrefix); // Initialize next/config with the environment configuration

envConfig.setConfig({
  serverRuntimeConfig: {},
  publicRuntimeConfig: runtimeConfig
});
var asPath = (0, _utils.getURL)();
var pageLoader = new _pageLoader.default(buildId, assetPrefix);

window.__NEXT_LOADED_PAGES__.forEach(function (_ref) {
  var route = _ref.route,
      fn = _ref.fn;
  pageLoader.registerPage(route, fn);
});

delete window.__NEXT_LOADED_PAGES__;

window.__NEXT_LOADED_CHUNKS__.forEach(function (_ref2) {
  var chunkName = _ref2.chunkName,
      fn = _ref2.fn;
  pageLoader.registerChunk(chunkName, fn);
});

delete window.__NEXT_LOADED_CHUNKS__;
window.__NEXT_REGISTER_PAGE = pageLoader.registerPage.bind(pageLoader);
window.__NEXT_REGISTER_CHUNK = pageLoader.registerChunk.bind(pageLoader);
var headManager = new _headManager.default();
var appContainer = document.getElementById('__next');
var errorContainer = document.getElementById('__next-error');
var lastAppProps;
var router;
exports.router = router;
var ErrorComponent;
exports.ErrorComponent = ErrorComponent;
var DevErrorOverlay;
var Component;
var App;

var stripAnsi = function stripAnsi(s) {
  return s;
};

var applySourcemaps = function applySourcemaps(e) {
  return e;
};

var emitter = new _EventEmitter.default();
exports.emitter = emitter;

var _default =
/*#__PURE__*/
(0, _asyncToGenerator2.default)(
/*#__PURE__*/
_regenerator.default.mark(function _callee() {
  var _ref4,
      passedDevErrorOverlay,
      passedStripAnsi,
      passedApplySourcemaps,
      _iteratorNormalCompletion,
      _didIteratorError,
      _iteratorError,
      _iterator,
      _step,
      _chunkName,
      initialErr,
      hash,
      _args = arguments;

  return _regenerator.default.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _ref4 = _args.length > 0 && _args[0] !== undefined ? _args[0] : {}, passedDevErrorOverlay = _ref4.DevErrorOverlay, passedStripAnsi = _ref4.stripAnsi, passedApplySourcemaps = _ref4.applySourcemaps;
          // Wait for all the dynamic chunks to get loaded
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context.prev = 4;
          _iterator = (0, _getIterator2.default)(chunks);

        case 6:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context.next = 13;
            break;
          }

          _chunkName = _step.value;
          _context.next = 10;
          return pageLoader.waitForChunk(_chunkName);

        case 10:
          _iteratorNormalCompletion = true;
          _context.next = 6;
          break;

        case 13:
          _context.next = 19;
          break;

        case 15:
          _context.prev = 15;
          _context.t0 = _context["catch"](4);
          _didIteratorError = true;
          _iteratorError = _context.t0;

        case 19:
          _context.prev = 19;
          _context.prev = 20;

          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }

        case 22:
          _context.prev = 22;

          if (!_didIteratorError) {
            _context.next = 25;
            break;
          }

          throw _iteratorError;

        case 25:
          return _context.finish(22);

        case 26:
          return _context.finish(19);

        case 27:
          stripAnsi = passedStripAnsi || stripAnsi;
          applySourcemaps = passedApplySourcemaps || applySourcemaps;
          DevErrorOverlay = passedDevErrorOverlay;
          _context.next = 32;
          return pageLoader.loadPage('/_error');

        case 32:
          exports.ErrorComponent = ErrorComponent = _context.sent;
          _context.next = 35;
          return pageLoader.loadPage('/_app');

        case 35:
          App = _context.sent;
          initialErr = err;
          _context.prev = 37;
          _context.next = 40;
          return pageLoader.loadPage(page);

        case 40:
          Component = _context.sent;

          if (!(typeof Component !== 'function')) {
            _context.next = 43;
            break;
          }

          throw new Error("The default export is not a React Component in page: \"".concat(pathname, "\""));

        case 43:
          _context.next = 48;
          break;

        case 45:
          _context.prev = 45;
          _context.t1 = _context["catch"](37);
          // This catches errors like throwing in the top level of a module
          initialErr = _context.t1;

        case 48:
          exports.router = router = (0, _router2.createRouter)(pathname, query, asPath, {
            initialProps: props,
            pageLoader: pageLoader,
            App: App,
            Component: Component,
            ErrorComponent: ErrorComponent,
            err: initialErr
          });
          router.subscribe(function (_ref5) {
            var App = _ref5.App,
                Component = _ref5.Component,
                props = _ref5.props,
                hash = _ref5.hash,
                err = _ref5.err;
            render({
              App: App,
              Component: Component,
              props: props,
              err: err,
              hash: hash,
              emitter: emitter
            });
          });
          hash = location.hash.substring(1);
          render({
            App: App,
            Component: Component,
            props: props,
            hash: hash,
            err: initialErr,
            emitter: emitter
          });
          return _context.abrupt("return", emitter);

        case 53:
        case "end":
          return _context.stop();
      }
    }
  }, _callee, this, [[4, 15, 19, 27], [20,, 22, 26], [37, 45]]);
}));

exports.default = _default;

function render(_x) {
  return _render.apply(this, arguments);
} // This method handles all runtime and debug errors.
// 404 and 500 errors are special kind of errors
// and they are still handle via the main render method.


function _render() {
  _render = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee2(props) {
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (!props.err) {
              _context2.next = 4;
              break;
            }

            _context2.next = 3;
            return renderError(props);

          case 3:
            return _context2.abrupt("return");

          case 4:
            _context2.prev = 4;
            _context2.next = 7;
            return doRender(props);

          case 7:
            _context2.next = 15;
            break;

          case 9:
            _context2.prev = 9;
            _context2.t0 = _context2["catch"](4);

            if (!_context2.t0.abort) {
              _context2.next = 13;
              break;
            }

            return _context2.abrupt("return");

          case 13:
            _context2.next = 15;
            return renderError((0, _objectSpread2.default)({}, props, {
              err: _context2.t0
            }));

          case 15:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this, [[4, 9]]);
  }));
  return _render.apply(this, arguments);
}

function renderError(_x2) {
  return _renderError.apply(this, arguments);
}

function _renderError() {
  _renderError = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee3(props) {
    var err, errorInfo, str;
    return _regenerator.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            err = props.err, errorInfo = props.errorInfo; // In development we apply sourcemaps to the error

            if (!(process.env.NODE_ENV !== 'production')) {
              _context3.next = 4;
              break;
            }

            _context3.next = 4;
            return applySourcemaps(err);

          case 4:
            str = stripAnsi("".concat(err.message, "\n").concat(err.stack).concat(errorInfo ? "\n\n".concat(errorInfo.componentStack) : ''));
            console.error(str);

            if (!(process.env.NODE_ENV !== 'production')) {
              _context3.next = 10;
              break;
            }

            // We need to unmount the current app component because it's
            // in the inconsistant state.
            // Otherwise, we need to face issues when the issue is fixed and
            // it's get notified via HMR
            _reactDom.default.unmountComponentAtNode(appContainer);

            renderReactElement(_react.default.createElement(DevErrorOverlay, {
              error: err
            }), errorContainer);
            return _context3.abrupt("return");

          case 10:
            _context3.next = 12;
            return doRender((0, _objectSpread2.default)({}, props, {
              err: err,
              Component: ErrorComponent
            }));

          case 12:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));
  return _renderError.apply(this, arguments);
}

function doRender(_x3) {
  return _doRender.apply(this, arguments);
}

function _doRender() {
  _doRender = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee5(_ref6) {
    var App, Component, props, hash, err, _ref6$emitter, emitterProp, _router, _pathname, _query, _asPath, appProps, onError;

    return _regenerator.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            App = _ref6.App, Component = _ref6.Component, props = _ref6.props, hash = _ref6.hash, err = _ref6.err, _ref6$emitter = _ref6.emitter, emitterProp = _ref6$emitter === void 0 ? emitter : _ref6$emitter;

            if (!(!props && Component && Component !== ErrorComponent && lastAppProps.Component === ErrorComponent)) {
              _context5.next = 6;
              break;
            }

            _router = router, _pathname = _router.pathname, _query = _router.query, _asPath = _router.asPath;
            _context5.next = 5;
            return (0, _utils.loadGetInitialProps)(App, {
              Component: Component,
              router: router,
              ctx: {
                err: err,
                pathname: _pathname,
                query: _query,
                asPath: _asPath
              }
            });

          case 5:
            props = _context5.sent;

          case 6:
            Component = Component || lastAppProps.Component;
            props = props || lastAppProps.props;
            appProps = (0, _objectSpread2.default)({
              Component: Component,
              hash: hash,
              err: err,
              router: router,
              headManager: headManager
            }, props); // lastAppProps has to be set before ReactDom.render to account for ReactDom throwing an error.

            lastAppProps = appProps;
            emitterProp.emit('before-reactdom-render', {
              Component: Component,
              ErrorComponent: ErrorComponent,
              appProps: appProps
            }); // We need to clear any existing runtime error messages

            _reactDom.default.unmountComponentAtNode(errorContainer);

            onError = null;

            if (process.env.NODE_ENV !== 'development') {
              onError =
              /*#__PURE__*/
              function () {
                var _ref7 = (0, _asyncToGenerator2.default)(
                /*#__PURE__*/
                _regenerator.default.mark(function _callee4(error, errorInfo) {
                  return _regenerator.default.wrap(function _callee4$(_context4) {
                    while (1) {
                      switch (_context4.prev = _context4.next) {
                        case 0:
                          _context4.prev = 0;
                          _context4.next = 3;
                          return renderError({
                            App: App,
                            err: error,
                            errorInfo: errorInfo
                          });

                        case 3:
                          _context4.next = 8;
                          break;

                        case 5:
                          _context4.prev = 5;
                          _context4.t0 = _context4["catch"](0);
                          console.error('Error while rendering error page: ', _context4.t0);

                        case 8:
                        case "end":
                          return _context4.stop();
                      }
                    }
                  }, _callee4, this, [[0, 5]]);
                }));

                return function onError(_x4, _x5) {
                  return _ref7.apply(this, arguments);
                };
              }();
            } // In development we render a wrapper component that catches runtime errors.


            renderReactElement(_react.default.createElement(_errorBoundary.default, {
              ErrorReporter: DevErrorOverlay,
              onError: onError
            }, _react.default.createElement(App, appProps)), appContainer);
            emitterProp.emit('after-reactdom-render', {
              Component: Component,
              ErrorComponent: ErrorComponent,
              appProps: appProps
            });

          case 16:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));
  return _doRender.apply(this, arguments);
}

var isInitialRender = true;

function renderReactElement(reactEl, domEl) {
  // The check for `.hydrate` is there to support React alternatives like preact
  if (isInitialRender && typeof _reactDom.default.hydrate === 'function') {
    _reactDom.default.hydrate(reactEl, domEl);

    isInitialRender = false;
  } else {
    _reactDom.default.render(reactEl, domEl);
  }
}