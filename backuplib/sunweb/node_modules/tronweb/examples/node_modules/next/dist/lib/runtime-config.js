"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setConfig = setConfig;
exports.default = void 0;
var runtimeConfig;

var _default = function _default() {
  return runtimeConfig;
};

exports.default = _default;

function setConfig(configValue) {
  runtimeConfig = configValue;
}