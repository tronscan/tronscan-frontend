"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

// Resolve styled-jsx plugins
function styledJsxOptions(opts) {
  if (!opts) {
    return {};
  }

  if (!Array.isArray(opts.plugins)) {
    return opts;
  }

  opts.plugins = opts.plugins.map(function (plugin) {
    if (Array.isArray(plugin)) {
      var _plugin = (0, _slicedToArray2.default)(plugin, 2),
          name = _plugin[0],
          options = _plugin[1];

      return [require.resolve(name), options];
    }

    return require.resolve(plugin);
  });
  return opts;
}

module.exports = function (context) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return {
    presets: [[require('@babel/preset-env'), (0, _objectSpread2.default)({
      modules: false
    }, opts['preset-env'])], require('@babel/preset-react')],
    plugins: [require('babel-plugin-react-require'), require('./plugins/handle-import'), [require('@babel/plugin-proposal-class-properties'), opts['class-properties'] || {}], require('@babel/plugin-proposal-object-rest-spread'), [require('@babel/plugin-transform-runtime'), opts['transform-runtime'] || {
      helpers: false,
      polyfill: false,
      regenerator: true
    }], [require('styled-jsx/babel'), styledJsxOptions(opts['styled-jsx'])], process.env.NODE_ENV === 'production' && require('babel-plugin-transform-react-remove-prop-types')].filter(Boolean)
  };
};