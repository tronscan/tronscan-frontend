"use strict";

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

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _httpStatus = _interopRequireDefault(require("http-status"));

var _head = _interopRequireDefault(require("./head"));

var Error =
/*#__PURE__*/
function (_React$Component) {
  (0, _inherits2.default)(Error, _React$Component);

  function Error() {
    (0, _classCallCheck2.default)(this, Error);
    return (0, _possibleConstructorReturn2.default)(this, (Error.__proto__ || (0, _getPrototypeOf.default)(Error)).apply(this, arguments));
  }

  (0, _createClass2.default)(Error, [{
    key: "render",
    value: function render() {
      var statusCode = this.props.statusCode;
      var title = statusCode === 404 ? 'This page could not be found' : _httpStatus.default[statusCode] || 'An unexpected error has occurred';
      return _react.default.createElement("div", {
        style: styles.error
      }, _react.default.createElement(_head.default, null, _react.default.createElement("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1.0"
      }), _react.default.createElement("title", null, statusCode, ": ", title)), _react.default.createElement("div", null, _react.default.createElement("style", {
        dangerouslySetInnerHTML: {
          __html: 'body { margin: 0 }'
        }
      }), statusCode ? _react.default.createElement("h1", {
        style: styles.h1
      }, statusCode) : null, _react.default.createElement("div", {
        style: styles.desc
      }, _react.default.createElement("h2", {
        style: styles.h2
      }, title, "."))));
    }
  }], [{
    key: "getInitialProps",
    value: function getInitialProps(_ref) {
      var res = _ref.res,
          err = _ref.err;
      var statusCode = res ? res.statusCode : err ? err.statusCode : null;
      return {
        statusCode: statusCode
      };
    }
  }]);
  return Error;
}(_react.default.Component);

exports.default = Error;
Object.defineProperty(Error, "propTypes", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: {
    statusCode: _propTypes.default.number
  }
});
var styles = {
  error: {
    color: '#000',
    background: '#fff',
    fontFamily: '-apple-system, BlinkMacSystemFont, Roboto, "Segoe UI", "Fira Sans", Avenir, "Helvetica Neue", "Lucida Grande", sans-serif',
    height: '100vh',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  desc: {
    display: 'inline-block',
    textAlign: 'left',
    lineHeight: '49px',
    height: '49px',
    verticalAlign: 'middle'
  },
  h1: {
    display: 'inline-block',
    borderRight: '1px solid rgba(0, 0, 0,.3)',
    margin: 0,
    marginRight: '20px',
    padding: '10px 23px 10px 0',
    fontSize: '24px',
    fontWeight: 500,
    verticalAlign: 'top'
  },
  h2: {
    fontSize: '14px',
    fontWeight: 'normal',
    lineHeight: 'inherit',
    margin: 0,
    padding: 0
  }
};