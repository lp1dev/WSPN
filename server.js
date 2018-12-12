const ws = require('ws')
const PORT = 1337
const server = new ws.Server({port: PORT})
const header = `WSNet Server :: v0.0.1`
const certificate = require('./certificate.json')

const connected = []
const clients = {}
const networks = {}

function dispatch(source, network, message) {
    console.log(`Dispatching ${message} to ${network}`)
    networks[network].forEach(webSocket => {
        if (webSocket !== source && webSocket.readyState === webSocket.OPEN) {
            webSocket.send(message)
        }
    })
}

function auth(webSocket) {
    for (const clientId in clients) {
        if (clients[clientId] == webSocket) {
            return clients[clientId]
        }
    }
    return null
}

function onMessage(message, webSocket) {
    let [key, value] = message.split(':')
    value = value && value.trim()
    key = key && key.trim()
    console.log(`value: {${value}}, key: {${key}}`)
    if (!value && !key) {
        webSocket.send('Error: Invalid message format')
        return
    } else if (!value) {
        for (const network in networks) {
            console.log(networks)
            if (networks[network].includes(webSocket)) {
                dispatch(webSocket, network, key)
            }
        }
        return
    }
    const client = auth(webSocket)
    if (!['Connect', 'Id'].includes(key) && !client) {
        if (webSocket.readyState == webSocket.OPEN) {
            webSocket.send('Error: You must authenticate first')
        }
        return
    }
    switch (key) {
    case 'Connect':
        if (value !== certificate.key) {
            webSocket.send('Error: invalid certificate')
            webSocket.close()
        } else {
            connected.push(webSocket)
            webSocket.send('OK')
        }
        break
    case 'Id':
        if (connected.includes(webSocket)) {
            if (!clients[value]) {
                clients[value] = webSocket
                webSocket.send('OK')
            } else {
                webSocket.send('Error: This user has already been registered')
            }
        } else {
            webSocket.send('Error: You need to connect before')
        }
    case 'Create':
        if (!networks[value]) {
            networks[value] = [webSocket]
            webSocket.send('OK')
        } else {
            webSocket.send('Error: This network already exists')
        }
        break
    case 'Join':
        if (networks[value]) {
            if (!networks[value].includes(webSocket)) {
                networks[value].push(webSocket)
                webSocket.send('OK')
            } else {
                webSocket.send('Error: You already joined this network')
            }
        } else {
            webSocket.send('Error: There is no such network')
        }
        break
    }
}

function logout(webSocket) {
    const index = connected.indexOf(webSocket)
    if (index != -1) {
        connected.splice(index, 1)
    }
    for (const client in clients) {
        if (clients[client] == webSocket) {
            delete clients[client]
        }
    }
}

function onError(error, webSocket) {
    console.error(error)
    logout(webSocket)
}

function onClose(reason, webSocket) {
    console.log(reason)
    logout(webSocket)
}

function onConnection(webSocket, request) {
    console.log('Client connected', request.connection.remoteAddress)
    try {
        webSocket.send(header)
        webSocket.on('message', (message) => onMessage(message, webSocket))
        webSocket.on('error', (error) => onError(error, webSocket))
        webSocket.on('close', (reason) => onClose(reason, webSocket))
    } catch (e) {
        console.error(e)
    }
}

server.on('connection', onConnection)

console.log(`WSNet Server listening on ${PORT}`)
