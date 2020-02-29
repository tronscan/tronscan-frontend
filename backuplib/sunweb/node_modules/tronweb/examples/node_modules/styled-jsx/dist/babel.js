'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports.default = function (_ref) {
  var t = _ref.types;

  return {
    inherits: _babelPluginSyntaxJsx2.default,
    visitor: (0, _extends3.default)({
      JSXOpeningElement: function JSXOpeningElement(path, state) {
        var el = path.node;

        var _ref2 = el.name || {},
            name = _ref2.name;

        if (!state.hasJSXStyle) {
          return;
        }

        if (state.ignoreClosing === null) {
          // We keep a counter of elements inside so that we
          // can keep track of when we exit the parent to reset state
          // note: if we wished to add an option to turn off
          // selectors to reach parent elements, it would suffice to
          // set this to `1` and do an early return instead
          state.ignoreClosing = 0;
        }

        if (name && name !== 'style' && name !== _constants.STYLE_COMPONENT && name.charAt(0) !== name.charAt(0).toUpperCase()) {
          if (state.className) {
            (0, _utils.addClassName)(path, state.className);
          }
        }

        state.ignoreClosing++;
        // Next visit will be: JSXElement exit()
      },

      JSXElement: {
        enter: function enter(path, state) {
          if (state.hasJSXStyle !== null) {
            return;
          }

          var styles = (0, _utils.findStyles)(path);

          if (styles.length === 0) {
            return;
          }

          state.styles = [];
          state.externalStyles = [];

          var scope = (0, _utils.getScope)(path);

          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = (0, _getIterator3.default)(styles), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var style = _step.value;

              // Compute children excluding whitespace
              var children = style.get('children').filter(function (c) {
                return t.isJSXExpressionContainer(c.node) ||
                // Ignore whitespace around the expression container
                t.isJSXText(c.node) && c.node.value.trim() !== '';
              });

              if (children.length !== 1) {
                throw path.buildCodeFrameError('Expected one child under ' + ('JSX Style tag, but got ' + children.length + ' ') + '(eg: <style jsx>{`hi`}</style>)');
              }

              var child = children[0];

              if (!t.isJSXExpressionContainer(child)) {
                throw path.buildCodeFrameError('Expected a child of ' + 'type JSXExpressionContainer under JSX Style tag ' + ('(eg: <style jsx>{`hi`}</style>), got ' + child.type));
              }

              var expression = child.get('expression');

              if (t.isIdentifier(expression)) {
                var idName = expression.node.name;
                if (expression.scope.hasBinding(idName)) {
                  var externalStylesIdentifier = t.identifier(idName);
                  var isGlobal = (0, _utils.isGlobalEl)(style.get('openingElement').node);
                  state.externalStyles.push([t.memberExpression(externalStylesIdentifier, t.identifier(isGlobal ? '__hash' : '__scopedHash')), externalStylesIdentifier, isGlobal]);
                  continue;
                }

                throw path.buildCodeFrameError('The Identifier ' + ('`' + expression.getSource() + '` is either `undefined` or ') + 'it is not an external StyleSheet reference i.e. ' + 'it doesn\'t come from an `import` or `require` statement');
              }

              if (!t.isTemplateLiteral(expression) && !t.isStringLiteral(expression)) {
                throw path.buildCodeFrameError('Expected a template ' + 'literal or String literal as the child of the ' + 'JSX Style tag (eg: <style jsx>{`some css`}</style>),' + (' but got ' + expression.type));
              }

              state.styles.push((0, _utils.getJSXStyleInfo)(expression, scope));
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }

          var externalJsxId = void 0;
          if (state.externalStyles.length > 0) {
            var expressions = state.externalStyles
            // Remove globals
            .filter(function (s) {
              return !s[2];
            }).map(function (s) {
              return s[0];
            });

            var expressionsLength = expressions.length;

            if (expressionsLength === 0) {
              externalJsxId = null;
            } else {
              // Construct a template literal of this form:
              // `jsx-${styles.__scopedHash} jsx-${otherStyles.__scopedHash}`
              externalJsxId = t.templateLiteral([t.templateElement({ raw: 'jsx-', cooked: 'jsx-' })].concat((0, _toConsumableArray3.default)([].concat((0, _toConsumableArray3.default)(new Array(expressionsLength - 1))).map(function () {
                return t.templateElement({ raw: ' jsx-', cooked: ' jsx-' });
              })), [t.templateElement({ raw: '', cooked: '' }, true)]), expressions);
            }
          }

          if (state.styles.length > 0 || externalJsxId) {
            var _computeClassNames = (0, _utils.computeClassNames)(state.styles, externalJsxId),
                staticClassName = _computeClassNames.staticClassName,
                className = _computeClassNames.className;

            state.className = className;
            state.staticClassName = staticClassName;
          }

          state.hasJSXStyle = true;
          state.file.hasJSXStyle = true;
          // Next visit will be: JSXOpeningElement
        },
        exit: function exit(path, state) {
          var isGlobal = (0, _utils.isGlobalEl)(path.node.openingElement);
          if (state.hasJSXStyle && ! --state.ignoreClosing && !isGlobal) {
            state.hasJSXStyle = null;
            state.className = null;
            state.externalJsxId = null;
          }

          if (!state.hasJSXStyle || !(0, _utils.isStyledJsx)(path)) {
            return;
          }

          if (state.ignoreClosing > 1) {
            var styleTagSrc = void 0;
            try {
              styleTagSrc = path.getSource();
            } catch (err) {}
            throw path.buildCodeFrameError('Detected nested style tag' + (styleTagSrc ? ': \n\n' + styleTagSrc + '\n\n' : ' ') + 'styled-jsx only allows style tags ' + 'to be direct descendants (children) of the outermost ' + 'JSX element i.e. the subtree root.');
          }

          if (state.externalStyles.length > 0 && path.get('children').filter(function (child) {
            if (!t.isJSXExpressionContainer(child)) {
              return false;
            }
            var expression = child.get('expression');
            return expression && expression.isIdentifier();
          }).length === 1) {
            var _state$externalStyles = state.externalStyles.shift(),
                _state$externalStyles2 = (0, _slicedToArray3.default)(_state$externalStyles, 3),
                id = _state$externalStyles2[0],
                _css = _state$externalStyles2[1],
                _isGlobal = _state$externalStyles2[2];

            path.replaceWith((0, _utils.makeStyledJsxTag)(id, _isGlobal ? _css : t.memberExpression(t.identifier(_css.name), t.identifier('__scoped'))));
            return;
          }

          var _state$opts = state.opts,
              vendorPrefixes = _state$opts.vendorPrefixes,
              sourceMaps = _state$opts.sourceMaps;

          var stylesInfo = (0, _extends3.default)({}, state.styles.shift(), {
            fileInfo: {
              file: state.file,
              sourceFileName: state.file.opts.sourceFileName || state.file.sourceFileName,
              sourceMaps: sourceMaps,
              filename: state.file.opts.filename || state.file.filename
            },
            staticClassName: state.staticClassName,
            isGlobal: isGlobal,
            plugins: state.plugins,
            vendorPrefixes: vendorPrefixes
          });
          var splitRules = typeof state.opts.optimizeForSpeed === 'boolean' ? state.opts.optimizeForSpeed : process.env.NODE_ENV === 'production';

          var _processCss = (0, _utils.processCss)(stylesInfo, {
            splitRules: splitRules
          }),
              hash = _processCss.hash,
              css = _processCss.css,
              expressions = _processCss.expressions;

          path.replaceWith((0, _utils.makeStyledJsxTag)(hash, css, expressions));
        }
      },
      Program: {
        enter: function enter(path, state) {
          state.hasJSXStyle = null;
          state.ignoreClosing = null;
          state.file.hasJSXStyle = false;

          var vendorPrefixes = (0, _utils.booleanOption)([state.opts.vendorPrefixes, state.file.opts.vendorPrefixes]);
          state.opts.vendorPrefixes = typeof vendorPrefixes === 'boolean' ? vendorPrefixes : true;
          var sourceMaps = (0, _utils.booleanOption)([state.opts.sourceMaps, state.file.opts.sourceMaps]);
          state.opts.sourceMaps = Boolean(sourceMaps);

          if (!state.plugins) {
            state.plugins = (0, _utils.combinePlugins)(state.opts.plugins, {
              sourceMaps: state.opts.sourceMaps,
              vendorPrefixes: state.opts.vendorPrefixes
            });
          }
        },
        exit: function exit(_ref3, state) {
          var node = _ref3.node,
              scope = _ref3.scope;

          if (!(state.file.hasJSXStyle && !scope.hasBinding(_constants.STYLE_COMPONENT))) {
            return;
          }

          var importDeclaration = t.importDeclaration([t.importDefaultSpecifier(t.identifier(_constants.STYLE_COMPONENT))], t.stringLiteral('styled-jsx/style'));

          node.body.unshift(importDeclaration);
        }
      }

    }, _babelExternal.visitor)
  };
};

var _babelPluginSyntaxJsx = require('babel-plugin-syntax-jsx');

var _babelPluginSyntaxJsx2 = _interopRequireDefault(_babelPluginSyntaxJsx);

var _babelExternal = require('./babel-external');

var _utils = require('./_utils');

var _constants = require('./_constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }