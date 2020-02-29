"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _promise = _interopRequireDefault(require("@babel/runtime/core-js/promise"));

var _symbol = _interopRequireDefault(require("@babel/runtime/core-js/symbol"));

var kCustomPromisifyArgsSymbol = (0, _symbol.default)('customPromisifyArgs');

module.exports = function promisify(original) {
  // Names to create an object from in case the callback receives multiple
  // arguments, e.g. ['stdout', 'stderr'] for child_process.exec.
  var argumentNames = original[kCustomPromisifyArgsSymbol];
  return function fn() {
    var _this = this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return new _promise.default(function (resolve, reject) {
      try {
        original.call.apply(original, [_this].concat(args, [function (err) {
          if (err) {
            reject(err);
          } else if (argumentNames !== undefined && (arguments.length <= 1 ? 0 : arguments.length - 1) > 1) {
            var obj = {};

            for (var i = 0; i < argumentNames.length; i++) {
              obj[argumentNames[i]] = i + 1 < 1 || arguments.length <= i + 1 ? undefined : arguments[i + 1];
            }

            resolve(obj);
          } else {
            resolve(arguments.length <= 1 ? undefined : arguments[1]);
          }
        }]));
      } catch (err) {
        reject(err);
      }
    });
  };
};