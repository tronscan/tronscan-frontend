"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _getPrototypeOf = _interopRequireDefault(require("@babel/runtime/core-js/object/get-prototype-of"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _react = _interopRequireDefault(require("react"));

var _sourceMapSupport = require("./source-map-support");

var _errorDebug = _interopRequireWildcard(require("../lib/error-debug"));

// This component is only used in development, sourcemaps are applied on the fly because componentDidCatch is not async
var DevErrorOverlay =
/*#__PURE__*/
function (_React$Component) {
  (0, _inherits2.default)(DevErrorOverlay, _React$Component);

  function DevErrorOverlay() {
    var _ref;

    var _temp, _this;

    (0, _classCallCheck2.default)(this, DevErrorOverlay);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return (0, _possibleConstructorReturn2.default)(_this, (_temp = _this = (0, _possibleConstructorReturn2.default)(this, (_ref = DevErrorOverlay.__proto__ || (0, _getPrototypeOf.default)(DevErrorOverlay)).call.apply(_ref, [this].concat(args))), Object.defineProperty((0, _assertThisInitialized2.default)(_this), "state", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: {
        mappedError: null
      }
    }), _temp));
  }

  (0, _createClass2.default)(DevErrorOverlay, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      var error = this.props.error; // Since componentDidMount doesn't handle errors we use then/catch here

      (0, _sourceMapSupport.applySourcemaps)(error).then(function () {
        _this2.setState({
          mappedError: error
        });
      }).catch(function (caughtError) {
        _this2.setState({
          mappedError: caughtError
        });
      });
    }
  }, {
    key: "render",
    value: function render() {
      var mappedError = this.state.mappedError;
      var info = this.props.info;

      if (mappedError === null) {
        return _react.default.createElement("div", {
          style: _errorDebug.styles.errorDebug
        }, _react.default.createElement("h1", {
          style: _errorDebug.styles.heading
        }, "Loading stacktrace..."));
      }

      return _react.default.createElement(_errorDebug.default, {
        error: mappedError,
        info: info
      });
    }
  }]);
  return DevErrorOverlay;
}(_react.default.Component);

var _default = DevErrorOverlay;
exports.default = _default;