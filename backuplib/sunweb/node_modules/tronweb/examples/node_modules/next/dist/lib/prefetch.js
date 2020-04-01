"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.prefetch = prefetch;
exports.default = void 0;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _getPrototypeOf = _interopRequireDefault(require("@babel/runtime/core-js/object/get-prototype-of"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _react = _interopRequireDefault(require("react"));

var _link = _interopRequireDefault(require("./link"));

var _router = _interopRequireDefault(require("./router"));

var _utils = require("./utils");

var warnImperativePrefetch = (0, _utils.execOnce)(function () {
  var message = '> You are using deprecated "next/prefetch". It will be removed with Next.js 2.0.\n' + '> Use "Router.prefetch(href)" instead.';
  (0, _utils.warn)(message);
});
var wantLinkPrefetch = (0, _utils.execOnce)(function () {
  var message = '> You are using deprecated "next/prefetch". It will be removed with Next.js 2.0.\n' + '> Use "<Link prefetch />" instead.';
  (0, _utils.warn)(message);
});

function prefetch(href) {
  warnImperativePrefetch();
  return _router.default.prefetch(href);
}

var LinkPrefetch =
/*#__PURE__*/
function (_React$Component) {
  (0, _inherits2.default)(LinkPrefetch, _React$Component);

  function LinkPrefetch() {
    (0, _classCallCheck2.default)(this, LinkPrefetch);
    return (0, _possibleConstructorReturn2.default)(this, (LinkPrefetch.__proto__ || (0, _getPrototypeOf.default)(LinkPrefetch)).apply(this, arguments));
  }

  (0, _createClass2.default)(LinkPrefetch, [{
    key: "render",
    value: function render() {
      wantLinkPrefetch();
      var props = (0, _objectSpread2.default)({}, this.props, {
        prefetch: this.props.prefetch !== false
      });
      return _react.default.createElement(_link.default, props);
    }
  }]);
  return LinkPrefetch;
}(_react.default.Component);

exports.default = LinkPrefetch;