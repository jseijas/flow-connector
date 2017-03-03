import async from 'async';
import moment from 'moment';

class FlowConnector {
  constructor(settings) {
    this.settings = settings || {};
    this.initialization();
  }

  initialization() {

  }

  retrieveBody(req, cb) {
    if (req.method !== 'POST') {
      return cb();
    }
    if (req.body) {
      return cb();
    }
    var requestData = '';
    req.on('data', function(chunk) {
      requestData += chunk;
    });
    req.on('end', function() {
      req.body = JSON.parse(requestData);
      return cb();
    });
  }

  validateBody(req, res, cb) {
    cb();
  }

  onEvent(handler) {
    this.onEventHandler = handler;
  }

  onInvoke(handler) {
    this.onInvokeHandler = handler;
  }

  verifyRequest(req, res, cb) {
    res.status(200);
    res.end();
    cb();
  }

  verify() {
    return function(req, res) {
      async.series([
        this.retrieveBody.bind(this, req),
        this.verifyRequest.bind(this, req, res)
      ], function(error) {

      });
    }.bind(this);
  }

  listen() {
    return function(req, res) {
      async.series([
        this.retrieveBody.bind(this, req),
        this.validateBody.bind(this, req, res),
        this.dispatch.bind(this, req, res)
      ], function(error) {

      });
    }.bind(this);
  }

  isInvoke(message) {
    return (message && message.type && message.type.toLowerCase() === 'invoke');
  }

  getInputMessages(req, res, cb) {
    cb(null, req.body);
  }

  getOutputMessages(messages, cb) {
    cb(null, messages);
  }

  dispatch(req, res, cb) {
    try {
      this.getInputMessages(req, res, function(error, messages) {
        if (error) {
          return cb(error);
        }
        for (var i = 0; i < messages.length; i++) {
          let msg = messages[i];
          if (this.isInvoke(msg)) {
            this.onInvokeHandler(msg, function(err, body, status) {
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
    } catch(err) {
      res.status(500);
      res.end();
      cb(err);
    }
  }

  sendMessage(message, cb) {
    cb(null, message);
  }

  send(messages, done) {
    this.getOutputMessages(messages, function(error, messages) {
      if (error) {
        return done();
      }
      async.mapSeries(messages, this.sendMessage.bind(this),
        function(error, res) {
          done();
        });
    }.bind(this));
  }

  getQueryParameter(req, name) {
    var result = req[name];
    if (!result && req.query) {
      result = req.query[name];
    }
    return result;
  }

  getDefaultIncomingMessage(channel, id, date, source) {
    return {
      type: 'message',
      id: id,
      timestamp: moment(date).format(),
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

}

export default FlowConnector;