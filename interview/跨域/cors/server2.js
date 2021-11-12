const express = require('express')
const app = express()

app.use((req, res, next) => {
  // 这里可以获取到请求头中的所有信息
  const origin = req.headers.origin
  // 可以访问的白名单
  whitList = ['http://localhost:3000']
  if (whitList.includes(origin)) {
    // 设置哪个源可以访问服务器
    res.setHeader('Access-Control-Allow-Origin', origin)
    // 允许设置的请求头
    res.setHeader('Access-Control-Allow-Headers', 'name')
    // 允许发送的请求方式
    res.setHeader('Access-Control-Allow-Methods', 'PUT')
    // 允许发送请求时携带 cookie
    res.setHeader('Access-Control-Allow-Credentials', true)
    // 允许在响应体中获取响应头: xhr.getResponseHeader('name')
    res.setHeader('Access-Control-Expose-Headers', 'name')
  }
  next()
})

app.get('/getData', (req, res) => {
  // 发生跨域的时候，其实服务器是收到请求的。最终在浏览器看到跨域的报错是因为浏览器给拦截了。
  console.log(req.headers)
  res.end('服务器数据')
})
app.put('/getData', (req, res) => {
  // 发生跨域的时候，其实服务器是收到请求的。最终在浏览器看到跨域的报错是因为浏览器给拦截了。
  console.log(req.headers)
  res.setHeader('name', 'serverHeader')
  res.end('服务器数据 - put')
})

app.use(express.static(__dirname))

app.listen(4000)