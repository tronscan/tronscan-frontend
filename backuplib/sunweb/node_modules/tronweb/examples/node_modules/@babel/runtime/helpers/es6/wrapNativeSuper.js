import _Object$create from "../../core-js/object/create";
import _Map from "../../core-js/map";
import _Reflect$construct from "../../core-js/reflect/construct";
import _typeof from "../../helpers/es6/typeof";
import _Object$setPrototypeOf from "../../core-js/object/set-prototype-of";
import _Object$getPrototypeOf from "../../core-js/object/get-prototype-of";

function _gPO(o) {
  _gPO = _Object$getPrototypeOf || function _gPO(o) {
    return o.__proto__;
  };

  return _gPO(o);
}

function _sPO(o, p) {
  _sPO = _Object$setPrototypeOf || function _sPO(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _sPO(o, p);
}

function _construct(Parent, args, Class) {
  _construct = (typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && _Reflect$construct || function _construct(Parent, args, Class) {
    var Constructor,
        a = [null];
    a.push.apply(a, args);
    Constructor = Parent.bind.apply(Parent, a);
    return _sPO(new Constructor(), Class.prototype);
  };

  return _construct(Parent, args, Class);
}

export default function _wrapNativeSuper(Class) {
  var _cache = typeof _Map === "function" ? new _Map() : undefined;

  _wrapNativeSuper = function _wrapNativeSuper(Class) {
    if (typeof Class !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }

    if (typeof _cache !== "undefined") {
      if (_cache.has(Class)) return _cache.get(Class);

      _cache.set(Class, Wrapper);
    }

    function Wrapper() {}

    Wrapper.prototype = _Object$create(Class.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    return _sPO(Wrapper, _sPO(function Super() {
      return _construct(Class, arguments, _gPO(this).constructor);
    }, Class));
  };

  return _wrapNativeSuper(Class);
}