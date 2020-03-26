import _getIterator from "../../core-js/get-iterator";
import _Symbol$iterator from "../../core-js/symbol/iterator";
import _Symbol from "../../core-js/symbol";
export default function _asyncIterator(iterable) {
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