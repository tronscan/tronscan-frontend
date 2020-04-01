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

var React = _interopRequireWildcard(require("react"));

var _reactLifecyclesCompat = require("react-lifecycles-compat");

var ErrorBoundary =
/*#__PURE__*/
function (_React$Component) {
  (0, _inherits2.default)(ErrorBoundary, _React$Component);

  function ErrorBoundary() {
    var _ref;

    var _temp, _this;

    (0, _classCallCheck2.default)(this, ErrorBoundary);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return (0, _possibleConstructorReturn2.default)(_this, (_temp = _this = (0, _possibleConstructorReturn2.default)(this, (_ref = ErrorBoundary.__proto__ || (0, _getPrototypeOf.default)(ErrorBoundary)).call.apply(_ref, [this].concat(args))), Object.defineProperty((0, _assertThisInitialized2.default)(_this), "state", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: {
        error: null,
        info: null
      }
    }), _temp));
  }

  (0, _createClass2.default)(ErrorBoundary, [{
    key: "componentDidCatch",
    value: function componentDidCatch(error, info) {
      var onError = this.props.onError; // onError is provided in production

      if (onError) {
        onError(error, info);
      } else {
        this.setState({
          error: error,
          info: info
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _props = this.props,
          ErrorReporter = _props.ErrorReporter,
          children = _props.children;
      var _state = this.state,
          error = _state.error,
          info = _state.info;

      if (ErrorReporter && error) {
        return React.createElement(ErrorReporter, {
          error: error,
          info: info
        });
      }

      return React.Children.only(children);
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps() {
      return {
        error: null,
        info: null
      };
    }
  }]);
  return ErrorBoundary;
}(React.Component); // Makes sure we can use React 16.3 lifecycles and still support older versions of React.


(0, _reactLifecyclesCompat.polyfill)(ErrorBoundary);
var _default = ErrorBoundary;
exports.default = _default;