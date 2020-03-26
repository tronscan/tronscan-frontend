"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ErrorDebug;
exports.styles = void 0;

var _react = _interopRequireDefault(require("react"));

var _ansiHtml = _interopRequireDefault(require("ansi-html"));

var _head = _interopRequireDefault(require("./head"));

// This component is rendered through dev-error-overlay on the client side.
// On the server side it's rendered directly
function ErrorDebug(_ref) {
  var error = _ref.error,
      info = _ref.info;
  var name = error.name,
      message = error.message,
      module = error.module;
  return _react.default.createElement("div", {
    style: styles.errorDebug
  }, _react.default.createElement(_head.default, null, _react.default.createElement("meta", {
    name: "viewport",
    content: "width=device-width, initial-scale=1.0"
  })), module ? _react.default.createElement("h1", {
    style: styles.heading
  }, "Error in ", module.rawRequest) : null, name === 'ModuleBuildError' && message ? _react.default.createElement("pre", {
    style: styles.stack,
    dangerouslySetInnerHTML: {
      __html: (0, _ansiHtml.default)(encodeHtml(message))
    }
  }) : _react.default.createElement(StackTrace, {
    error: error,
    info: info
  }));
}

var StackTrace = function StackTrace(_ref2) {
  var _ref2$error = _ref2.error,
      name = _ref2$error.name,
      message = _ref2$error.message,
      stack = _ref2$error.stack,
      info = _ref2.info;
  return _react.default.createElement("div", null, _react.default.createElement("div", {
    style: styles.heading
  }, message || name), _react.default.createElement("pre", {
    style: styles.stack
  }, stack), info && _react.default.createElement("pre", {
    style: styles.stack
  }, info.componentStack));
};

var styles = {
  errorDebug: {
    background: '#0e0d0d',
    boxSizing: 'border-box',
    overflow: 'auto',
    padding: '24px',
    position: 'fixed',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 9999,
    color: '#b3adac'
  },
  stack: {
    fontFamily: '"SF Mono", "Roboto Mono", "Fira Mono", consolas, menlo-regular, monospace',
    fontSize: '13px',
    lineHeight: '18px',
    color: '#b3adac',
    margin: 0,
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    marginTop: '16px'
  },
  heading: {
    fontFamily: '-apple-system, system-ui, BlinkMacSystemFont, Roboto, "Segoe UI", "Fira Sans", Avenir, "Helvetica Neue", "Lucida Grande", sans-serif',
    fontSize: '20px',
    fontWeight: '400',
    lineHeight: '28px',
    color: '#fff',
    marginBottom: '0px',
    marginTop: '0px'
  }
};
exports.styles = styles;

var encodeHtml = function encodeHtml(str) {
  return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}; // see color definitions of babel-code-frame:
// https://github.com/babel/babel/blob/master/packages/babel-code-frame/src/index.js


_ansiHtml.default.setColors({
  reset: ['6F6767', '0e0d0d'],
  darkgrey: '6F6767',
  yellow: '6F6767',
  green: 'ebe7e5',
  magenta: 'ebe7e5',
  blue: 'ebe7e5',
  cyan: 'ebe7e5',
  red: 'ff001f'
});