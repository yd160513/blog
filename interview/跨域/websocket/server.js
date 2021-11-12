const express = require('express')
const app = express()
const WebSocket = require('ws')

const wss = new WebSocket.Server({ port: 3000 })
wss.on('connection', ws => {
  ws.on('message', data => {
    console.log('前端发送过来的消息')
    ws.send('服务器发到前端的消息')
  })
})

// app.listen(3000)