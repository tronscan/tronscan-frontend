"use strict";

exports.__esModule = true;
exports.default = void 0;

var _helperPluginUtils = require("@babel/helper-plugin-utils");

var _helperHoistVariables = _interopRequireDefault(require("@babel/helper-hoist-variables"));

var _core = require("@babel/core");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var buildTemplate = (0, _core.template)("\n  SYSTEM_REGISTER(MODULE_NAME, SOURCES, function (EXPORT_IDENTIFIER, CONTEXT_IDENTIFIER) {\n    \"use strict\";\n    BEFORE_BODY;\n    return {\n      setters: SETTERS,\n      execute: function () {\n        BODY;\n      }\n    };\n  });\n");
var buildExportAll = (0, _core.template)("\n  for (var KEY in TARGET) {\n    if (KEY !== \"default\" && KEY !== \"__esModule\") EXPORT_OBJ[KEY] = TARGET[KEY];\n  }\n");
var TYPE_IMPORT = "Import";

var _default = (0, _helperPluginUtils.declare)(function (api, options) {
  api.assertVersion(7);
  var _options$systemGlobal = options.systemGlobal,
      systemGlobal = _options$systemGlobal === void 0 ? "System" : _options$systemGlobal;
  var IGNORE_REASSIGNMENT_SYMBOL = Symbol();
  var reassignmentVisitor = {
    "AssignmentExpression|UpdateExpression": function AssignmentExpressionUpdateExpression(path) {
      if (path.node[IGNORE_REASSIGNMENT_SYMBOL]) return;
      path.node[IGNORE_REASSIGNMENT_SYMBOL] = true;
      var arg = path.get(path.isAssignmentExpression() ? "left" : "argument");
      if (!arg.isIdentifier()) return;
      var name = arg.node.name;
      if (this.scope.getBinding(name) !== path.scope.getBinding(name)) return;
      var exportedNames = this.exports[name];
      if (!exportedNames) return;
      var node = path.node;
      var isPostUpdateExpression = path.isUpdateExpression() && !node.prefix;

      if (isPostUpdateExpression) {
        if (node.operator === "++") {
          node = _core.types.binaryExpression("+", _core.types.cloneNode(node.argument), _core.types.numericLiteral(1));
        } else if (node.operator === "--") {
          node = _core.types.binaryExpression("-", _core.types.cloneNode(node.argument), _core.types.numericLiteral(1));
        } else {
          isPostUpdateExpression = false;
        }
      }

      for (var _iterator = exportedNames, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref;

        if (_isArray) {
          if (_i >= _iterator.length) break;
          _ref = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          _ref = _i.value;
        }

        var _exportedName = _ref;
        node = this.buildCall(_exportedName, node).expression;
      }

      if (isPostUpdateExpression) {
        node = _core.types.sequenceExpression([node, path.node]);
      }

      path.replaceWith(node);
    }
  };
  return {
    visitor: {
      CallExpression: function CallExpression(path, state) {
        if (path.node.callee.type === TYPE_IMPORT) {
          path.replaceWith(_core.types.callExpression(_core.types.memberExpression(_core.types.identifier(state.contextIdent), _core.types.identifier("import")), path.node.arguments));
        }
      },
      ReferencedIdentifier: function ReferencedIdentifier(path, state) {
        if (path.node.name == "__moduleName" && !path.scope.hasBinding("__moduleName")) {
          path.replaceWith(_core.types.memberExpression(_core.types.identifier(state.contextIdent), _core.types.identifier("id")));
        }
      },
      Program: {
        enter: function enter(path, state) {
          state.contextIdent = path.scope.generateUid("context");
        },
        exit: function exit(path, state) {
          var exportIdent = path.scope.generateUid("export");
          var contextIdent = state.contextIdent;
          var exportNames = Object.create(null);
          var modules = [];
          var beforeBody = [];
          var setters = [];
          var sources = [];
          var variableIds = [];
          var removedPaths = [];

          function addExportName(key, val) {
            exportNames[key] = exportNames[key] || [];
            exportNames[key].push(val);
          }

          function pushModule(source, key, specifiers) {
            var module;
            modules.forEach(function (m) {
              if (m.key === source) {
                module = m;
              }
            });

            if (!module) {
              modules.push(module = {
                key: source,
                imports: [],
                exports: []
              });
            }

            module[key] = module[key].concat(specifiers);
          }

          function buildExportCall(name, val) {
            return _core.types.expressionStatement(_core.types.callExpression(_core.types.identifier(exportIdent), [_core.types.stringLiteral(name), val]));
          }

          var body = path.get("body");
          var canHoist = true;

          for (var _iterator2 = body, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
            var _ref2;

            if (_isArray2) {
              if (_i2 >= _iterator2.length) break;
              _ref2 = _iterator2[_i2++];
            } else {
              _i2 = _iterator2.next();
              if (_i2.done) break;
              _ref2 = _i2.value;
            }

            var _path4 = _ref2;
            if (_path4.isExportDeclaration()) _path4 = _path4.get("declaration");

            if (_path4.isVariableDeclaration() && _path4.node.kind !== "var") {
              canHoist = false;
              break;
            }
          }

          for (var _iterator3 = body, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
            var _ref3;

            if (_isArray3) {
              if (_i3 >= _iterator3.length) break;
              _ref3 = _iterator3[_i3++];
            } else {
              _i3 = _iterator3.next();
              if (_i3.done) break;
              _ref3 = _i3.value;
            }

            var _path5 = _ref3;

            if (canHoist && _path5.isFunctionDeclaration()) {
              beforeBody.push(_path5.node);
              removedPaths.push(_path5);
            } else if (_path5.isImportDeclaration()) {
              var source = _path5.node.source.value;
              pushModule(source, "imports", _path5.node.specifiers);

              for (var name in _path5.getBindingIdentifiers()) {
                _path5.scope.removeBinding(name);

                variableIds.push(_core.types.identifier(name));
              }

              _path5.remove();
            } else if (_path5.isExportAllDeclaration()) {
              pushModule(_path5.node.source.value, "exports", _path5.node);

              _path5.remove();
            } else if (_path5.isExportDefaultDeclaration()) {
              var declar = _path5.get("declaration");

              if (declar.isClassDeclaration() || declar.isFunctionDeclaration()) {
                var id = declar.node.id;
                var nodes = [];

                if (id) {
                  nodes.push(declar.node);
                  nodes.push(buildExportCall("default", _core.types.cloneNode(id)));
                  addExportName(id.name, "default");
                } else {
                  nodes.push(buildExportCall("default", _core.types.toExpression(declar.node)));
                }

                if (!canHoist || declar.isClassDeclaration()) {
                  _path5.replaceWithMultiple(nodes);
                } else {
                  beforeBody = beforeBody.concat(nodes);
                  removedPaths.push(_path5);
                }
              } else {
                _path5.replaceWith(buildExportCall("default", declar.node));
              }
            } else if (_path5.isExportNamedDeclaration()) {
              var _declar = _path5.get("declaration");

              if (_declar.node) {
                _path5.replaceWith(_declar);

                var _nodes = [];
                var bindingIdentifiers = void 0;

                if (_path5.isFunction()) {
                  var node = _declar.node;
                  var _name = node.id.name;

                  if (canHoist) {
                    addExportName(_name, _name);
                    beforeBody.push(node);
                    beforeBody.push(buildExportCall(_name, _core.types.cloneNode(node.id)));
                    removedPaths.push(_path5);
                  } else {
                    var _bindingIdentifiers;

                    bindingIdentifiers = (_bindingIdentifiers = {}, _bindingIdentifiers[_name] = node.id, _bindingIdentifiers);
                  }
                } else {
                  bindingIdentifiers = _declar.getBindingIdentifiers();
                }

                for (var _name2 in bindingIdentifiers) {
                  addExportName(_name2, _name2);

                  _nodes.push(buildExportCall(_name2, _core.types.identifier(_name2)));
                }

                _path5.insertAfter(_nodes);
              } else {
                var specifiers = _path5.node.specifiers;

                if (specifiers && specifiers.length) {
                  if (_path5.node.source) {
                    pushModule(_path5.node.source.value, "exports", specifiers);

                    _path5.remove();
                  } else {
                    var _nodes2 = [];

                    for (var _iterator6 = specifiers, _isArray6 = Array.isArray(_iterator6), _i7 = 0, _iterator6 = _isArray6 ? _iterator6 : _iterator6[Symbol.iterator]();;) {
                      var _ref6;

                      if (_isArray6) {
                        if (_i7 >= _iterator6.length) break;
                        _ref6 = _iterator6[_i7++];
                      } else {
                        _i7 = _iterator6.next();
                        if (_i7.done) break;
                        _ref6 = _i7.value;
                      }

                      var _specifier2 = _ref6;

                      _nodes2.push(buildExportCall(_specifier2.exported.name, _specifier2.local));

                      addExportName(_specifier2.local.name, _specifier2.exported.name);
                    }

                    _path5.replaceWithMultiple(_nodes2);
                  }
                }
              }
            }
          }

          modules.forEach(function (specifiers) {
            var setterBody = [];
            var target = path.scope.generateUid(specifiers.key);

            for (var _iterator4 = specifiers.imports, _isArray4 = Array.isArray(_iterator4), _i4 = 0, _iterator4 = _isArray4 ? _iterator4 : _iterator4[Symbol.iterator]();;) {
              var _ref4;

              if (_isArray4) {
                if (_i4 >= _iterator4.length) break;
                _ref4 = _iterator4[_i4++];
              } else {
                _i4 = _iterator4.next();
                if (_i4.done) break;
                _ref4 = _i4.value;
              }

              var _specifier = _ref4;

              if (_core.types.isImportNamespaceSpecifier(_specifier)) {
                setterBody.push(_core.types.expressionStatement(_core.types.assignmentExpression("=", _specifier.local, _core.types.identifier(target))));
              } else if (_core.types.isImportDefaultSpecifier(_specifier)) {
                _specifier = _core.types.importSpecifier(_specifier.local, _core.types.identifier("default"));
              }

              if (_core.types.isImportSpecifier(_specifier)) {
                setterBody.push(_core.types.expressionStatement(_core.types.assignmentExpression("=", _specifier.local, _core.types.memberExpression(_core.types.identifier(target), _specifier.imported))));
              }
            }

            if (specifiers.exports.length) {
              var exportObj = path.scope.generateUid("exportObj");
              setterBody.push(_core.types.variableDeclaration("var", [_core.types.variableDeclarator(_core.types.identifier(exportObj), _core.types.objectExpression([]))]));

              for (var _iterator5 = specifiers.exports, _isArray5 = Array.isArray(_iterator5), _i5 = 0, _iterator5 = _isArray5 ? _iterator5 : _iterator5[Symbol.iterator]();;) {
                var _ref5;

                if (_isArray5) {
                  if (_i5 >= _iterator5.length) break;
                  _ref5 = _iterator5[_i5++];
                } else {
                  _i5 = _iterator5.next();
                  if (_i5.done) break;
                  _ref5 = _i5.value;
                }

                var _node = _ref5;

                if (_core.types.isExportAllDeclaration(_node)) {
                  setterBody.push(buildExportAll({
                    KEY: path.scope.generateUidIdentifier("key"),
                    EXPORT_OBJ: _core.types.identifier(exportObj),
                    TARGET: _core.types.identifier(target)
                  }));
                } else if (_core.types.isExportSpecifier(_node)) {
                  setterBody.push(_core.types.expressionStatement(_core.types.assignmentExpression("=", _core.types.memberExpression(_core.types.identifier(exportObj), _node.exported), _core.types.memberExpression(_core.types.identifier(target), _node.local))));
                } else {}
              }

              setterBody.push(_core.types.expressionStatement(_core.types.callExpression(_core.types.identifier(exportIdent), [_core.types.identifier(exportObj)])));
            }

            sources.push(_core.types.stringLiteral(specifiers.key));
            setters.push(_core.types.functionExpression(null, [_core.types.identifier(target)], _core.types.blockStatement(setterBody)));
          });
          var moduleName = this.getModuleName();
          if (moduleName) moduleName = _core.types.stringLiteral(moduleName);

          if (canHoist) {
            (0, _helperHoistVariables.default)(path, function (id) {
              return variableIds.push(id);
            });
          }

          if (variableIds.length) {
            beforeBody.unshift(_core.types.variableDeclaration("var", variableIds.map(function (id) {
              return _core.types.variableDeclarator(id);
            })));
          }

          path.traverse(reassignmentVisitor, {
            exports: exportNames,
            buildCall: buildExportCall,
            scope: path.scope
          });

          for (var _i6 = 0; _i6 < removedPaths.length; _i6++) {
            var _path3 = removedPaths[_i6];

            _path3.remove();
          }

          path.node.body = [buildTemplate({
            SYSTEM_REGISTER: _core.types.memberExpression(_core.types.identifier(systemGlobal), _core.types.identifier("register")),
            BEFORE_BODY: beforeBody,
            MODULE_NAME: moduleName,
            SETTERS: _core.types.arrayExpression(setters),
            SOURCES: _core.types.arrayExpression(sources),
            BODY: path.node.body,
            EXPORT_IDENTIFIER: _core.types.identifier(exportIdent),
            CONTEXT_IDENTIFIER: _core.types.identifier(contextIdent)
          })];
        }
      }
    }
  };
});

exports.default = _default;