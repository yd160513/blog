// 监听 send 事件
process.on('message', message => {
  const { type, timeout } = message
  if (type === 'start') {
    // 当前时间 + timeout = 结束时间
    const endMs = Date.now() + timeout
    setInterval(() => {
      // 当结束时间小于当前时间了，说明这个时候就 callback 就可以被执行了。
      if (endMs <= Date.now()) {
        // 通知父进程
        process.send({ type: 'ready' })
        // 退出当前进程
        process.exit()
      }
    }, 100)
  }
})