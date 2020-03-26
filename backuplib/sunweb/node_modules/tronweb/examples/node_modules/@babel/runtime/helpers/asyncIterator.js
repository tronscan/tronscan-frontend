var _getIterator = require("../core-js/get-iterator");

var _Symbol$iterator = require("../core-js/symbol/iterator");

var _Symbol = require("../core-js/symbol");

function _asyncIterator(iterable) {
  if (typeof _Symbol === "function") {
    if (_Symbol.asyncIterator) {
      var method = iterable[_Symbol.asyncIterator];
      if (method != null) return method.call(iterable);
    }

    if (_Symbol$iterator) {
      return _getIterator(iterable);
    }
  }

  throw new TypeError("Object is not async iterable");
}

module.exports = _asyncIterator;