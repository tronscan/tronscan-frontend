"use strict";

exports.__esModule = true;
exports.default = void 0;

var _helperPluginUtils = require("@babel/helper-plugin-utils");

var _core = require("@babel/core");

var _default = (0, _helperPluginUtils.declare)(function (api) {
  api.assertVersion(7);
  return {
    visitor: {
      Scope: function Scope(_ref) {
        var scope = _ref.scope;

        if (!scope.getBinding("Symbol")) {
          return;
        }

        scope.rename("Symbol");
      },
      UnaryExpression: function UnaryExpression(path) {
        var node = path.node,
            parent = path.parent;
        if (node.operator !== "typeof") return;

        if (path.parentPath.isBinaryExpression() && _core.types.EQUALITY_BINARY_OPERATORS.indexOf(parent.operator) >= 0) {
          var opposite = path.getOpposite();

          if (opposite.isLiteral() && opposite.node.value !== "symbol" && opposite.node.value !== "object") {
            return;
          }
        }

        var helper = this.addHelper("typeof");
        var isUnderHelper = path.findParent(function (path) {
          return path.isVariableDeclarator() && path.node.id === helper || path.isFunctionDeclaration() && path.node.id && path.node.id.name === helper.name;
        });

        if (isUnderHelper) {
          return;
        }

        var call = _core.types.callExpression(helper, [node.argument]);

        var arg = path.get("argument");

        if (arg.isIdentifier() && !path.scope.hasBinding(arg.node.name, true)) {
          var unary = _core.types.unaryExpression("typeof", _core.types.cloneNode(node.argument));

          path.replaceWith(_core.types.conditionalExpression(_core.types.binaryExpression("===", unary, _core.types.stringLiteral("undefined")), _core.types.stringLiteral("undefined"), call));
        } else {
          path.replaceWith(call);
        }
      }
    }
  };
});

exports.default = _default;