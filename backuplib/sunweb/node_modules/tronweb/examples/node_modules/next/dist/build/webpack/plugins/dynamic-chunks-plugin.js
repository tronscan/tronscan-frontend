"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _webpackSources = require("webpack-sources");

var isImportChunk = /^chunks[/\\]/;
var matchChunkName = /^chunks[/\\](.*)$/;

var DynamicChunkTemplatePlugin =
/*#__PURE__*/
function () {
  function DynamicChunkTemplatePlugin() {
    (0, _classCallCheck2.default)(this, DynamicChunkTemplatePlugin);
  }

  (0, _createClass2.default)(DynamicChunkTemplatePlugin, [{
    key: "apply",
    value: function apply(chunkTemplate) {
      chunkTemplate.plugin('render', function (modules, chunk) {
        if (!isImportChunk.test(chunk.name)) {
          return modules;
        }

        var chunkName = matchChunkName.exec(chunk.name)[1];
        var source = new _webpackSources.ConcatSource();
        source.add("\n        __NEXT_REGISTER_CHUNK('".concat(chunkName, "', function() {\n      "));
        source.add(modules);
        source.add("\n        })\n      ");
        return source;
      });
    }
  }]);
  return DynamicChunkTemplatePlugin;
}();

var DynamicChunksPlugin =
/*#__PURE__*/
function () {
  function DynamicChunksPlugin() {
    (0, _classCallCheck2.default)(this, DynamicChunksPlugin);
  }

  (0, _createClass2.default)(DynamicChunksPlugin, [{
    key: "apply",
    value: function apply(compiler) {
      compiler.plugin('compilation', function (compilation) {
        compilation.chunkTemplate.apply(new DynamicChunkTemplatePlugin());
        compilation.plugin('additional-chunk-assets', function (chunks) {
          chunks = chunks.filter(function (chunk) {
            return isImportChunk.test(chunk.name) && compilation.assets[chunk.name];
          });
          chunks.forEach(function (chunk) {
            // This is to support, webpack dynamic import support with HMR
            var copyFilename = "chunks/".concat(chunk.name);
            compilation.additionalChunkAssets.push(copyFilename);
            compilation.assets[copyFilename] = compilation.assets[chunk.name];
          });
        });
      });
    }
  }]);
  return DynamicChunksPlugin;
}();

exports.default = DynamicChunksPlugin;