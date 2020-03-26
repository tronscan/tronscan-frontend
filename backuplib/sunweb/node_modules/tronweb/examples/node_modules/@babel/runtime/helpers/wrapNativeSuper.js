var _Object$create = require("../core-js/object/create");

var _Map = require("../core-js/map");

var _Reflect$construct = require("../core-js/reflect/construct");

var _typeof = require("../helpers/typeof");

var _Object$setPrototypeOf = require("../core-js/object/set-prototype-of");

var _Object$getPrototypeOf = require("../core-js/object/get-prototype-of");

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

function _wrapNativeSuper(Class) {
  var _cache = typeof _Map === "function" ? new _Map() : undefined;

  module.exports = _wrapNativeSuper = function _wrapNativeSuper(Class) {
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

module.exports = _wrapNativeSuper;