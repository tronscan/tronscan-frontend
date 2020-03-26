"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _stripAnsi = _interopRequireDefault(require("strip-ansi"));

var next = _interopRequireWildcard(require("./"));

var _devErrorOverlay = _interopRequireDefault(require("./dev-error-overlay"));

var _onDemandEntriesClient = _interopRequireDefault(require("./on-demand-entries-client"));

var _webpackHotMiddlewareClient = _interopRequireDefault(require("./webpack-hot-middleware-client"));

var _sourceMapSupport = require("./source-map-support");

window.next = next;
(0, next.default)({
  DevErrorOverlay: _devErrorOverlay.default,
  applySourcemaps: _sourceMapSupport.applySourcemaps,
  stripAnsi: _stripAnsi.default
}).then(function (emitter) {
  (0, _onDemandEntriesClient.default)();
  (0, _webpackHotMiddlewareClient.default)();
  var lastScroll;
  emitter.on('before-reactdom-render', function (_ref) {
    var Component = _ref.Component,
        ErrorComponent = _ref.ErrorComponent;

    // Remember scroll when ErrorComponent is being rendered to later restore it
    if (!lastScroll && Component === ErrorComponent) {
      var _window = window,
          pageXOffset = _window.pageXOffset,
          pageYOffset = _window.pageYOffset;
      lastScroll = {
        x: pageXOffset,
        y: pageYOffset
      };
    }
  });
  emitter.on('after-reactdom-render', function (_ref2) {
    var Component = _ref2.Component,
        ErrorComponent = _ref2.ErrorComponent;

    if (lastScroll && Component !== ErrorComponent) {
      // Restore scroll after ErrorComponent was replaced with a page component by HMR
      var _lastScroll = lastScroll,
          x = _lastScroll.x,
          y = _lastScroll.y;
      window.scroll(x, y);
      lastScroll = null;
    }
  });
}).catch(function (err) {
  console.error((0, _stripAnsi.default)("".concat(err.message, "\n").concat(err.stack)));
});