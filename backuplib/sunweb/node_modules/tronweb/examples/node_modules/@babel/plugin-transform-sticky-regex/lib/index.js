"use strict";

exports.__esModule = true;
exports.default = void 0;

var _helperPluginUtils = require("@babel/helper-plugin-utils");

var regex = _interopRequireWildcard(require("@babel/helper-regex"));

var _core = require("@babel/core");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

var _default = (0, _helperPluginUtils.declare)(function (api) {
  api.assertVersion(7);
  return {
    visitor: {
      RegExpLiteral: function RegExpLiteral(path) {
        var node = path.node;
        if (!regex.is(node, "y")) return;
        path.replaceWith(_core.types.newExpression(_core.types.identifier("RegExp"), [_core.types.stringLiteral(node.pattern), _core.types.stringLiteral(node.flags)]));
      }
    }
  };
});

exports.default = _default;