"use strict";

exports.__esModule = true;
exports.default = void 0;

var _helperPluginUtils = require("@babel/helper-plugin-utils");

var _pluginSyntaxOptionalCatchBinding = _interopRequireDefault(require("@babel/plugin-syntax-optional-catch-binding"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = (0, _helperPluginUtils.declare)(function (api) {
  api.assertVersion(7);
  return {
    inherits: _pluginSyntaxOptionalCatchBinding.default,
    visitor: {
      CatchClause: function CatchClause(path) {
        if (!path.node.param) {
          var uid = path.scope.generateUidIdentifier("unused");
          var paramPath = path.get("param");
          paramPath.replaceWith(uid);
        }
      }
    }
  };
});

exports.default = _default;