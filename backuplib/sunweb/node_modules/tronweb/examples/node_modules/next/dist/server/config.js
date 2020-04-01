"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = loadConfig;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _findUp = _interopRequireDefault(require("find-up"));

var _uuid = _interopRequireDefault(require("uuid"));

var _constants = require("../lib/constants");

var defaultConfig = {
  webpack: null,
  webpackDevMiddleware: null,
  poweredByHeader: true,
  distDir: '.next',
  assetPrefix: '',
  configOrigin: 'default',
  useFileSystemPublicRoutes: true,
  generateBuildId: function generateBuildId() {
    return _uuid.default.v4();
  },
  generateEtags: true,
  pageExtensions: ['jsx', 'js']
};

function loadConfig(phase, dir, customConfig) {
  if (customConfig) {
    customConfig.configOrigin = 'server';
    return (0, _objectSpread2.default)({}, defaultConfig, customConfig);
  }

  var path = _findUp.default.sync(_constants.CONFIG_FILE, {
    cwd: dir
  }); // If config file was found


  if (path && path.length) {
    // $FlowFixMe
    var userConfigModule = require(path);

    var userConfigInitial = userConfigModule.default || userConfigModule;

    if (typeof userConfigInitial === 'function') {
      return (0, _objectSpread2.default)({}, defaultConfig, {
        configOrigin: _constants.CONFIG_FILE
      }, userConfigInitial(phase, {
        defaultConfig: defaultConfig
      }));
    }

    return (0, _objectSpread2.default)({}, defaultConfig, {
      configOrigin: _constants.CONFIG_FILE
    }, userConfigInitial);
  }

  return defaultConfig;
}