const WebSocket = require('ws')
const webSocket = new WebSocket('ws://localhost:1337')
const cert = require('./certificate.json')

webSocket.on('message', (message) => {
    console.log(message)
})

webSocket.on('open', (ws) => {
    webSocket.send('Connect: '+cert.key)
    webSocket.send('Id: lp2')
    webSocket.send('Create: testNetwork')
    webSocket.send('Join: testNetwork')
    webSocket.send('tutu from lp2')
})



