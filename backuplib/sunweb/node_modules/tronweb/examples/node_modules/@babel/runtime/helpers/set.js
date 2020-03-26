var _Object$getPrototypeOf = require("../core-js/object/get-prototype-of");

var _Object$getOwnPropertyDescriptor = require("../core-js/object/get-own-property-descriptor");

function _set(object, property, value, receiver) {
  var desc = _Object$getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = _Object$getPrototypeOf(object);

    if (parent !== null) {
      _set(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
}

module.exports = _set;