"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getModulePath = getModulePath;
exports.default = void 0;

var _template = _interopRequireDefault(require("@babel/template"));

var _pluginSyntaxDynamicImport = _interopRequireDefault(require("@babel/plugin-syntax-dynamic-import"));

var _path = require("path");

var _crypto = _interopRequireDefault(require("crypto"));

// Based on https://github.com/airbnb/babel-plugin-dynamic-import-webpack
// We've added support for SSR with this version
var TYPE_IMPORT = 'Import';
/*
 Added "typeof require.resolveWeak !== 'function'" check instead of
 "typeof window === 'undefined'" to support dynamic impports in non-webpack environments.
 "require.resolveWeak" and "require.ensure" are webpack specific methods.
 They would fail in Node/CommonJS environments.
*/

var buildImport = function buildImport(args) {
  return (0, _template.default)("\n  (\n    typeof require.resolveWeak !== 'function' ?\n      new (require('next/dynamic').SameLoopPromise)((resolve, reject) => {\n        eval('require.ensure = function (deps, callback) { callback(require) }')\n        require.ensure([], (require) => {\n          let m = require(SOURCE)\n          m.__webpackChunkName = '".concat(args.name, ".js'\n          resolve(m);\n        }, 'chunks/").concat(args.name, ".js');\n      })\n      :\n      new (require('next/dynamic').SameLoopPromise)((resolve, reject) => {\n        const weakId = require.resolveWeak(SOURCE)\n        try {\n          const weakModule = __webpack_require__(weakId)\n          return resolve(weakModule)\n        } catch (err) {}\n\n        require.ensure([], (require) => {\n          try {\n            let m = require(SOURCE)\n            m.__webpackChunkName = '").concat(args.name, "'\n            resolve(m)\n          } catch(error) {\n            reject(error)\n          }\n        }, 'chunks/").concat(args.name, "');\n      })\n  )\n"));
};

function getModulePath(sourceFilename, moduleName) {
  // resolve only if it's a local module
  var modulePath = moduleName[0] === '.' ? (0, _path.resolve)((0, _path.dirname)(sourceFilename), moduleName) : moduleName;
  var cleanedModulePath = modulePath.replace(/(index){0,1}\.js$/, '') // remove .js, index.js
  .replace(/[/\\]$/, ''); // remove end slash

  return cleanedModulePath;
}

var _default = function _default() {
  return {
    inherits: _pluginSyntaxDynamicImport.default,
    visitor: {
      CallExpression: function CallExpression(path, state) {
        if (path.node.callee.type === TYPE_IMPORT) {
          var moduleName = path.node.arguments[0].value;
          var sourceFilename = state.file.opts.filename;
          var modulePath = getModulePath(sourceFilename, moduleName);

          var modulePathHash = _crypto.default.createHash('md5').update(modulePath).digest('hex');

          var relativeModulePath = modulePath.replace("".concat(process.cwd()).concat(_path.sep), '');
          var name = "".concat(relativeModulePath.replace(/[^\w]/g, '_'), "_").concat(modulePathHash);
          var newImport = buildImport({
            name: name
          })({
            SOURCE: path.node.arguments
          });
          path.replaceWith(newImport);
        }
      }
    }
  };
};

exports.default = _default;