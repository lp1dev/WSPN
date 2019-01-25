const WebSocket = require('ws')
const webSocket = new WebSocket('ws://localhost:1337')
const cert = require('./certificate.json')

webSocket.on('message', (message) => {
    console.log(message)
})

webSocket.on('open', (ws) => {
    webSocket.send('Connect: '+cert.key)
    webSocket.send('Id: lp3')
    webSocket.send('Join: testNetwork')
    webSocket.send('lp3: salu')
})



