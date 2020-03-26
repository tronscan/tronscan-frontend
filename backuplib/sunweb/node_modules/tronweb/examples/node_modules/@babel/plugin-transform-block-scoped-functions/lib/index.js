"use strict";

exports.__esModule = true;
exports.default = void 0;

var _helperPluginUtils = require("@babel/helper-plugin-utils");

var _core = require("@babel/core");

var _default = (0, _helperPluginUtils.declare)(function (api) {
  api.assertVersion(7);

  function statementList(key, path) {
    var paths = path.get(key);

    for (var _iterator = paths, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var _path2 = _ref;
      var func = _path2.node;
      if (!_path2.isFunctionDeclaration()) continue;

      var declar = _core.types.variableDeclaration("let", [_core.types.variableDeclarator(func.id, _core.types.toExpression(func))]);

      declar._blockHoist = 2;
      func.id = null;

      _path2.replaceWith(declar);
    }
  }

  return {
    visitor: {
      BlockStatement: function BlockStatement(path) {
        var node = path.node,
            parent = path.parent;

        if (_core.types.isFunction(parent, {
          body: node
        }) || _core.types.isExportDeclaration(parent)) {
          return;
        }

        statementList("body", path);
      },
      SwitchCase: function SwitchCase(path) {
        statementList("consequent", path);
      }
    }
  };
});

exports.default = _default;