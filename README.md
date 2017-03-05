# flow-connector

This is a system for doing connector for the Microsoft Bot Framework bots.
It includes an abstract class for building connectors, FlowConnector, and 
also a FlowMultiConnector that is able to act as a hub for different 
connectors by channel.

This way you can have your own connectors for channels like facebook, slack,
line, wechat,... and handle them at once connecting to your own single 
bot backend. Of course one of the connectors that you can add is the
builder.ChatConnector, so you can use custom connectors for several channels,
but still use the Microsoft server for the other ones.

If you add a connector for the channel 'default', then when a channel ask for
a connector, and the connector is not defined, then default one is returned.
It's recommended to have the builder.ChatConnector as the default, so you'll be
able to test your bots from the emulator.

You can install the FlowConnector from npm:

```bash
npm install flow-connector
```

Or you can use the flow-bot-manager and build bots in an easy way:
https://github.com/jseijas/flow-bot-manager

How to use the FlowMultiConnector:

```javascript
import { FlowMultiConnector } from 'flow-connector';
import builder from 'botbuilder';

let multiConnector = new FlowMultiConnector();
let chatConnector = new builder.ChatConnector({
  appId: 'YOUR MICROSOFT APP ID',
  appPassword: 'YOUR MICROSOFT APP PASSWORD'
});
multiConnector.addConnector('default', chatConnector);
```

## Implemented clients

Currently two clients are implemented, but in draft mode (currently only text supported):
* Slack
* Facebook