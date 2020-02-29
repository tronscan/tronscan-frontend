'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.visitor = undefined;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports.default = function () {
  return (0, _extends3.default)({
    Program: function Program(path, state) {
      var vendorPrefix = (0, _utils.booleanOption)([state.opts.vendorPrefix, state.file.opts.vendorPrefix]);
      state.opts.vendorPrefix = typeof vendorPrefix === 'boolean' ? vendorPrefix : true;
      var sourceMaps = (0, _utils.booleanOption)([state.opts.sourceMaps, state.file.opts.sourceMaps]);
      state.opts.sourceMaps = Boolean(sourceMaps);

      if (!state.plugins) {
        var _state$opts2 = state.opts,
            _sourceMaps = _state$opts2.sourceMaps,
            _vendorPrefix = _state$opts2.vendorPrefix;

        state.plugins = (0, _utils.combinePlugins)(state.opts.plugins, {
          sourceMaps: _sourceMaps || state.file.opts.sourceMaps,
          vendorPrefix: typeof _vendorPrefix === 'boolean' ? _vendorPrefix : true
        });
      }
    }
  }, visitor);
};

var _babelTypes = require('babel-types');

var t = _interopRequireWildcard(_babelTypes);

var _utils = require('./_utils');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isModuleExports = t.buildMatchMemberExpression('module.exports');

function processTaggedTemplateExpression(_ref) {
  var path = _ref.path,
      fileInfo = _ref.fileInfo,
      splitRules = _ref.splitRules,
      plugins = _ref.plugins,
      vendorPrefix = _ref.vendorPrefix;

  var templateLiteral = path.get('quasi');

  // Check whether there are undefined references or references to this.something (e.g. props or state)
  (0, _utils.validateExternalExpressions)(templateLiteral);

  var stylesInfo = (0, _utils.getJSXStyleInfo)(templateLiteral);

  var globalStyles = (0, _utils.processCss)((0, _extends3.default)({}, stylesInfo, {
    hash: stylesInfo.hash + '0',
    fileInfo: fileInfo,
    isGlobal: true,
    plugins: plugins,
    vendorPrefix: vendorPrefix
  }), { splitRules: splitRules });

  var scopedStyles = (0, _utils.processCss)((0, _extends3.default)({}, stylesInfo, {
    hash: stylesInfo.hash + '1',
    fileInfo: fileInfo,
    isGlobal: false,
    plugins: plugins,
    vendorPrefix: vendorPrefix
  }), { splitRules: splitRules });

  var id = path.parentPath.node.id;
  var baseExportName = id ? id.name : 'default';
  var parentPath = baseExportName === 'default' ? path.parentPath : path.findParent(function (path) {
    return path.isVariableDeclaration() || path.isAssignmentExpression() && isModuleExports(path.get('left').node);
  });

  if (baseExportName !== 'default' && !parentPath.parentPath.isProgram()) {
    parentPath = parentPath.parentPath;
  }

  var hashesAndScoped = {
    hash: globalStyles.hash,
    scoped: (0, _utils.cssToBabelType)(scopedStyles.css),
    scopedHash: scopedStyles.hash
  };

  var globalCss = (0, _utils.cssToBabelType)(globalStyles.css);

  // default exports

  if (baseExportName === 'default') {
    var defaultExportIdentifier = path.scope.generateUidIdentifier('defaultExport');
    parentPath.insertBefore(t.variableDeclaration('const', [t.variableDeclarator(defaultExportIdentifier, t.isArrayExpression(globalCss) ? globalCss : t.newExpression(t.identifier('String'), [globalCss]))]));
    parentPath.insertBefore(makeHashesAndScopedCssPaths(defaultExportIdentifier, hashesAndScoped));
    path.replaceWith(defaultExportIdentifier);
    return;
  }

  // named exports

  parentPath.insertAfter(makeHashesAndScopedCssPaths(t.identifier(baseExportName), hashesAndScoped));
  path.replaceWith(t.isArrayExpression(globalCss) ? globalCss : t.newExpression(t.identifier('String'), [globalCss]));
}

function makeHashesAndScopedCssPaths(exportIdentifier, data) {
  return (0, _keys2.default)(data).map(function (key) {
    var value = typeof data[key] === 'string' ? t.stringLiteral(data[key]) : data[key];

    return t.expressionStatement(t.assignmentExpression('=', t.memberExpression(exportIdentifier, t.identifier('__' + key)), value));
  });
}

var visitor = exports.visitor = {
  ImportDeclaration: function ImportDeclaration(path, state) {
    if (path.node.source.value !== 'styled-jsx/css') {
      return;
    }

    var tagName = path.node.specifiers[0].local.name;
    var binding = path.scope.getBinding(tagName);

    if (!binding || !Array.isArray(binding.referencePaths)) {
      return;
    }

    var taggedTemplateExpressions = binding.referencePaths.map(function (ref) {
      return ref.parentPath;
    }).filter(function (path) {
      return path.isTaggedTemplateExpression();
    });

    if (taggedTemplateExpressions.length === 0) {
      return;
    }

    var _state$opts = state.opts,
        vendorPrefix = _state$opts.vendorPrefix,
        sourceMaps = _state$opts.sourceMaps;


    taggedTemplateExpressions.forEach(function (path) {
      processTaggedTemplateExpression({
        path: path,
        fileInfo: {
          file: state.file,
          sourceFileName: state.file.opts.sourceFileName,
          sourceMaps: sourceMaps
        },
        splitRules: typeof state.opts.optimizeForSpeed === 'boolean' ? state.opts.optimizeForSpeed : process.env.NODE_ENV === 'production',
        plugins: state.plugins,
        vendorPrefix: vendorPrefix
      });
    });

    // Finally remove the import
    path.remove();
  }
};