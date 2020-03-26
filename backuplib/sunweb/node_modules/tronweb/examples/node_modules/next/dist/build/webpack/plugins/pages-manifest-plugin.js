"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _getIterator2 = _interopRequireDefault(require("@babel/runtime/core-js/get-iterator"));

var _stringify = _interopRequireDefault(require("@babel/runtime/core-js/json/stringify"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _webpackSources = require("webpack-sources");

var _constants = require("../../../lib/constants");

// This plugin creates a pages-manifest.json from page entrypoints.
// This is used for mapping paths like `/` to `.next/dist/bundles/pages/index.js` when doing SSR
// It's also used by next export to provide defaultPathMap
var PagesManifestPlugin =
/*#__PURE__*/
function () {
  function PagesManifestPlugin() {
    (0, _classCallCheck2.default)(this, PagesManifestPlugin);
  }

  (0, _createClass2.default)(PagesManifestPlugin, [{
    key: "apply",
    value: function apply(compiler) {
      compiler.plugin('emit', function (compilation, callback) {
        var entries = compilation.entries;
        var pages = {};
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = (0, _getIterator2.default)(entries), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _entry = _step.value;

            var result = _constants.ROUTE_NAME_REGEX.exec(_entry.name);

            if (!result) {
              continue;
            }

            var pagePath = result[1];

            if (!pagePath) {
              continue;
            }

            var name = _entry.name;
            pages["/".concat(pagePath.replace(/\\/g, '/'))] = name;
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        if (typeof pages['/index'] !== 'undefined') {
          pages['/'] = pages['/index'];
        }

        compilation.assets[_constants.PAGES_MANIFEST] = new _webpackSources.RawSource((0, _stringify.default)(pages));
        callback();
      });
    }
  }]);
  return PagesManifestPlugin;
}();

exports.default = PagesManifestPlugin;