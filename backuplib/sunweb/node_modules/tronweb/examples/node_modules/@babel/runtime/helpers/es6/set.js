import _Object$getPrototypeOf from "../../core-js/object/get-prototype-of";
import _Object$getOwnPropertyDescriptor from "../../core-js/object/get-own-property-descriptor";
export default function _set(object, property, value, receiver) {
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