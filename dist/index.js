'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _tinyEmitter = require('tiny-emitter');

var _tinyEmitter2 = _interopRequireDefault(_tinyEmitter);

var _sniffer = require('@antinomy-studio/sniffer');

var _sniffer2 = _interopRequireDefault(_sniffer);

var _debounce = require('debounce');

var _debounce2 = _interopRequireDefault(_debounce);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var emitter = new _tinyEmitter2.default();
var EVENT_NAME = "resize";
var isClient = typeof window !== 'undefined' && window.document;
var debounced = void 0;

var Size = function () {
  function Size() {
    _classCallCheck(this, Size);

    this.width = 0;
    this.height = 0;
    this.hasBar = false;
  }

  _createClass(Size, [{
    key: 'addListener',
    value: function addListener(listener, context) {
      this.add(listener, context);
    }
  }, {
    key: 'add',
    value: function add(listener, context) {
      emitter.on(EVENT_NAME, listener, context);
    }
  }, {
    key: 'removeListener',
    value: function removeListener(listener, context) {
      this.remove(listener, context);
    }
  }, {
    key: 'remove',
    value: function remove(listener, context) {
      if (listener) emitter.off(EVENT_NAME, listener, context);
    }
  }, {
    key: 'bind',
    value: function bind(opts) {
      opts = opts || {};
      this.unbind();
      var debounceTime = opts.debounceTime || 150;
      debounced = (0, _debounce2.default)(onEvent, debounceTime);
      window.addEventListener(EVENT_NAME, debounced);
    }
  }, {
    key: 'unbind',
    value: function unbind() {
      window.removeEventListener(EVENT_NAME, debounced);
    }
  }]);

  return Size;
}();

var size = new Size();

var onEvent = function onEvent() {
  if (_sniffer2.default.isIos) {
    size.hasBar = size.width > size.height && size.height > window.innerHeight;
  }

  size.width = isClient ? window.innerWidth : 0;
  size.height = isClient ? window.innerHeight : 0;

  size.isLandscape = size.width > size.height;
  emitter.emit(EVENT_NAME, size.width, size.height);
};

if (isClient) {
  onEvent();
  size.bind();
}

exports.default = size;