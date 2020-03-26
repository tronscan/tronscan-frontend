"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _assign = _interopRequireDefault(require("@babel/runtime/core-js/object/assign"));

var _set = _interopRequireDefault(require("@babel/runtime/core-js/set"));

var _babelLoader = _interopRequireDefault(require("babel-loader"));

module.exports = _babelLoader.default.custom(function (babel) {
  var presetItem = babel.createConfigItem(require('../../babel/preset'), {
    type: 'preset'
  });
  var reactJsxSourceItem = babel.createConfigItem(require('@babel/plugin-transform-react-jsx-source'), {
    type: 'plugin'
  });
  var configs = new _set.default();
  return {
    customOptions: function customOptions(opts) {
      var custom = {
        isServer: opts.isServer,
        dev: opts.dev
      };
      var loader = (0, _assign.default)({
        cacheDirectory: true
      }, opts);
      delete loader.isServer;
      delete loader.dev;
      return {
        loader: loader,
        custom: custom
      };
    },
    config: function config(cfg, _ref) {
      var _ref$customOptions = _ref.customOptions,
          isServer = _ref$customOptions.isServer,
          dev = _ref$customOptions.dev;
      var options = (0, _assign.default)({}, cfg.options);

      if (cfg.hasFilesystemConfig()) {
        var _arr = [cfg.babelrc, cfg.config];

        for (var _i = 0; _i < _arr.length; _i++) {
          var file = _arr[_i];

          // We only log for client compilation otherwise there will be double output
          if (file && !isServer && !configs.has(file)) {
            configs.add(file);
            console.log("> Using external babel configuration");
            console.log("> Location: \"".concat(file, "\""));
          }
        }
      } else {
        // Add our default preset if the no "babelrc" found.
        options.presets = (0, _toConsumableArray2.default)(options.presets).concat([presetItem]);
      }

      options.plugins = (0, _toConsumableArray2.default)(options.plugins).concat([dev && reactJsxSourceItem]).filter(Boolean);
      return options;
    }
  };
});