"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _keys = _interopRequireDefault(require("@babel/runtime/core-js/object/keys"));

require("event-source-polyfill");

var _clientAutoConnectFalseOverlayFalseReloadTrue = _interopRequireDefault(require("webpack-hot-middleware/client?autoConnect=false&overlay=false&reload=true"));

var _router = _interopRequireDefault(require("../lib/router"));

var _window = window,
    assetPrefix = _window.__NEXT_DATA__.assetPrefix;

var _default = function _default() {
  _clientAutoConnectFalseOverlayFalseReloadTrue.default.setOptionsAndConnect({
    path: "".concat(assetPrefix, "/_next/webpack-hmr")
  });

  var handlers = {
    reload: function reload(route) {
      if (route === '/_error') {
        var _arr = (0, _keys.default)(_router.default.components);

        for (var _i = 0; _i < _arr.length; _i++) {
          var r = _arr[_i];
          var err = _router.default.components[r].err;

          if (err) {
            // reload all error routes
            // which are expected to be errors of '/_error' routes
            _router.default.reload(r);
          }
        }

        return;
      } // If the App component changes we have to reload the current route


      if (route === '/_app') {
        _router.default.reload(_router.default.route);

        return;
      } // Since _document is server only we need to reload the full page when it changes.


      if (route === '/_document') {
        window.location.reload();
        return;
      }

      _router.default.reload(route);
    },
    change: function change(route) {
      // If the App component changes we have to reload the current route
      if (route === '/_app') {
        _router.default.reload(_router.default.route);

        return;
      } // Since _document is server only we need to reload the full page when it changes.


      if (route === '/_document') {
        window.location.reload();
        return;
      }

      var _ref = _router.default.components[route] || {},
          err = _ref.err,
          Component = _ref.Component;

      if (err) {
        // reload to recover from runtime errors
        _router.default.reload(route);
      }

      if (_router.default.route !== route) {
        // If this is a not a change for a currently viewing page.
        // We don't need to worry about it.
        return;
      }

      if (!Component) {
        // This only happens when we create a new page without a default export.
        // If you removed a default export from a exising viewing page, this has no effect.
        console.log("Hard reloading due to no default component in page: ".concat(route));
        window.location.reload();
      }
    }
  };

  _clientAutoConnectFalseOverlayFalseReloadTrue.default.subscribe(function (obj) {
    var fn = handlers[obj.action];

    if (fn) {
      var data = obj.data || [];
      fn.apply(void 0, (0, _toConsumableArray2.default)(data));
    } else {
      throw new Error('Unexpected action ' + obj.action);
    }
  });
};

exports.default = _default;