"use strict";

exports.__esModule = true;
exports.default = void 0;

var _helperPluginUtils = require("@babel/helper-plugin-utils");

var _regexpuCore = _interopRequireDefault(require("regexpu-core"));

var regex = _interopRequireWildcard(require("@babel/helper-regex"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = (0, _helperPluginUtils.declare)(function (api) {
  api.assertVersion(7);
  return {
    visitor: {
      RegExpLiteral: function RegExpLiteral(_ref) {
        var node = _ref.node;
        if (!regex.is(node, "u")) return;
        node.pattern = (0, _regexpuCore.default)(node.pattern, node.flags);
        regex.pullFlag(node, "u");
      }
    }
  };
});

exports.default = _default;