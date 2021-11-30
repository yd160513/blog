// 监听 send 事件
process.on('message', message => {
  // 父进程中发送过来的
  const { type, timeout } = message
  if (type === 'start') {
    // 算出结束时间(当前时间 + timeout = 结束时间)，如果当前时间大于结束时间，说明 callback 可以执行了，则通知 index.js 中可以执行了
    const endMs = Date.now() + timeout
    setInterval(() => {
      // 如果当前时间大于结束时间，说明 callback 可以执行了，则通知父进程 callback 可以执行了
      if (endMs <= Date.now()) {
        // 通知父进程
        process.send({ type: 'ready' })
        // 退出当前进程
        process.exit()
      }
    }, 100)
  }
})