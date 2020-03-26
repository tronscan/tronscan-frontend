"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.applySourcemaps = applySourcemaps;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _promise = _interopRequireDefault(require("@babel/runtime/core-js/promise"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _unfetch = _interopRequireDefault(require("unfetch"));

var filenameRE = /\(([^)]+\.js):(\d+):(\d+)\)$/;

function applySourcemaps(_x) {
  return _applySourcemaps.apply(this, arguments);
}

function _applySourcemaps() {
  _applySourcemaps = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee(e) {
    var lines, result;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!(!e || typeof e.stack !== 'string' || e.sourceMapsApplied)) {
              _context.next = 2;
              break;
            }

            return _context.abrupt("return");

          case 2:
            lines = e.stack.split('\n');
            _context.next = 5;
            return _promise.default.all(lines.map(function (line) {
              return rewriteTraceLine(line);
            }));

          case 5:
            result = _context.sent;
            e.stack = result.join('\n'); // This is to make sure we don't apply the sourcemaps twice on the same object

            e.sourceMapsApplied = true;

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return _applySourcemaps.apply(this, arguments);
}

function rewriteTraceLine(_x2) {
  return _rewriteTraceLine.apply(this, arguments);
}

function _rewriteTraceLine() {
  _rewriteTraceLine = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee2(trace) {
    var m, filePath, mapPath, res, mapContents, _require, SourceMapConsumer, map, originalPosition, source, line, column, mappedPosition;

    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            m = trace.match(filenameRE);

            if (!(m == null)) {
              _context2.next = 3;
              break;
            }

            return _context2.abrupt("return", trace);

          case 3:
            filePath = m[1];

            if (!filePath.match(/node_modules/)) {
              _context2.next = 6;
              break;
            }

            return _context2.abrupt("return", trace);

          case 6:
            mapPath = "".concat(filePath, ".map");
            _context2.next = 9;
            return (0, _unfetch.default)(mapPath);

          case 9:
            res = _context2.sent;

            if (!(res.status !== 200)) {
              _context2.next = 12;
              break;
            }

            return _context2.abrupt("return", trace);

          case 12:
            _context2.next = 14;
            return res.json();

          case 14:
            mapContents = _context2.sent;
            _require = require('source-map'), SourceMapConsumer = _require.SourceMapConsumer;
            map = new SourceMapConsumer(mapContents);
            originalPosition = map.originalPositionFor({
              line: Number(m[2]),
              column: Number(m[3])
            });

            if (!(originalPosition.source != null)) {
              _context2.next = 22;
              break;
            }

            source = originalPosition.source, line = originalPosition.line, column = originalPosition.column;
            mappedPosition = "(".concat(source.replace(/^webpack:\/\/\//, ''), ":").concat(String(line), ":").concat(String(column), ")");
            return _context2.abrupt("return", trace.replace(filenameRE, mappedPosition));

          case 22:
            return _context2.abrupt("return", trace);

          case 23:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
  return _rewriteTraceLine.apply(this, arguments);
}