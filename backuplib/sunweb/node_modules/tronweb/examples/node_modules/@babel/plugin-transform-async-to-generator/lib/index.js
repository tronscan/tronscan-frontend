"use strict";

exports.__esModule = true;
exports.default = void 0;

var _helperPluginUtils = require("@babel/helper-plugin-utils");

var _helperRemapAsyncToGenerator = _interopRequireDefault(require("@babel/helper-remap-async-to-generator"));

var _helperModuleImports = require("@babel/helper-module-imports");

var _core = require("@babel/core");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = (0, _helperPluginUtils.declare)(function (api, options) {
  api.assertVersion(7);
  var method = options.method,
      module = options.module;

  if (method && module) {
    return {
      visitor: {
        Function: function Function(path, state) {
          if (!path.node.async || path.node.generator) return;
          var wrapAsync = state.methodWrapper;

          if (wrapAsync) {
            wrapAsync = _core.types.cloneNode(wrapAsync);
          } else {
            wrapAsync = state.methodWrapper = (0, _helperModuleImports.addNamed)(path, method, module);
          }

          (0, _helperRemapAsyncToGenerator.default)(path, {
            wrapAsync: wrapAsync
          });
        }
      }
    };
  }

  return {
    visitor: {
      Function: function Function(path, state) {
        if (!path.node.async || path.node.generator) return;
        (0, _helperRemapAsyncToGenerator.default)(path, {
          wrapAsync: state.addHelper("asyncToGenerator")
        });
      }
    }
  };
});

exports.default = _default;