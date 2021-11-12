async function async1() {
  console.log('async1 start') // 2
  await async2()
  // await 的后边，都可以看成是 callback 里边的内容，即异步
  // 类似于 event loop, setTimeout(cb)
  // 类似于将 await 后边的内容封装到了 Promise.resolve().then(cb) 中、setTimeout(cb) 中
  console.log('async1 end') // 5
  await async3()
  console.log('async1 end 2') // 7
}

async function async2() {
  console.log('async2') // 3
}

async function async3() {
  console.log('async3') // 6
}

console.log('script start') // 1
async1()
console.log('script end') // 4

// ------------------------------------------------------------------------------------------
async function fn() {
  return 100
}

(async function () {
  const a = fn() // ? => pending 状态的 promise 对应值为 100
  console.log('a', a)
  const b = await fn() // ? => 100
  console.log('b', b)
})()

// ------------------------------------------------------------------------------------------
(async function() {
  console.log('start')
  const a = await 100
  console.log('a', a)
  const b = await Promise.resolve(200)
  console.log('b', b)
  const c = await Promise.reject(300)
  console.log('c', c)
  console.log('end')
})() // 执行完毕，打印出哪些内容？ => start 100 200 报错

// ------------------------------------------------------------------------------------------
async function async1() {
  console.log('async1 start') // 2
  await async2() // resolve(Promise.resolve())
  console.log('async1 end') // 7
}

async function async2() {
  console.log('async2') // 3
}

console.log('script start') // 1

setTimeout(function () {
  console.log('setTimeout') // 8
}, 0)

async1()

new Promise(function (resolve) {
  console.log('promise1') // 4
  resolve()
}).then(function () {
  console.log('promise2') // 6
})

console.log('script end') // 5
// 直接完毕，打印结果: 
//    我给的答案: 'script start' 'async1 start' async2 promise1 'script end' 'async1 end' promise2 setTimeout (错在了 async1 end 和 promise2 的顺序)
//    正确答案: 'script start' 'async1 start' async2 promise1 'script end' promise2 'async1 end' setTimeout

// ------------------------------------------------------------------------------------------
console.log('script start') // 1

async function async1() {
  await async2()
  console.log('async1 end') // 7
}
async function async2() {
  console.log('async2 end') // 2
}
async1()

setTimeout(function() {
  console.log('setTimeout') // 8
}, 0)

new Promise(resolve => {
  console.log('Promise') // 3
  resolve()
})
  .then(function() {
    console.log('promise1') // 5
  })
  .then(function() {
    console.log('promise2') // 6
  })

console.log('script end') // 4

// ------------------------------------------------------------------------------------------
/**
 * 第一题: L1 L2 M1 M2. 
 * 代码执行循序:
 * 当用户触发点击事件之后
 * 将 click1 上下文放到调用栈，调用栈开始执行代码。遇到 Promise.then() 则将其放到任务队列中，执行 console.log('L1') 打印 L1。
 * L1 执行完成之后，click1 上下文执行完毕，退出调用栈。
 * 调用栈此时为空，开始读取任务队列中回调，开始执行 console.log('M1') 打印 M1。
 * 执行完 M1 之后开始进入 click2 的上下文，将其上下文放到调用栈，将 Promise.then() 则将其放到任务队列中，执行 console.log('L2') 打印 L2。
 * L2 执行完成之后 click2 上下文执行完毕，退出调用栈。
 * 调用栈此时为空，开始读取任务队列中的会调用，开始执行 console.log('M2') 打印 M2。
 */
const btn = document.getElementById('btn')
// 命名为 click1
btn.addEventListener('click', () => {
  Promise.resolve().then(() => { console.log('M1') })
  console.log('L1')
})
// 命名为 click2
btn.addEventListener('click', () => {
  Promise.resolve().then(() => { console.log('M2') })
  console.log('L2')
})
btn.click()

/**
 * 第一题的改版: L1 M1 L2 M2.
 * 代码执行顺序:
 * 将 btn.click() 的上下文放到调用栈中。因为是 JS 层面上的代码。1 中没有将点击事件放到调用栈中是因为它是在渲染线程中的。
 * 将 click1 上下文放到调用栈，调用栈开始执行代码。遇到 Promise.then() 则将其放到任务队列中，执行 console.log('L1') 打印 L1。
 * L1 执行完成之后，click1 上下文执行完毕，退出调用栈。
 * 此时调用栈不为空，继续执行代码，不会去任务队列中找。
 * 将 click2 上下文放到调用栈，调用栈开始执行代码。遇到 Promise.then() 则将其放到任务队列中，执行 console.log('L2') 打印 L2。
 * L2 执行完成之后，click2 上下文执行完毕，退出调用栈。
 * 然后将 btn.click() 的上下文从调用栈中退出。
 * 开始去任务队列中找，因为是队列，所以先执行 M1 再执行 M2。
 */
const btn = document.getElementById('btn')
// 命名为 click1
btn.addEventListener('click', () => {
  Promise.resolve().then(() => { console.log('M1') })
  console.log('L1')
})
// 命名为 click2
btn.addEventListener('click', () => {
  Promise.resolve().then(() => { console.log('M2') })
  console.log('L2')
})
// 总结: 1 和 2 中的考点就在于什么时候会去任务队列中找代码去执行？只有在调用栈为空的时候才会去任务队列中找。

// ------------------------------------------------------------------------------------------


