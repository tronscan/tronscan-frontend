"use strict";

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

const babel = require("@babel/core");

const promisify = require("util.promisify");

const LoaderError = require("./Error");

const transform = promisify(babel.transform);

module.exports =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(function* (source, options) {
    let result;

    try {
      result = yield transform(source, options);
    } catch (err) {
      throw err.message && err.codeFrame ? new LoaderError(err) : err;
    }

    if (!result) return null;
    const {
      code,
      map,
      metadata
    } = result;

    if (map && (!map.sourcesContent || !map.sourcesContent.length)) {
      map.sourcesContent = [source];
    }

    return {
      code,
      map,
      metadata
    };
  });

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

module.exports.version = babel.version;