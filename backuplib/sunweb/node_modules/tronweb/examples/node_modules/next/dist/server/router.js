"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _getIterator2 = _interopRequireDefault(require("@babel/runtime/core-js/get-iterator"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _set = _interopRequireDefault(require("@babel/runtime/core-js/set"));

var _map = _interopRequireDefault(require("@babel/runtime/core-js/map"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _pathMatch = _interopRequireDefault(require("./lib/path-match"));

var route = (0, _pathMatch.default)();

var Router =
/*#__PURE__*/
function () {
  function Router() {
    (0, _classCallCheck2.default)(this, Router);
    this.routes = new _map.default();
  }

  (0, _createClass2.default)(Router, [{
    key: "add",
    value: function add(method, path, fn) {
      var routes = this.routes.get(method) || new _set.default();
      routes.add({
        match: route(path),
        fn: fn
      });
      this.routes.set(method, routes);
    }
  }, {
    key: "match",
    value: function match(req, res, parsedUrl) {
      var routes = this.routes.get(req.method);
      if (!routes) return;
      var pathname = parsedUrl.pathname;

      var _loop = function _loop(r) {
        var params = r.match(pathname);

        if (params) {
          return {
            v: function () {
              var _v = (0, _asyncToGenerator2.default)(
              /*#__PURE__*/
              _regenerator.default.mark(function _callee() {
                return _regenerator.default.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        return _context.abrupt("return", r.fn(req, res, params, parsedUrl));

                      case 1:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee, this);
              }));

              return function v() {
                return _v.apply(this, arguments);
              };
            }()
          };
        }
      };

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = (0, _getIterator2.default)(routes), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var r = _step.value;

          var _ret = _loop(r);

          if ((0, _typeof2.default)(_ret) === "object") return _ret.v;
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
    }
  }]);
  return Router;
}();

exports.default = Router;