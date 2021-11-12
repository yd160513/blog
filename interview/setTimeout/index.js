// // 第一种实现方式 ------------------------------------------------------------------------------------------------------------------------
// /**
//  * 衍生新的 Node.js 进程并使用建立的 IPC 通信通道（其允许在父子进程之间发送消息）调用指定的模块。
//  * 子进程和主进程是在同一 CPU 上的不同时间切片上轮换执行的
//  */
// const { fork } = require('child_process')
// /**
//  * setTimeout 执行的时候，会交给一个单独的进程去计数，等到有 callback 后将 callback 放到宏任务队列中
//  */
// // 宏任务队列
// const macroTasks = []
// /**
//  * 实现 setTimeout 首先要知道的: 
//  *    1. setTimeout 接收两个参数， 一个 callback 和一个 timeout
//  *    2. setTimeout 为了不阻塞进程是放到了另外一个进程中执行的，这个时候就需要用到 node 中的 child_process
//  */
// function mySetTimeout(callback, timeout) {
//   // 创建一个子进程
//   const child = fork('./child.js')
//   // 向子进程发送通知，对应用 on message 来监听
//   child.send({ type: 'start', timeout })
//   // 监听子进程的 send 事件
//   child.on('message', message => {
//     const { type } = message
//     if (type === 'ready') {
//       // 将 callback 添加到宏任务队列中，等待事件循环调用
//       macroTasks.push(callback)
//     }
//   })
// }

// // 模拟事件循环。浏览器每秒渲染 60 帧， 也就是一秒刷新 60 次， 1000/60 ≈ 16ms 得到 16ms 刷新一次
// setInterval(() => {
//   // 取出队列中的第一个，并将其从队列中删除
//   const task = macroTasks.shift()
//   task && task()
// }, 16)

// mySetTimeout(() => {
//   console.log('哈喽')
// }, 3000)

// 第二种实现方式，也是 chromium 中的实现 ------------------------------------------------------------------------------------------------------------------------
/**
 * 在 setTimeout 函数中只是将部分参数以对象的形式存放到了另外一个数组中，
 * 在事件循环的时候去遍历这个数组，如果有符合条件的则将其对应的 callback 放到宏任务队列中
 */
const macroTasks1 = []
let delayQueue1 = []
function mySetTimeout1(callback, timeout) {
  delayQueue1.push({
    timeout,
    callback,
    startMs: Date.now()
  })
}

setInterval(() => {
  const task = macroTasks1.shift()
  task && task()
  delayQueue1 = delayQueue1.filter(item => {
    if (item.startMs + item.timeout <= Date.now()) {
      macroTasks1.push(item.callback)
      return false
    }
    return true
  })
}, 16)

mySetTimeout1(() => {
  console.log('哈喽')
}, 3000)
