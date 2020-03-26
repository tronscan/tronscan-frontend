"use strict";

exports.__esModule = true;
exports.default = void 0;

var _helperPluginUtils = require("@babel/helper-plugin-utils");

var _helperReplaceSupers = _interopRequireDefault(require("@babel/helper-replace-supers"));

var _core = require("@babel/core");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function replacePropertySuper(path, node, scope, getObjectRef, file) {
  var replaceSupers = new _helperReplaceSupers.default({
    getObjectRef: getObjectRef,
    methodNode: node,
    methodPath: path,
    isStatic: true,
    scope: scope,
    file: file
  });
  replaceSupers.replace();
}

var _default = (0, _helperPluginUtils.declare)(function (api) {
  api.assertVersion(7);
  return {
    visitor: {
      ObjectExpression: function ObjectExpression(path, state) {
        var objectRef;

        var getObjectRef = function getObjectRef() {
          return objectRef = objectRef || path.scope.generateUidIdentifier("obj");
        };

        path.get("properties").forEach(function (propertyPath) {
          if (!propertyPath.isMethod()) return;
          var propPaths = path.get("properties");

          for (var _iterator = propPaths, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
            var _ref;

            if (_isArray) {
              if (_i >= _iterator.length) break;
              _ref = _iterator[_i++];
            } else {
              _i = _iterator.next();
              if (_i.done) break;
              _ref = _i.value;
            }

            var _propPath = _ref;
            if (_propPath.isObjectProperty()) _propPath = _propPath.get("value");
            replacePropertySuper(_propPath, _propPath.node, path.scope, getObjectRef, state);
          }
        });

        if (objectRef) {
          path.scope.push({
            id: _core.types.cloneNode(objectRef)
          });
          path.replaceWith(_core.types.assignmentExpression("=", _core.types.cloneNode(objectRef), path.node));
        }
      }
    }
  };
});

exports.default = _default;