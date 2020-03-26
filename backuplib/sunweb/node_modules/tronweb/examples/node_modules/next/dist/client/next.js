"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var next = _interopRequireWildcard(require("./"));

window.next = next;
(0, next.default)().catch(function (err) {
  console.error("".concat(err.message, "\n").concat(err.stack));
});