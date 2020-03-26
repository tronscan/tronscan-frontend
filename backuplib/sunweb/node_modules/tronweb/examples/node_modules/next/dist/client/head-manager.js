"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _promise = _interopRequireDefault(require("@babel/runtime/core-js/promise"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var DEFAULT_TITLE = '';
var DOMAttributeNames = {
  acceptCharset: 'accept-charset',
  className: 'class',
  htmlFor: 'for',
  httpEquiv: 'http-equiv'
};

var HeadManager =
/*#__PURE__*/
function () {
  function HeadManager() {
    (0, _classCallCheck2.default)(this, HeadManager);
    this.updatePromise = null;
  }

  (0, _createClass2.default)(HeadManager, [{
    key: "updateHead",
    value: function updateHead(head) {
      var _this = this;

      var promise = this.updatePromise = _promise.default.resolve().then(function () {
        if (promise !== _this.updatePromise) return;
        _this.updatePromise = null;

        _this.doUpdateHead(head);
      });
    }
  }, {
    key: "doUpdateHead",
    value: function doUpdateHead(head) {
      var _this2 = this;

      var tags = {};
      head.forEach(function (h) {
        var components = tags[h.type] || [];
        components.push(h);
        tags[h.type] = components;
      });
      this.updateTitle(tags.title ? tags.title[0] : null);
      var types = ['meta', 'base', 'link', 'style', 'script'];
      types.forEach(function (type) {
        _this2.updateElements(type, tags[type] || []);
      });
    }
  }, {
    key: "updateTitle",
    value: function updateTitle(component) {
      var title;

      if (component) {
        var children = component.props.children;
        title = typeof children === 'string' ? children : children.join('');
      } else {
        title = DEFAULT_TITLE;
      }

      if (title !== document.title) document.title = title;
    }
  }, {
    key: "updateElements",
    value: function updateElements(type, components) {
      var headEl = document.getElementsByTagName('head')[0];
      var oldTags = Array.prototype.slice.call(headEl.querySelectorAll(type + '.next-head'));
      var newTags = components.map(reactElementToDOM).filter(function (newTag) {
        for (var i = 0, len = oldTags.length; i < len; i++) {
          var oldTag = oldTags[i];

          if (oldTag.isEqualNode(newTag)) {
            oldTags.splice(i, 1);
            return false;
          }
        }

        return true;
      });
      oldTags.forEach(function (t) {
        return t.parentNode.removeChild(t);
      });
      newTags.forEach(function (t) {
        return headEl.appendChild(t);
      });
    }
  }]);
  return HeadManager;
}();

exports.default = HeadManager;

function reactElementToDOM(_ref) {
  var type = _ref.type,
      props = _ref.props;
  var el = document.createElement(type);

  for (var p in props) {
    if (!props.hasOwnProperty(p)) continue;
    if (p === 'children' || p === 'dangerouslySetInnerHTML') continue;
    var attr = DOMAttributeNames[p] || p.toLowerCase();
    el.setAttribute(attr, props[p]);
  }

  var children = props.children,
      dangerouslySetInnerHTML = props.dangerouslySetInnerHTML;

  if (dangerouslySetInnerHTML) {
    el.innerHTML = dangerouslySetInnerHTML.__html || '';
  } else if (children) {
    el.textContent = typeof children === 'string' ? children : children.join('');
  }

  return el;
}