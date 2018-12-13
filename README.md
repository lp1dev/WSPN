# WebSocket Network

WSNet is a Node.js service creating networks of client WebSockets.

You can create networks to communicate with others WebSockets outside of your LAN,
without exposing your server on the WAN and having to manage NAT rules.

# Example :

You created a game client A and need it to communicate with another game client B through a WebSocket.

You just have to create a new network named "MyAwesomeGame" on the server,
you can then join the network with A and B.

Once you've joined the network, 
every message you're going to send though the WebSocket is going to be shared to the rest of the network !

Code Sample to create a network and send a message :

```const WebSocket = require('ws')
const webSocket = new WebSocket('wss://your-server.net:1337')
const cert = require('./certificate.json')

webSocket.on('open', (ws) => {
    webSocket.send('Connect: '+cert.key)
    webSocket.send('Id: ClientA')
    webSocket.send('Create: MyAwesomeGame')
    webSocket.send('Hello everyone!')
})
```
