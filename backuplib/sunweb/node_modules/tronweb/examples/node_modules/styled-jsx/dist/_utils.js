'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.booleanOption = exports.processCss = exports.combinePlugins = exports.addSourceMaps = exports.makeSourceMapGenerator = exports.makeStyledJsxTag = exports.cssToBabelType = exports.templateLiteralFromPreprocessedCss = exports.computeClassNames = exports.getJSXStyleInfo = exports.validateExternalExpressions = exports.isDynamic = exports.validateExpressionVisitor = exports.findStyles = exports.isStyledJsx = exports.isGlobalEl = exports.getScope = exports.addClassName = exports.hashString = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _babelTypes = require('babel-types');

var t = _interopRequireWildcard(_babelTypes);

var _stringHash = require('string-hash');

var _stringHash2 = _interopRequireDefault(_stringHash);

var _sourceMap = require('source-map');

var _convertSourceMap = require('convert-source-map');

var _convertSourceMap2 = _interopRequireDefault(_convertSourceMap);

var _styleTransform = require('./lib/style-transform');

var _styleTransform2 = _interopRequireDefault(_styleTransform);

var _constants = require('./_constants');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var concat = function concat(a, b) {
  return t.binaryExpression('+', a, b);
};
var and = function and(a, b) {
  return t.logicalExpression('&&', a, b);
};
var or = function or(a, b) {
  return t.logicalExpression('||', a, b);
};

var joinSpreads = function joinSpreads(spreads) {
  return spreads.reduce(function (acc, curr) {
    return or(acc, curr);
  });
};

var hashString = exports.hashString = function hashString(str) {
  return String((0, _stringHash2.default)(str));
};

var addClassName = exports.addClassName = function addClassName(path, jsxId) {
  var jsxIdWithSpace = concat(jsxId, t.stringLiteral(' '));
  var attributes = path.get('attributes');
  var spreads = [];
  var className = null;
  // Find className and collect spreads
  for (var i = attributes.length - 1, attr; attr = attributes[i]; i--) {
    var node = attr.node;
    if (t.isJSXSpreadAttribute(attr)) {
      var name = node.argument.name;
      var attrNameDotClassName = t.memberExpression(t.isMemberExpression(node.argument) ? node.argument : t.identifier(name), t.identifier('className'));

      spreads.push(
      // `${name}.className != null && ${name}.className`
      and(t.binaryExpression('!=', attrNameDotClassName, t.nullLiteral()), attrNameDotClassName));
      continue;
    }
    if (t.isJSXAttribute(attr) && node.name.name === 'className') {
      className = attributes[i];
      // found className break the loop
      break;
    }
  }

  if (className) {
    var newClassName = className.node.value.expression || className.node.value;
    newClassName = t.isStringLiteral(newClassName) || t.isTemplateLiteral(newClassName) ? newClassName : or(newClassName, t.stringLiteral(''));
    className.remove();

    className = t.jSXExpressionContainer(spreads.length === 0 ? concat(jsxIdWithSpace, newClassName) : concat(jsxIdWithSpace, or(joinSpreads(spreads), newClassName)));
  } else {
    className = t.jSXExpressionContainer(spreads.length === 0 ? jsxId : concat(jsxIdWithSpace, or(joinSpreads(spreads), t.stringLiteral(''))));
  }

  path.node.attributes.push(t.jSXAttribute(t.jSXIdentifier('className'), className));
};

var getScope = exports.getScope = function getScope(path) {
  return (path.findParent(function (path) {
    return path.isFunctionDeclaration() || path.isArrowFunctionExpression() || path.isClassMethod();
  }) || path).scope;
};

var isGlobalEl = exports.isGlobalEl = function isGlobalEl(el) {
  return el.attributes.some(function (_ref) {
    var name = _ref.name;
    return name && name.name === _constants.GLOBAL_ATTRIBUTE;
  });
};

var isStyledJsx = exports.isStyledJsx = function isStyledJsx(_ref2) {
  var el = _ref2.node;
  return t.isJSXElement(el) && el.openingElement.name.name === 'style' && el.openingElement.attributes.some(function (attr) {
    return attr.name.name === _constants.STYLE_ATTRIBUTE;
  });
};

var findStyles = exports.findStyles = function findStyles(path) {
  if (isStyledJsx(path)) {
    var node = path.node;

    return isGlobalEl(node.openingElement) ? [path] : [];
  }

  return path.get('children').filter(isStyledJsx);
};

// The following visitor ensures that MemberExpressions and Identifiers
// are not in the scope of the current Method (render) or function (Component).
var validateExpressionVisitor = exports.validateExpressionVisitor = {
  MemberExpression: function MemberExpression(path, scope) {
    var node = path.node;

    if (t.isIdentifier(node.property) && t.isThisExpression(node.object) && (node.property.name === 'props' || node.property.name === 'state' || node.property.name === 'context') || t.isIdentifier(node.object) && scope.hasOwnBinding(node.object.name)) {
      throw path.buildCodeFrameError('Expected a constant ' + 'as part of the template literal expression ' + '(eg: <style jsx>{`p { color: ${myColor}`}</style>), ' + ('but got a MemberExpression: this.' + node.property.name));
    }
  },
  Identifier: function Identifier(path, scope) {
    var name = path.node.name;


    if (t.isMemberExpression(path.parentPath) && scope.hasOwnBinding(name)) {
      return;
    }

    var targetScope = path.scope;
    var isDynamicBinding = false;

    // Traversing scope chain in order to find current variable.
    // If variable has no parent scope and it's `const` then we can interp. it
    // as static in order to optimize styles.
    // `let` and `var` can be changed during runtime.
    while (targetScope) {
      if (targetScope.hasOwnBinding(name)) {
        var binding = targetScope.bindings[name];
        isDynamicBinding = binding.scope.parent !== null || binding.kind !== 'const';
        break;
      }
      targetScope = targetScope.parent;
    }

    if (isDynamicBinding) {
      throw path.buildCodeFrameError('Expected `' + name + '` ' + 'to not come from the closest scope.\n' + 'Styled JSX encourages the use of constants ' + 'instead of `props` or dynamic values ' + 'which are better set via inline styles or `className` toggling. ' + 'See https://github.com/zeit/styled-jsx#dynamic-styles');
    }
  }
};

// Use `validateExpressionVisitor` to determine whether the `expr`ession has dynamic values.
var isDynamic = exports.isDynamic = function isDynamic(expr, scope) {
  try {
    expr.traverse(validateExpressionVisitor, scope);
    return false;
  } catch (err) {}

  return true;
};

var validateExternalExpressionsVisitor = {
  Identifier: function Identifier(path) {
    if (t.isMemberExpression(path.parentPath)) {
      return;
    }
    var name = path.node.name;

    if (!path.scope.hasBinding(name)) {
      throw path.buildCodeFrameError(path.getSource());
    }
  },
  MemberExpression: function MemberExpression(path) {
    var node = path.node;

    if (!t.isIdentifier(node.object)) {
      return;
    }
    if (!path.scope.hasBinding(node.object.name)) {
      throw path.buildCodeFrameError(path.getSource());
    }
  },
  ThisExpression: function ThisExpression(path) {
    throw new Error(path.parentPath.getSource());
  }
};

var validateExternalExpressions = exports.validateExternalExpressions = function validateExternalExpressions(path) {
  try {
    path.traverse(validateExternalExpressionsVisitor);
  } catch (err) {
    throw path.buildCodeFrameError('\n      Found an `undefined` or invalid value in your styles: `' + err.message + '`.\n\n      If you are trying to use dynamic styles in external files this is unfortunately not possible yet.\n      Please put the dynamic parts alongside the component. E.g.\n\n      <button>\n        <style jsx>{externalStylesReference}</style>\n        <style jsx>{`\n          button { background-color: ${' + err.message + '} }\n        `}</style>\n      </button>\n    ');
  }
};

var getJSXStyleInfo = exports.getJSXStyleInfo = function getJSXStyleInfo(expr, scope) {
  var node = expr.node;

  var location = node.loc;

  // Assume string literal
  if (t.isStringLiteral(node)) {
    return {
      hash: hashString(node.value),
      css: node.value,
      expressions: [],
      dynamic: false,
      location: location
    };
  }

  // Simple template literal without expressions
  if (node.expressions.length === 0) {
    return {
      hash: hashString(node.quasis[0].value.cooked),
      css: node.quasis[0].value.cooked,
      expressions: [],
      dynamic: false,
      location: location
    };
  }

  // Special treatment for template literals that contain expressions:
  //
  // Expressions are replaced with a placeholder
  // so that the CSS compiler can parse and
  // transform the css source string
  // without having to know about js literal expressions.
  // Later expressions are restored.
  //
  // e.g.
  // p { color: ${myConstant}; }
  // becomes
  // p { color: %%styled-jsx-placeholder-${id}%%; }

  var quasis = node.quasis,
      expressions = node.expressions;

  var hash = hashString(expr.getSource().slice(1, -1));
  var dynamic = scope ? isDynamic(expr, scope) : false;
  var css = quasis.reduce(function (css, quasi, index) {
    return '' + css + quasi.value.cooked + (quasis.length === index + 1 ? '' : '%%styled-jsx-placeholder-' + index + '%%');
  }, '');

  return {
    hash: hash,
    css: css,
    expressions: expressions,
    dynamic: dynamic,
    location: location
  };
};

var computeClassNames = exports.computeClassNames = function computeClassNames(styles, externalJsxId) {
  if (styles.length === 0) {
    return {
      className: externalJsxId
    };
  }

  var hashes = styles.reduce(function (acc, styles) {
    if (styles.dynamic === false) {
      acc.static.push(styles.hash);
    } else {
      acc.dynamic.push(styles);
    }
    return acc;
  }, {
    static: [],
    dynamic: []
  });

  var staticClassName = 'jsx-' + hashString(hashes.static.join(','));

  // Static and optionally external classes. E.g.
  // '[jsx-externalClasses] jsx-staticClasses'
  if (hashes.dynamic.length === 0) {
    return {
      staticClassName: staticClassName,
      className: externalJsxId ? concat(t.stringLiteral(staticClassName + ' '), externalJsxId) : t.stringLiteral(staticClassName)
    };
  }

  // _JSXStyle.dynamic([ ['1234', [props.foo, bar, fn(props)]], ... ])
  var dynamic = t.callExpression(
  // Callee: _JSXStyle.dynamic
  t.memberExpression(t.identifier(_constants.STYLE_COMPONENT), t.identifier('dynamic')),
  // Arguments
  [t.arrayExpression(hashes.dynamic.map(function (styles) {
    return t.arrayExpression([t.stringLiteral(hashString(styles.hash + staticClassName)), t.arrayExpression(styles.expressions)]);
  }))]);

  // Dynamic and optionally external classes. E.g.
  // '[jsx-externalClasses] ' + _JSXStyle.dynamic([ ['1234', [props.foo, bar, fn(props)]], ... ])
  if (hashes.static.length === 0) {
    return {
      staticClassName: staticClassName,
      className: externalJsxId ? concat(concat(externalJsxId, t.stringLiteral(' ')), dynamic) : dynamic
    };
  }

  // Static, dynamic and optionally external classes. E.g.
  // '[jsx-externalClasses] jsx-staticClasses ' + _JSXStyle.dynamic([ ['5678', [props.foo, bar, fn(props)]], ... ])
  return {
    staticClassName: staticClassName,
    className: externalJsxId ? concat(concat(externalJsxId, t.stringLiteral(' ' + staticClassName + ' ')), dynamic) : concat(t.stringLiteral(staticClassName + ' '), dynamic)
  };
};

var templateLiteralFromPreprocessedCss = exports.templateLiteralFromPreprocessedCss = function templateLiteralFromPreprocessedCss(css, expressions) {
  var quasis = [];
  var finalExpressions = [];
  var parts = css.split(/(?:%%styled-jsx-placeholder-(\d+)%%)/g);

  if (parts.length === 1) {
    return t.stringLiteral(css);
  }

  parts.forEach(function (part, index) {
    if (index % 2 > 0) {
      // This is necessary because, after preprocessing, declarations might have been alterate.
      // eg. properties are auto prefixed and therefore expressions need to match.
      finalExpressions.push(expressions[part]);
    } else {
      quasis.push(part);
    }
  });

  return t.templateLiteral(quasis.map(function (quasi, index) {
    return t.templateElement({
      raw: quasi,
      cooked: quasi
    }, quasis.length === index + 1);
  }), finalExpressions);
};

var cssToBabelType = exports.cssToBabelType = function cssToBabelType(css) {
  if (typeof css === 'string') {
    return t.stringLiteral(css);
  } else if (Array.isArray(css)) {
    return t.arrayExpression(css);
  }

  return css;
};

var makeStyledJsxTag = exports.makeStyledJsxTag = function makeStyledJsxTag(id, transformedCss) {
  var expressions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  var css = cssToBabelType(transformedCss);

  var attributes = [t.jSXAttribute(t.jSXIdentifier(_constants.STYLE_COMPONENT_ID), t.jSXExpressionContainer(typeof id === 'string' ? t.stringLiteral(id) : id)), t.jSXAttribute(t.jSXIdentifier(_constants.STYLE_COMPONENT_CSS), t.jSXExpressionContainer(css))];

  if (expressions.length > 0) {
    attributes.push(t.jSXAttribute(t.jSXIdentifier(_constants.STYLE_COMPONENT_DYNAMIC), t.jSXExpressionContainer(t.arrayExpression(expressions))));
  }

  return t.jSXElement(t.jSXOpeningElement(t.jSXIdentifier(_constants.STYLE_COMPONENT), attributes, true), null, []);
};

var makeSourceMapGenerator = exports.makeSourceMapGenerator = function makeSourceMapGenerator(file) {
  var filename = file.opts.sourceFileName;
  var generator = new _sourceMap.SourceMapGenerator({
    file: filename,
    sourceRoot: file.opts.sourceRoot
  });

  generator.setSourceContent(filename, file.code);
  return generator;
};

var addSourceMaps = exports.addSourceMaps = function addSourceMaps(code, generator, filename) {
  var sourceMaps = [_convertSourceMap2.default.fromObject(generator).toComment({ multiline: true }), '/*@ sourceURL=' + filename + ' */'];

  if (Array.isArray(code)) {
    return code.concat(sourceMaps);
  }

  return [code].concat(sourceMaps).join('\n');
};

var combinePlugins = exports.combinePlugins = function combinePlugins(plugins) {
  if (!plugins) {
    return function (css) {
      return css;
    };
  }

  if (!Array.isArray(plugins) || plugins.some(function (p) {
    return !Array.isArray(p) && typeof p !== 'string';
  })) {
    throw new Error('`plugins` must be an array of plugins names (string) or an array `[plugin-name, {options}]`');
  }

  return plugins.map(function (plugin, i) {
    var options = {};
    if (Array.isArray(plugin)) {
      options = plugin[1] || {};
      plugin = plugin[0];
      if (Object.prototype.hasOwnProperty.call(options, 'babel')) {
        throw new Error('\n            Error while trying to register the styled-jsx plugin: ' + plugin + '\n            The option name `babel` is reserved.\n          ');
      }
    }

    // eslint-disable-next-line import/no-dynamic-require
    var p = require(plugin);
    if (p.default) {
      p = p.default;
    }

    var type = typeof p === 'undefined' ? 'undefined' : (0, _typeof3.default)(p);
    if (type !== 'function') {
      throw new Error('Expected plugin ' + plugins[i] + ' to be a function but instead got ' + type);
    }
    return {
      plugin: p,
      options: options
    };
  }).reduce(function (previous, _ref3) {
    var plugin = _ref3.plugin,
        options = _ref3.options;
    return function (css, babelOptions) {
      return plugin(previous ? previous(css, babelOptions) : css, (0, _extends3.default)({}, options, {
        babel: babelOptions
      }));
    };
  }, null);
};

var getPrefix = function getPrefix(isDynamic, id) {
  return isDynamic ? '.__jsx-style-dynamic-selector' : '.' + id;
};

var processCss = exports.processCss = function processCss(stylesInfo, options) {
  var hash = stylesInfo.hash,
      css = stylesInfo.css,
      expressions = stylesInfo.expressions,
      dynamic = stylesInfo.dynamic,
      location = stylesInfo.location,
      fileInfo = stylesInfo.fileInfo,
      isGlobal = stylesInfo.isGlobal,
      plugins = stylesInfo.plugins,
      vendorPrefixes = stylesInfo.vendorPrefixes;


  var staticClassName = stylesInfo.staticClassName || 'jsx-' + hashString(hash);

  var splitRules = options.splitRules;


  var useSourceMaps = Boolean(fileInfo.sourceMaps) && !splitRules;

  var pluginsOptions = {
    location: {
      start: (0, _extends3.default)({}, location.start),
      end: (0, _extends3.default)({}, location.end)
    },
    vendorPrefixes: vendorPrefixes,
    sourceMaps: useSourceMaps,
    isGlobal: isGlobal,
    filename: fileInfo.filename
  };

  var transformedCss = void 0;

  if (useSourceMaps) {
    var generator = makeSourceMapGenerator(fileInfo.file);
    var filename = fileInfo.sourceFileName;
    transformedCss = addSourceMaps((0, _styleTransform2.default)(isGlobal ? '' : getPrefix(dynamic, staticClassName), plugins(css, pluginsOptions), {
      generator: generator,
      offset: location.start,
      filename: filename,
      splitRules: splitRules,
      vendorPrefixes: vendorPrefixes
    }), generator, filename);
  } else {
    transformedCss = (0, _styleTransform2.default)(isGlobal ? '' : getPrefix(dynamic, staticClassName), plugins(css, pluginsOptions), { splitRules: splitRules, vendorPrefixes: vendorPrefixes });
  }

  if (expressions.length > 0) {
    if (typeof transformedCss === 'string') {
      transformedCss = templateLiteralFromPreprocessedCss(transformedCss, expressions);
    } else {
      transformedCss = transformedCss.map(function (transformedCss) {
        return templateLiteralFromPreprocessedCss(transformedCss, expressions);
      });
    }
  } else if (Array.isArray(transformedCss)) {
    transformedCss = transformedCss.map(function (transformedCss) {
      return t.stringLiteral(transformedCss);
    });
  }

  return {
    hash: dynamic ? hashString(hash + staticClassName) : hashString(hash),
    css: transformedCss,
    expressions: dynamic && expressions
  };
};

var booleanOption = exports.booleanOption = function booleanOption(opts) {
  var ret = void 0;
  opts.some(function (opt) {
    if (typeof opt === 'boolean') {
      ret = opt;
      return true;
    }
    return false;
  });
  return ret;
};