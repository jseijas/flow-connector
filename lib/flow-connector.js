'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FlowConnector = function () {
  function FlowConnector(settings) {
    _classCallCheck(this, FlowConnector);

    this.settings = settings || {};
    this.initialization();
  }

  _createClass(FlowConnector, [{
    key: 'initialization',
    value: function initialization() {}
  }, {
    key: 'retrieveBody',
    value: function retrieveBody(req, cb) {
      if (req.method !== 'POST') {
        return cb();
      }
      if (req.body) {
        return cb();
      }
      var requestData = '';
      req.on('data', function (chunk) {
        requestData += chunk;
      });
      req.on('end', function () {
        req.body = JSON.parse(requestData);
        return cb();
      });
    }
  }, {
    key: 'validateBody',
    value: function validateBody(req, res, cb) {
      cb();
    }
  }, {
    key: 'onEvent',
    value: function onEvent(handler) {
      this.onEventHandler = handler;
    }
  }, {
    key: 'onInvoke',
    value: function onInvoke(handler) {
      this.onInvokeHandler = handler;
    }
  }, {
    key: 'verifyRequest',
    value: function verifyRequest(req, res, cb) {
      res.status(200);
      res.end();
      cb();
    }
  }, {
    key: 'verify',
    value: function verify() {
      return function (req, res) {
        _async2.default.series([this.retrieveBody.bind(this, req), this.verifyRequest.bind(this, req, res)], function (error) {});
      }.bind(this);
    }
  }, {
    key: 'listen',
    value: function listen() {
      return function (req, res) {
        _async2.default.series([this.retrieveBody.bind(this, req), this.validateBody.bind(this, req, res), this.dispatch.bind(this, req, res)], function (error) {});
      }.bind(this);
    }
  }, {
    key: 'isInvoke',
    value: function isInvoke(message) {
      return message && message.type && message.type.toLowerCase() === 'invoke';
    }
  }, {
    key: 'getInputMessages',
    value: function getInputMessages(req, res, cb) {
      cb(null, req.body);
    }
  }, {
    key: 'getOutputMessages',
    value: function getOutputMessages(messages, cb) {
      cb(null, messages);
    }
  }, {
    key: 'dispatch',
    value: function dispatch(req, res, cb) {
      try {
        this.getInputMessages(req, res, function (error, messages) {
          if (error) {
            return cb(error);
          }
          for (var i = 0; i < messages.length; i++) {
            var msg = messages[i];
            if (this.isInvoke(msg)) {
              this.onInvokeHandler(msg, function (err, body, status) {
                if (err) {
                  res.status(500);
                  res.end();
                  return cb(err);
                }
                res.send(status || 200, body);
              });
            } else {
              this.onEventHandler([msg]);
              res.status(202);
              res.end();
              return cb();
            }
          }
          if (this.settings.autoResponse === true) {
            res.status(200);
            res.end();
          }
          cb();
        }.bind(this));
      } catch (err) {
        res.status(500);
        res.end();
        cb(err);
      }
    }
  }, {
    key: 'sendMessage',
    value: function sendMessage(message, cb) {
      cb(null, message);
    }
  }, {
    key: 'send',
    value: function send(messages, done) {
      this.getOutputMessages(messages, function (error, messages) {
        if (error) {
          return done();
        }
        _async2.default.mapSeries(messages, this.sendMessage.bind(this), function (error, res) {
          done();
        });
      }.bind(this));
    }
  }, {
    key: 'getQueryParameter',
    value: function getQueryParameter(req, name) {
      var result = req[name];
      if (!result && req.query) {
        result = req.query[name];
      }
      return result;
    }
  }, {
    key: 'getDefaultIncomingMessage',
    value: function getDefaultIncomingMessage(channel, id, date, source) {
      return {
        type: 'message',
        id: id,
        timestamp: (0, _moment2.default)(date).format(),
        channelId: channel,
        user: {
          id: ''
        },
        text: '',
        attachment: [],
        entities: [],
        sourceEvent: source,
        address: {
          id: id,
          channelId: channel,
          from: {
            id: ''
          },
          recipient: {
            id: ''
          },
          conversation: {
            isGroup: false,
            id: ''
          }
        }
      };
    }
  }]);

  return FlowConnector;
}();

exports.default = FlowConnector;