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

// This plugin creates a build-manifest.json for all assets that are being output
// It has a mapping of "entry" filename to real filename. Because the real filename can be hashed in production
var BuildManifestPlugin =
/*#__PURE__*/
function () {
  function BuildManifestPlugin() {
    (0, _classCallCheck2.default)(this, BuildManifestPlugin);
  }

  (0, _createClass2.default)(BuildManifestPlugin, [{
    key: "apply",
    value: function apply(compiler) {
      compiler.plugin('emit', function (compilation, callback) {
        var chunks = compilation.chunks;
        var assetMap = {
          pages: {},
          css: []
        };
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = (0, _getIterator2.default)(chunks), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _chunk = _step.value;

            if (!_chunk.name || !_chunk.files) {
              continue;
            }

            var files = [];
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
              for (var _iterator2 = (0, _getIterator2.default)(_chunk.files), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var _file = _step2.value;

                if (/\.map$/.test(_file)) {
                  continue;
                }

                if (/\.hot-update\.js$/.test(_file)) {
                  continue;
                }

                if (/\.css$/.exec(_file)) {
                  assetMap.css.push(_file);
                  continue;
                }

                files.push(_file);
              }
            } catch (err) {
              _didIteratorError2 = true;
              _iteratorError2 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
                  _iterator2.return();
                }
              } finally {
                if (_didIteratorError2) {
                  throw _iteratorError2;
                }
              }
            }

            if (files.length > 0) {
              assetMap[_chunk.name] = files;
            }
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

        compilation.assets[_constants.BUILD_MANIFEST] = new _webpackSources.RawSource((0, _stringify.default)(assetMap));
        callback();
      });
    }
  }]);
  return BuildManifestPlugin;
}();

exports.default = BuildManifestPlugin;