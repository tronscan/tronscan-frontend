"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _webpackSources = require("webpack-sources");

var _constants = require("../../../lib/constants");

var PageChunkTemplatePlugin =
/*#__PURE__*/
function () {
  function PageChunkTemplatePlugin() {
    (0, _classCallCheck2.default)(this, PageChunkTemplatePlugin);
  }

  (0, _createClass2.default)(PageChunkTemplatePlugin, [{
    key: "apply",
    value: function apply(chunkTemplate) {
      chunkTemplate.plugin('render', function (modules, chunk) {
        if (!_constants.IS_BUNDLED_PAGE_REGEX.test(chunk.name)) {
          return modules;
        }

        var routeName = _constants.ROUTE_NAME_REGEX.exec(chunk.name)[1]; // We need to convert \ into / when we are in windows
        // to get the proper route name
        // Here we need to do windows check because it's possible
        // to have "\" in the filename in unix.
        // Anyway if someone did that, he'll be having issues here.
        // But that's something we cannot avoid.


        if (/^win/.test(process.platform)) {
          routeName = routeName.replace(/\\/g, '/');
        }

        routeName = "/".concat(routeName.replace(/(^|\/)index$/, ''));
        var source = new _webpackSources.ConcatSource();
        source.add("__NEXT_REGISTER_PAGE('".concat(routeName, "', function() {\n          var comp =\n      "));
        source.add(modules);
        source.add("\n          return { page: comp.default }\n        })\n      ");
        return source;
      });
    }
  }]);
  return PageChunkTemplatePlugin;
}();

var PagesPlugin =
/*#__PURE__*/
function () {
  function PagesPlugin() {
    (0, _classCallCheck2.default)(this, PagesPlugin);
  }

  (0, _createClass2.default)(PagesPlugin, [{
    key: "apply",
    value: function apply(compiler) {
      compiler.plugin('compilation', function (compilation) {
        compilation.chunkTemplate.apply(new PageChunkTemplatePlugin());
      });
    }
  }]);
  return PagesPlugin;
}();

exports.default = PagesPlugin;