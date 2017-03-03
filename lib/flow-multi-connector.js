'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _flowConnector = require('./flow-connector');

var _flowConnector2 = _interopRequireDefault(_flowConnector);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FlowMultiConnector = function (_FlowConnector) {
  _inherits(FlowMultiConnector, _FlowConnector);

  function FlowMultiConnector(settings) {
    _classCallCheck(this, FlowMultiConnector);

    var _this = _possibleConstructorReturn(this, (FlowMultiConnector.__proto__ || Object.getPrototypeOf(FlowMultiConnector)).call(this, settings));

    _this.connectors = {};
    return _this;
  }

  _createClass(FlowMultiConnector, [{
    key: 'addConnector',
    value: function addConnector(channels, connector) {
      if (!_lodash2.default.isArray(channels)) {
        channels = [channels];
      }
      for (var i = 0; i < channels.length; i++) {
        this.connectors[channels[i]] = connector;
      }
    }
  }, {
    key: 'getConnector',
    value: function getConnector(name) {
      return this.connectors[name] || this.connectors['default'];
    }
  }, {
    key: 'onEvent',
    value: function onEvent(handler) {
      _get(FlowMultiConnector.prototype.__proto__ || Object.getPrototypeOf(FlowMultiConnector.prototype), 'onEvent', this).call(this, handler);
      for (var name in this.connectors) {
        this.connectors[name].onEvent(handler);
      }
    }
  }, {
    key: 'onInvoke',
    value: function onInvoke(handler) {
      _get(FlowMultiConnector.prototype.__proto__ || Object.getPrototypeOf(FlowMultiConnector.prototype), 'onInvoke', this).call(this, handler);
      for (var name in this.connectors) {
        this.connectors[name].onInvoke(handler);
      }
    }
  }, {
    key: 'verify',
    value: function verify(name) {
      return this.getConnector(name).verify();
    }
  }, {
    key: 'listen',
    value: function listen(name) {
      return this.getConnector(name).listen();
    }
  }, {
    key: 'send',
    value: function send(messages, done) {
      var msg = _lodash2.default.isArray(messages) ? messages[0] : messages;
      var name = msg.address.channelId;
      return this.getConnector(name).send(messages, done);
    }
  }]);

  return FlowMultiConnector;
}(_flowConnector2.default);

exports.default = FlowMultiConnector;