"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _promise = _interopRequireDefault(require("@babel/runtime/core-js/promise"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _router = _interopRequireDefault(require("../lib/router"));

var _unfetch = _interopRequireDefault(require("unfetch"));

/* global location */
var _window = window,
    assetPrefix = _window.__NEXT_DATA__.assetPrefix;

var _default = function _default() {
  _router.default.ready(function () {
    _router.default.router.events.on('routeChangeComplete', ping);
  });

  function ping() {
    return _ping.apply(this, arguments);
  }

  function _ping() {
    _ping = (0, _asyncToGenerator2.default)(
    /*#__PURE__*/
    _regenerator.default.mark(function _callee() {
      var url, res, payload, pageRes;
      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              url = "".concat(assetPrefix, "/_next/on-demand-entries-ping?page=").concat(_router.default.pathname);
              _context.next = 4;
              return (0, _unfetch.default)(url, {
                credentials: 'omit'
              });

            case 4:
              res = _context.sent;
              _context.next = 7;
              return res.json();

            case 7:
              payload = _context.sent;

              if (!payload.invalid) {
                _context.next = 13;
                break;
              }

              _context.next = 11;
              return (0, _unfetch.default)(location.href, {
                credentials: 'omit'
              });

            case 11:
              pageRes = _context.sent;

              if (pageRes.status === 200) {
                location.reload();
              }

            case 13:
              _context.next = 18;
              break;

            case 15:
              _context.prev = 15;
              _context.t0 = _context["catch"](0);
              console.error("Error with on-demand-entries-ping: ".concat(_context.t0.message));

            case 18:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this, [[0, 15]]);
    }));
    return _ping.apply(this, arguments);
  }

  var pingerTimeout;

  function runPinger() {
    return _runPinger.apply(this, arguments);
  }

  function _runPinger() {
    _runPinger = (0, _asyncToGenerator2.default)(
    /*#__PURE__*/
    _regenerator.default.mark(function _callee2() {
      return _regenerator.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (document.hidden) {
                _context2.next = 7;
                break;
              }

              _context2.next = 3;
              return ping();

            case 3:
              _context2.next = 5;
              return new _promise.default(function (resolve) {
                pingerTimeout = setTimeout(resolve, 5000);
              });

            case 5:
              _context2.next = 0;
              break;

            case 7:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));
    return _runPinger.apply(this, arguments);
  }

  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) {
      runPinger();
    } else {
      clearTimeout(pingerTimeout);
    }
  }, false);
  setTimeout(function () {
    runPinger().catch(function (err) {
      console.error(err);
    });
  }, 10000);
};

exports.default = _default;