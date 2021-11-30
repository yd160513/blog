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

// // 测试代码
// mySetTimeout(() => {
//   console.log('哈喽')
// }, 3000)

// 第二种实现方式，也是 chromium 中的实现 ------------------------------------------------------------------------------------------------------------------------
/**
 * 这里可以理解为: 将异步队列和宏任务队列区分开，认为他们是两个队列。
 * 这里需要用到的是宏任务队列，setTimeout() 函数只是将 callback、timeout、还有当前时间放到了异步队列中(delayQueue) 中；
 * 具体 callback 什么时候可以执行，是放到事件循环中。
 * 在事件循环中会遍历异步队列，这个时候会判断异步队列中每一项是否该执行了(当前时间大于 timeout + startMs)，如果该执行了则将其放到宏任务队列中，等待下一次事件循环来执行它，并将其从任务队列中删除；
 * 反之则不作处理，继续待在异步队列中不做处理，等待下一次事件循环继续判断。
 */

const macroTasks1 = []
let delayQueue1 = []
function mySetTimeout1(callback, timeout) {
  // 将 callback、timeout、当前时间放到异步队列中
  delayQueue1.push({
    timeout,
    callback,
    startMs: Date.now()
  })
}
// 模拟事件循环
setInterval(() => {
  // 执行宏任务队列中的 callback
  const task = macroTasks1.shift()
  task && task()
  delayQueue1 = delayQueue1.filter(item => {
    // 判断异步队列中的每一项是否该执行了(当前时间 > timeout + startMs)，该执行的将其放到宏任务队列中，等到下一次事件循环执行；反之继续待在异步队列中不做处理。
    if (item.startMs + item.timeout <= Date.now()) {
      // 放到宏任务队列中等待下一次事件循环执行
      macroTasks1.push(item.callback)
      // 将其从异步队列中删除
      return false
    }
    // 不符合执行条件的则继续保持在异步队列中
    return true
  })
}, 16)

mySetTimeout1(() => {
  console.log('哈喽')
}, 3000)
