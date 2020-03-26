"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = withSideEffect;

var _getPrototypeOf = _interopRequireDefault(require("@babel/runtime/core-js/object/get-prototype-of"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _set = _interopRequireDefault(require("@babel/runtime/core-js/set"));

var _react = _interopRequireWildcard(require("react"));

var _utils = require("./utils");

function withSideEffect(reduceComponentsToState, handleStateChangeOnClient, mapStateOnServer) {
  if (typeof reduceComponentsToState !== 'function') {
    throw new Error('Expected reduceComponentsToState to be a function.');
  }

  if (typeof handleStateChangeOnClient !== 'function') {
    throw new Error('Expected handleStateChangeOnClient to be a function.');
  }

  if (typeof mapStateOnServer !== 'undefined' && typeof mapStateOnServer !== 'function') {
    throw new Error('Expected mapStateOnServer to either be undefined or a function.');
  }

  return function wrap(WrappedComponent) {
    if (typeof WrappedComponent !== 'function') {
      throw new Error('Expected WrappedComponent to be a React component.');
    }

    var mountedInstances = new _set.default();
    var state;

    function emitChange(component) {
      state = reduceComponentsToState((0, _toConsumableArray2.default)(mountedInstances));

      if (SideEffect.canUseDOM) {
        handleStateChangeOnClient.call(component, state);
      } else if (mapStateOnServer) {
        state = mapStateOnServer(state);
      }
    }

    var SideEffect =
    /*#__PURE__*/
    function (_Component) {
      (0, _inherits2.default)(SideEffect, _Component);

      function SideEffect() {
        (0, _classCallCheck2.default)(this, SideEffect);
        return (0, _possibleConstructorReturn2.default)(this, (SideEffect.__proto__ || (0, _getPrototypeOf.default)(SideEffect)).apply(this, arguments));
      }

      (0, _createClass2.default)(SideEffect, [{
        key: "componentWillMount",
        value: function componentWillMount() {
          mountedInstances.add(this);
          emitChange(this);
        }
      }, {
        key: "componentDidUpdate",
        value: function componentDidUpdate() {
          emitChange(this);
        }
      }, {
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
          mountedInstances.delete(this);
          emitChange(this);
        }
      }, {
        key: "render",
        value: function render() {
          return _react.default.createElement(WrappedComponent, null, this.props.children);
        }
      }], [{
        key: "peek",
        // Try to use displayName of wrapped component
        // Expose canUseDOM so tests can monkeypatch it
        value: function peek() {
          return state;
        }
      }, {
        key: "rewind",
        value: function rewind() {
          if (SideEffect.canUseDOM) {
            throw new Error('You may only call rewind() on the server. Call peek() to read the current state.');
          }

          var recordedState = state;
          state = undefined;
          mountedInstances.clear();
          return recordedState;
        }
      }]);
      return SideEffect;
    }(_react.Component);

    Object.defineProperty(SideEffect, "displayName", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: "SideEffect(".concat((0, _utils.getDisplayName)(WrappedComponent), ")")
    });
    Object.defineProperty(SideEffect, "contextTypes", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: WrappedComponent.contextTypes
    });
    Object.defineProperty(SideEffect, "canUseDOM", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: typeof window !== 'undefined'
    });
    return SideEffect;
  };
}