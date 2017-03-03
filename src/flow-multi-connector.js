import FlowConnector from './flow-connector';
import _ from 'lodash';

class FlowMultiConnector extends FlowConnector {
  constructor(settings) {
    super(settings);
    this.connectors = {};
  }

  addConnector(channels, connector) {
    if (!_.isArray(channels)) {
      channels = [channels];
    }
    for (let i = 0; i < channels.length; i++) {
      this.connectors[channels[i]] = connector;
    }
  }

  getConnector(name) {
    return this.connectors[name] || this.connectors['default'];
  }

  onEvent(handler) {
    super.onEvent(handler);
    for (let name in this.connectors) {
      this.connectors[name].onEvent(handler);
    }
  }

  onInvoke(handler) {
    super.onInvoke(handler);
    for (let name in this.connectors) {
      this.connectors[name].onInvoke(handler);
    }
  }

  verify(name) {
    return this.getConnector(name).verify();
  }

  listen(name) {
    return this.getConnector(name).listen();
  }

  send(messages, done) {
    var msg = _.isArray(messages) ? messages[0] : messages;
    var name = msg.address.channelId;
    return this.getConnector(name).send(messages, done);
  }
}

export default FlowMultiConnector;