// 子页面的服务
const express = require('express')
const app = express()

app.use(express.static(__dirname))

app.listen(4000)