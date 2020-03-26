"use strict";

exports.__esModule = true;
exports.default = void 0;

var _helperPluginUtils = require("@babel/helper-plugin-utils");

var _helperModuleTransforms = require("@babel/helper-module-transforms");

var _core = require("@babel/core");

var buildWrapper = (0, _core.template)("\n  define(MODULE_NAME, AMD_ARGUMENTS, function(IMPORT_NAMES) {\n  })\n");

var _default = (0, _helperPluginUtils.declare)(function (api, options) {
  api.assertVersion(7);
  var loose = options.loose,
      allowTopLevelThis = options.allowTopLevelThis,
      strict = options.strict,
      strictMode = options.strictMode,
      noInterop = options.noInterop;
  return {
    visitor: {
      Program: {
        exit: function exit(path) {
          if (!(0, _helperModuleTransforms.isModule)(path)) return;
          var moduleName = this.getModuleName();
          if (moduleName) moduleName = _core.types.stringLiteral(moduleName);

          var _rewriteModuleStateme = (0, _helperModuleTransforms.rewriteModuleStatementsAndPrepareHeader)(path, {
            loose: loose,
            strict: strict,
            strictMode: strictMode,
            allowTopLevelThis: allowTopLevelThis,
            noInterop: noInterop
          }),
              meta = _rewriteModuleStateme.meta,
              headers = _rewriteModuleStateme.headers;

          var amdArgs = [];
          var importNames = [];

          if ((0, _helperModuleTransforms.hasExports)(meta)) {
            amdArgs.push(_core.types.stringLiteral("exports"));
            importNames.push(_core.types.identifier(meta.exportName));
          }

          for (var _iterator = meta.source, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
            var _ref2;

            if (_isArray) {
              if (_i >= _iterator.length) break;
              _ref2 = _iterator[_i++];
            } else {
              _i = _iterator.next();
              if (_i.done) break;
              _ref2 = _i.value;
            }

            var _ref3 = _ref2;
            var _source = _ref3[0];
            var _metadata = _ref3[1];
            amdArgs.push(_core.types.stringLiteral(_source));
            importNames.push(_core.types.identifier(_metadata.name));

            if (!(0, _helperModuleTransforms.isSideEffectImport)(_metadata)) {
              var interop = (0, _helperModuleTransforms.wrapInterop)(path, _core.types.identifier(_metadata.name), _metadata.interop);

              if (interop) {
                var header = _core.types.expressionStatement(_core.types.assignmentExpression("=", _core.types.identifier(_metadata.name), interop));

                header.loc = _metadata.loc;
                headers.push(header);
              }
            }

            headers.push.apply(headers, (0, _helperModuleTransforms.buildNamespaceInitStatements)(meta, _metadata, loose));
          }

          (0, _helperModuleTransforms.ensureStatementsHoisted)(headers);
          path.unshiftContainer("body", headers);
          var _path$node = path.node,
              body = _path$node.body,
              directives = _path$node.directives;
          path.node.directives = [];
          path.node.body = [];
          var amdWrapper = path.pushContainer("body", [buildWrapper({
            MODULE_NAME: moduleName,
            AMD_ARGUMENTS: _core.types.arrayExpression(amdArgs),
            IMPORT_NAMES: importNames
          })])[0];
          var amdFactory = amdWrapper.get("expression.arguments").filter(function (arg) {
            return arg.isFunctionExpression();
          })[0].get("body");
          amdFactory.pushContainer("directives", directives);
          amdFactory.pushContainer("body", body);
        }
      }
    }
  };
});

exports.default = _default;