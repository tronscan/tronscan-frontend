var _Object$getPrototypeOf = require("../core-js/object/get-prototype-of");

var _Object$getOwnPropertyDescriptor = require("../core-js/object/get-own-property-descriptor");

function _get(object, property, receiver) {
  if (object === null) object = Function.prototype;

  var desc = _Object$getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = _Object$getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return _get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
}

module.exports = _get;