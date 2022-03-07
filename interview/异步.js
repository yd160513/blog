// async function async1() {
//   console.log('async1 start') // 2
//   await async2()
//   // await 的后边，都可以看成是 callback 里边的内容，即异步
//   // 类似于 event loop, setTimeout(cb)
//   // 类似于将 await 后边的内容封装到了 Promise.resolve().then(cb) 中、setTimeout(cb) 中
//   console.log('async1 end') // 5
//   await async3()
//   console.log('async1 end 2') // 7
// }

// async function async2() {
//   console.log('async2') // 3
// }

// async function async3() {
//   console.log('async3') // 6
// }

// console.log('script start') // 1
// async1()
// console.log('script end') // 4

// // ------------------------------------------------------------------------------------------
// async function fn() {
//   return 100
// }

// (async function () {
//   const a = fn() // ? => pending 状态的 promise 对应值为 100
//   console.log('a', a)
//   const b = await fn() // ? => 100
//   console.log('b', b)
// })()

// ------------------------------------------------------------------------------------------
// (async function() {
//   console.log('start')
//   const a = await 100
//   console.log('a', a)
//   const b = await Promise.resolve(200)
//   console.log('b', b)
//   const c = await Promise.reject(300)
//   console.log('c', c)
//   console.log('end')
// })() // 执行完毕，打印出哪些内容？ => start 100 200 报错

// ------------------------------------------------------------------------------------------
// async function async1() {
//   console.log('async1 start') // 2
//   await async2() // resolve(Promise.resolve())
//   console.log('async1 end') // 7
// }

// async function async2() {
//   console.log('async2') // 3
// }

// console.log('script start') // 1

// setTimeout(function () {
//   console.log('setTimeout') // 8
// }, 0)

// async1()

// new Promise(function (resolve) {
//   console.log('promise1') // 4
//   resolve()
// }).then(function () {
//   console.log('promise2') // 6
// })

// console.log('script end') // 5
// // 直接完毕，打印结果: 
// //    我给的答案: 'script start' 'async1 start' async2 promise1 'script end' 'async1 end' promise2 setTimeout (错在了 async1 end 和 promise2 的顺序)
// //    正确答案: 'script start' 'async1 start' async2 promise1 'script end' promise2 'async1 end' setTimeout

// ------------------------------------------------------------------------------------------
// console.log('script start') // 1

// async function async1() {
//   await async2()
//   console.log('async1 end') // 7
// }
// async function async2() {
//   console.log('async2 end') // 2
// }
// async1()

// setTimeout(function() {
//   console.log('setTimeout') // 8
// }, 0)

// new Promise(resolve => {
//   console.log('Promise') // 3
//   resolve()
// })
//   .then(function() {
//     console.log('promise1') // 5
//   })
//   .then(function() {
//     console.log('promise2') // 6
//   })

// console.log('script end') // 4

// // ------------------------------------------------------------------------------------------
// /**
//  * 第一题: L1 L2 M1 M2. 
//  * 代码执行循序:
//  * 当用户触发点击事件之后
//  * 将 click1 上下文放到调用栈，调用栈开始执行代码。遇到 Promise.then() 则将其放到任务队列中，执行 console.log('L1') 打印 L1。
//  * L1 执行完成之后，click1 上下文执行完毕，退出调用栈。
//  * 调用栈此时为空，开始读取任务队列中回调，开始执行 console.log('M1') 打印 M1。
//  * 执行完 M1 之后开始进入 click2 的上下文，将其上下文放到调用栈，将 Promise.then() 则将其放到任务队列中，执行 console.log('L2') 打印 L2。
//  * L2 执行完成之后 click2 上下文执行完毕，退出调用栈。
//  * 调用栈此时为空，开始读取任务队列中的会调用，开始执行 console.log('M2') 打印 M2。
//  */
// const btn = document.getElementById('btn')
// // 命名为 click1
// btn.addEventListener('click', () => {
//   Promise.resolve().then(() => { console.log('M1') })
//   console.log('L1')
// })
// // 命名为 click2
// btn.addEventListener('click', () => {
//   Promise.resolve().then(() => { console.log('M2') })
//   console.log('L2')
// })
// btn.click()

// /**
//  * 第一题的改版: L1 M1 L2 M2.
//  * 代码执行顺序:
//  * 将 btn.click() 的上下文放到调用栈中。因为是 JS 层面上的代码。1 中没有将点击事件放到调用栈中是因为它是在渲染线程中的。
//  * 将 click1 上下文放到调用栈，调用栈开始执行代码。遇到 Promise.then() 则将其放到任务队列中，执行 console.log('L1') 打印 L1。
//  * L1 执行完成之后，click1 上下文执行完毕，退出调用栈。
//  * 此时调用栈不为空，继续执行代码，不会去任务队列中找。
//  * 将 click2 上下文放到调用栈，调用栈开始执行代码。遇到 Promise.then() 则将其放到任务队列中，执行 console.log('L2') 打印 L2。
//  * L2 执行完成之后，click2 上下文执行完毕，退出调用栈。
//  * 然后将 btn.click() 的上下文从调用栈中退出。
//  * 开始去任务队列中找，因为是队列，所以先执行 M1 再执行 M2。
//  */
// const btn = document.getElementById('btn')
// // 命名为 click1
// btn.addEventListener('click', () => {
//   Promise.resolve().then(() => { console.log('M1') })
//   console.log('L1')
// })
// // 命名为 click2
// btn.addEventListener('click', () => {
//   Promise.resolve().then(() => { console.log('M2') })
//   console.log('L2')
// })
// 总结: 1 和 2 中的考点就在于什么时候会去任务队列中找代码去执行？只有在调用栈为空的时候才会去任务队列中找。

// 输出顺序 ------------------------------------------------------------------------------------------
// 1. 
// const promise = new Promise((resolve, reject) => {
//   console.log(1);
//   console.log(2);
// });
// promise.then(() => {
//   console.log(3);
// });
// console.log(4);
/**
 * 1
 * 2
 * 4
 * 题解: then 中没有打印是因为 没有进行 resolve()
 */

// 2. 
// const promise1 = new Promise((resolve, reject) => {
//   console.log('promise1')
//   resolve('resolve1')
// })
// const promise2 = promise1.then(res => {
//   console.log(res)
// })
// setTimeout(() => {
//   console.log(promise2)
// }, 0)
// console.log('1', promise1); // resolve 状态的 resolve1
// console.log('2', promise2); // pending 状态
/**
 * promise1
 * 1 Promise { 'resolve1' }
 * 2 Promise { <pending> } // pending 是因为 then 是一个微任务
 * resolve1
 * 问题: 什么时候获取 promise2 就是会一个完成状态? 
 * 答: 当 promise2 的 then 执行完毕之后，可以在 setTimeout 中获取其状态
 */

// 3.
// const promise = new Promise((resolve, reject) => {
//   console.log(1);
//   setTimeout(() => {
//     console.log("timerStart");
//     resolve("success");
//     console.log("timerEnd");
//   }, 0);
//   console.log(2);
// });
// promise.then((res) => {
//   console.log(res);
// });
// console.log(4);
/**
 * 1
 * 2
 * 4
 * timerStart
 * timerEnd
 * success
 * 题解: resolve() 是将 success 推入微任务队列
 */

// 4.
// Promise.resolve().then(() => {
//   console.log('promise1');
//   const timer2 = setTimeout(() => {
//     console.log('timer2')
//   }, 0)
// });
// const timer1 = setTimeout(() => {
//   console.log('timer1')
//   Promise.resolve().then(() => {
//     console.log('promise2')
//   })
// }, 0)
// console.log('start');
/**
 * start
 * promise1
 * timer1
 * promise2
 * timer2
 * 题解: 
 * 1. Promise.resolve().then() 加入微任务队列
 * 2. timer1 加入宏任务队列
 * 3. 打印 start
 * 4. 同步任务执行完成之后，执行微任务队列，打印 promise1
 * 5. 将 timer2 添加到宏任务队列
 * 6. 此时宏任务队列中有 timer1 和 timer2
 * 7. 队列遵循先进先出，执行宏任务 timer1 打印 timer1
 * 8. Promise.resolve().then() 加入微任务队列
 * 9. 宏任务执行完成之后检查是否有微任务
 * 10. 有 Promise.resolve().then() 微任务并开始执行并打印 promise2
 * 11. 当前宏任务执行完毕之后开始下一轮宏任务
 * 12. 执行宏任务 timer2 并答应 timer2
 */

// 5. 
// const promise = new Promise((resolve, reject) => {
//   resolve('success1');
//   reject('error');
//   resolve('success2');
// });
// promise.then((res) => {
//   console.log('then:', res);
// }).catch((err) => {
//   console.log('catch:', err);
// })
/**
 * success1
 * 题解: 状态被改变之后就无法再被改变
 */

// 6.
// Promise.resolve(1)
//   .then(2)
//   .then(Promise.resolve(3))
//   .then(console.log)
/**
 * 1
 * 题解: then 方法接受的参数是函数，而如果传递的并非是一个函数，它实际上会将其解释为 then(null)，这就会导致前一个 Promise 的结果透传下去。
 */

// 7.
// const promise1 = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     resolve('success')
//   }, 1000)
// })
// const promise2 = promise1.then(() => {
//   throw new Error('error!!!')
// })
// console.log('promise1', promise1)
// console.log('promise2', promise2)
// setTimeout(() => {
//   console.log('promise1', promise1)
//   console.log('promise2', promise2)
// }, 2000)
/**
 * promise1 Promise { <pending> }
 * promise2 Promise { <pending> }
 * error!!! 
 * 题解: throw new Error() 会阻塞代码执行，所以后面的 setTimeout 中的两次打印都不会执行
 */

// 8. 
// Promise.resolve(1)
// .then(res => {
//   console.log(res);
//   return 2;
// })
// .catch(err => {
//   return 3;
// })
// .then(res => {
//   console.log(res);
// });
/**
* 1
* 2
* 题解: 不会执行到 catch 中
*/

// 9.
// Promise.resolve().then(() => {
//   return new Error('error!!!')
// }).then(res => {
//   console.log("then: ", res)
// }).catch(err => {
//   console.log("catch: ", err)
// })
/**
 * then: Error: error!!!
 * 题解: 因为 return 会被包装为 resolve() 所以会进入 then；如果是 throw 则会进入 catch
 */

// 10.
// const promise = Promise.resolve().then(() => {
//   return promise;
// })
// promise.catch(console.err)
/**
 * 会直接报错，并不会被 catch 捕获: Uncaught (in promise) TypeError: Chaining cycle detected for promise #<Promise>
 * 题解: .then 或 .catch 中不能 return promise 本身，否则会进入死循环。
 */

// 11.
// Promise.resolve(1)
//   .then(2)
//   .then(Promise.resolve(3))
//   .then(console.log)
/**
 * 1
 * 题解: then 收到的是一个原始值或不可以执行 then() 方法的参数的话，会将其包装为 then(null)，并且会将前一个 Promise 的结果透传下去
 */

// 12.
// Promise.reject('err!!!')
//   .then((res) => {
//     console.log('success', res)
//   }, (err) => {
//     console.log('error', err)
//   }).catch(err => {
//     console.log('catch', err)
//   })
/**
 * error err!!!
 * 题解: 
 * then() 方法接受两个函数，第一个函数是成功触发，第二个是失败触发，所以这里被第二个函数捕获，并不会走到 catch() 中。
 * 但是，基于上述条件，在第二个函数中增加一个 throw new Error('xxx') 这时候就会被 catch() 捕获，
 * 也就是说，在 then() 的第一个函数中或第二个函数中报错就会被后面的 catch() 捕获。
 */

// 13.
// Promise.resolve('1')
//   .then(res => {
//     console.log(res)
//   })
//   .finally(() => { // 等待 then() 执行结束后执行
//     console.log('finally')
//   })
// Promise.resolve('2')
//   .finally(() => { // 不会等待后边 then() 的执行，会先于后边的 then() 执行
//     console.log('finally2')
//     return '我是finally2返回的值'
//   })
//   .then(res => {
//     console.log('finally2后面的then函数', res)
//   })
/**
 * 1
 * finally2
 * finally
 * finally2后面的then函数 2
 * 题解:
 * 1. finally() 不论 Promise 最终的状态是什么都会执行
 * 2. finally() 的回调不接受任何参数，也就是说在回调中无法知道当前 Promise 的状态
 * 3. finally() 会将上一个 Promise 的结果透传下去
 * 4. finally() 的前面有 then() 的话则会等待前面 then() 执行完成之后才执行
 * 5. 如果 finally() 前面和后面都有 then() 则只会等待前面的 then() 执行完成之后就执行 finally()，不会等待后面的 then()
 */
// 验证: 上述 3、4
// Promise.resolve('1')
// .then(res => {
//   console.log(res)
// })
// .finally(() => { // 等待前边的 then() 执行完成后执行，不会等待后边的 then()
//   console.log('finally')
// })
// .then(() => {
//   console.log(13)
// })
/**
 * 1
 * finally
 * 13
 */

// 14.
// function runAsync (x) {
//   const p = new Promise(r => setTimeout(() => r(x, console.log(x)), 1000))
//   // 解析: 异步执行函数 runAsync，该函数传入一个值 x，然后间隔一秒后打印出这个 x。
//   // const p = new Promise(r => {
//   //   return setTimeout(() => {
//   //     return r(x, console.log(x))
//   //   }, 1000)
//   // })
//   return p
// }
// Promise.all([runAsync(1), runAsync(2), runAsync(3)]).then(res => console.log(res))
/**
 * 1
 * 2
 * 3
 * [1, 2, 3]
 * 题解: 
 * 1. 异步执行函数 runAsync，该函数传入一个值 x，然后间隔一秒后打印出这个 x。
 * 2. 再使用 Promise.all 来执行这个函数，执行的时候，看到一秒之后输出了1，2，3，同时输出了数组[1, 2, 3]
 * 3. 三个函数是同步执行的，并且在一个回调函数中返回了所有的结果。并且结果和函数的执行顺序是一致的。(归功于 Promise.all())
 */

// 15.
// function runAsync (x) {
//   const p = new Promise(r => setTimeout(() => r(x, console.log(x)), 1000))
//   return p
// }
// function runReject (x) {
//   const p = new Promise((res, rej) => setTimeout(() => rej(`Error: ${x}`, console.log(x)), 1000 * x))
//   return p
// }
// Promise.all([runAsync(1), runReject(4), runAsync(3), runReject(2)])
//        .then(res => {
//         console.log(res)
//        })
//        .catch(err => {
//         console.log(err)
//        })
/**
 * 1
 * 3
 * 2
 * Error: 2
 * 4
 * 题解: 
 * 1. 1 和 3 都是一秒之后打印
 * 2. 两秒之后触发 reject()，打印 2 和 Error: 2
 * 3. 四秒之后打印 4
 * 4. 因为有报错了，所以并不会执行到 then 方法中
 * 注: 
 * 1. all 和 race 传入的数组中如果有会抛出异常的异步任务，那么只有最先抛出的错误会被捕获，并且是被 then 的第二个参数或者后面的 catch 捕获；但并不会影响数组中其它的异步任务的执行。
 * 2. 当 all 的数组中有任意一个异步任务报错之后 all 的 then 就不会执行
 */

// 16.
// function runAsync (x) {
//   const p = new Promise(r => setTimeout(() => r(x, console.log(x)), 1000))
//   return p
// }
// Promise.race([runAsync(1), runAsync(2), runAsync(3)])
//   .then(res => console.log('result: ', res))
//   .catch(err => console.log(err))
/**
 * 1
 * result: 1
 * 2
 * 3
 * 题解:
 * race 返回数组中最先得到的结果，数组中的其他异步任务仍然会执行，但是不会在 then 中得到
 */

// 17.
// function runAsync(x) {
//   const p = new Promise(r =>
//     setTimeout(() => r(x, console.log(x)), 1000)
//   );
//   return p;
// }
// function runReject(x) {
//   const p = new Promise((res, rej) =>
//     setTimeout(() => rej(`Error: ${x}`, console.log(x)), 1000 * x)
//   );
//   return p;
// }
// Promise.race([runReject(0), runAsync(1), runAsync(2), runAsync(3)])
//   .then(res => console.log("result: ", res))
//   .catch(err => console.log(err));
/**
 * 0
 * Error: 0
 * 1
 * 2
 * 3
 * 题解: 
 * all 和 race 传入的数组中如果有会抛出异常的异步任务，那么只有最先抛出的错误会被捕获，并且是被 then 的第二个参数或者后面的 catch 捕获；但并不会影响数组中其它的异步任务的执行。
 */

// 18.
// async function async1() {
//   console.log("async1 start");
//   await async2();
//   console.log("async1 end");
// }
// async function async2() {
//   console.log("async2");
// }
// async1();
// console.log('start')
/**
 * async1 start
 * async2
 * start
 * async1 end
 */

// 19.
async function async1() {
  console.log("async1 start");
  await async2(); // 这里的 await 只会等待 async2 中的同步任务，并不会等待异步任务的结果
  console.log("async1 end");
  setTimeout(() => {
    console.log('timer1')
  }, 0)
}
async function async2() {
  setTimeout(() => {
    console.log('timer2')
  }, 0)
  console.log("async2");
}
async1();
setTimeout(() => {
  console.log('timer3')
}, 0)
console.log("start")
/**
 * async1 start
 * async2
 * start
 * async1 end
 * timer2
 * timer3
 * timer1
 * 题解: 
 * 1. 首先进入 async1，打印出 async1 start；
 * 2. 之后遇到 async2，进入 async2，遇到定时器 timer2，加入宏任务队列，之后打印 async2；
 * 由于 async2 阻塞了后面代码的执行，所以执行后面的定时器 timer3，将其加入宏任务队列，之后打印 start；
 * 然后执行 async2 后面的代码，打印出 async1 end，遇到定时器 timer1，将其加入宏任务队列；
 * 最后，宏任务队列有三个任务，先后顺序为 timer2，timer3，timer1，没有微任务，所以直接所有的宏任务按照先进先出的原则执行。
 */

// 20.
// async function async1 () {
//   console.log('async1 start');
//   await new Promise(resolve => {
//     console.log('promise1') // 这里没有进行 resolve()
//   })
//   console.log('async1 success');
//   return 'async1 end'
// }
// console.log('script start')
// async1().then(res => console.log(res))
// console.log('script end')
/**
 * script start
 * async1 start
 * promise1
 * script end
 * 题解: 
 * async 声明的函数也会立刻执行
 * 因为没有 resolve()，所以 await 后边的 promise 一直是 pending 状态，后边的 console.log() 和 return 一直不会执行，也就导致 async1().then() 不会执行
 */

// 21.
// async function async1 () {
//   console.log('async1 start');
//   await new Promise(resolve => {
//     console.log('promise1') // 这里属于是同步任务并不会触发 await 的等待， await 等待的是 resolve() 的结果
//     resolve('promise1 resolve')
//   }).then(res => console.log(res))
//   console.log('async1 success');
//   return 'async1 end'
// }
// console.log('script start')
// async1().then(res => console.log(res))
// console.log('script end')
/**
 * script start
 * async1 start
 * promise1
 * script end
 * promise1 resolve
 * async1 success
 * async1 end
 */

// 22.
// async function async1() {
//   console.log("async1 start");
//   await async2();
//   console.log("async1 end");
// }

// async function async2() {
//   console.log("async2");
// }

// console.log("script start");

// setTimeout(function() {
//   console.log("setTimeout");
// }, 0);

// async1();

// new Promise(resolve => {
//   console.log("promise1");
//   resolve();
// }).then(function() {
//   console.log("promise2");
// });
// console.log('script end')
/**
 * script start
 * async1 start
 * async2
 * promise1
 * script end
 * async1 end
 * promise2
 * setTimeout
 * 题解: 
 * 开头定义了 async1 和 async2 两个函数，但是并未执行，执行 script 中的代码，所以打印出 script start；
 * 遇到定时器 setTimeout，它是一个宏任务，将其加入到宏任务队列；
 * 之后执行函数 async1，首先打印出 async1 start；
 * 遇到 await，执行 async2，打印出 async2，并阻断后面代码的执行，将后面的代码加入到微任务队列；
 * 然后跳出 async1 和 async2，遇到 Promise，打印出 promise1；
 * 遇到 resolve，将其加入到微任务队列，然后执行后面的 script 代码，打印出 script end；
 * 之后就该执行微任务队列了，首先打印出 async1 end，然后打印出 promise2；
 * 执行完微任务队列，就开始执行宏任务队列中的定时器，打印出 setTimeout。
 */

// 23.
// async function async1 () {
//   await async2();
//   console.log('async1');
//   return 'async1 success'
// }
// async function async2 () {
//   return new Promise((resolve, reject) => {
//     console.log('async2')
//     reject('error')
//   })
// }
// async1().then(res => console.log(res))
/**
 * async2
 * 报错
 * 题解: 
 * 因为在 async2 中报错了并且没有任何地方捕获这个错误，所以导致代码不会继续执行，如果想继续执行需要对这个错误进行捕获。
 */

// 24.
// const first = () => (new Promise((resolve, reject) => {
//   console.log(3);
//   let p = new Promise((resolve, reject) => {
//       console.log(7);
//       setTimeout(() => {
//           console.log(5);
//           resolve(6);
//           console.log(p)
//       }, 0)
//       resolve(1);
//   });
//   resolve(2);
//   p.then((arg) => { // 微任务队列
//       console.log(arg);
//   });
// }));
// first().then((arg) => { // 微任务队列
//   console.log(arg);
// });
// console.log(4);
/**
 * 3
 * 7
 * 4
 * 1
 * 2
 * 5
 * resolve(6) 可以执行，但是没有地方接收，因为外部的 then 方法已经被 resolve(1) 执行了,
 * fulfilled 状态的 promise
 * 题解:
 * 首先会进入 Promise，打印出 3，之后进入下面的 Promise，打印出 7；
 * 遇到了定时器，将其加入宏任务队列；
 * 执行 Promise p 中的 resolve，状态变为 resolved，返回值为 1；
 * 执行 Promise first 中的 resolve，状态变为 resolved，返回值为 2；
 * 遇到 p.then，将其加入微任务队列，遇到 first().then，将其加入任务队列；
 * 执行外面的代码，打印出 4；
 * 这样第一轮宏任务就执行完了，开始执行微任务队列中的任务，先后打印出 1 和 2；
 * 这样微任务就执行完了，开始执行下一轮宏任务，宏任务队列中有一个定时器，执行它，打印出 5，resolve(6) 可以执行，但是没有地方接收，因为外部的 then 方法已经被 resolve(1) 执行了,
 * 最后 console.log(p) 打印出 Promise{<fulfilled>: 1}；
 */

// 25.
// const async1 = async () => {
//   console.log('async1');
//   setTimeout(() => {
//     console.log('timer1')
//   }, 2000)
//   await new Promise(resolve => {
//     console.log('promise1')
//   })
//   console.log('async1 end')
//   return 'async1 success'
// } 
// console.log('script start');
// async1().then(res => console.log(res));
// console.log('script end');
// Promise.resolve(1)
//   .then(2)
//   .then(Promise.resolve(3))
//   .catch(4)
//   .then(res => console.log(res))
// setTimeout(() => {
//   console.log('timer2')
// }, 1000)
/**
 * script start
 * async1
 * promise1
 * script end
 * 1
 * timer2
 * timer1
 * 题解: 
 * 首先执行同步带吗，打印出 script start；
 * 遇到定时器 timer1 将其加入宏任务队列；
 * 之后是执行 Promise，打印出 promise1，由于 Promise 没有返回值，所以后面的代码不会执行；
 * 然后执行同步代码，打印出 script end；
 * 继续执行下面的 Promise，.then 和.catch 期望参数是一个函数，这里传入的是一个数字，因此就会发生值透传，将 resolve(1) 的值传到最后一个 then，直接打印出 1；
 * 遇到第二个定时器，将其加入到宏任务队列，执行宏任务队列，按顺序依次执行两个定时器，但是由于定时器时间的原因，会在一秒后先打印出 timer2，在两秒后打印出 timer1。
 */

// 26.
// const p1 = new Promise((resolve) => {
//   setTimeout(() => {
//     resolve('resolve3');
//     console.log('timer1')
//   }, 0)
//   resolve('resolve1');
//   resolve('resolve2');
// }).then(res => {
//   console.log(res)
//   setTimeout(() => {
//     console.log(p1)
//   }, 1000)
// }).finally(res => {
//   console.log('finally', res)
// })
/**
 * resolve1
 * finally undefined
 * timer1
 * resolved 状态的 promise
 * 题解: 
 * finally() 的回调没有参数，所以是 undefined
 */

// 27.
// console.log('1');

// setTimeout(function() {
//   console.log('2');
//   process.nextTick(function() {
//       console.log('3');
//   })
//   new Promise(function(resolve) {
//       console.log('4');
//       resolve();
//   }).then(function() {
//       console.log('5')
//   })
// })
// process.nextTick(function() {
//   console.log('6');
// })
// new Promise(function(resolve) {
//   console.log('7');
//   resolve();
// }).then(function() {
//   console.log('8')
// })

// setTimeout(function() {
//   console.log('9');
//   process.nextTick(function() {
//       console.log('10');
//   })
//   new Promise(function(resolve) {
//       console.log('11');
//       resolve();
//   }).then(function() {
//       console.log('12')
//   })
// })
/**
 * 1
 * 7
 * 6
 * 8
 * 2
 * 4
 * 3
 * 5
 * 9
 * 11
 * 10
 * 12
 */

// 28.
// console.log(1)

// setTimeout(() => {
//   console.log(2)
// })

// new Promise(resolve =>  {
//   console.log(3)
//   resolve(4)
// }).then(d => console.log(d))

// setTimeout(() => {
//   console.log(5)
//   new Promise(resolve =>  {
//     resolve(6)
//   }).then(d => console.log(d))
// })

// setTimeout(() => {
//   console.log(7)
// })

// console.log(8)
/**
 * 1
 * 3
 * 8
 * 4
 * 2
 * 5
 * 6
 * 7
 */

// 29.
// console.log(1);
    
// setTimeout(() => {
//   console.log(2);
//   Promise.resolve().then(() => {
//     console.log(3)
//   });
// });

// new Promise((resolve, reject) => {
//   console.log(4)
//   resolve(5)
// }).then((data) => {
//   console.log(data);
// })

// setTimeout(() => {
//   console.log(6);
// })

// console.log(7);
/**
 * 1
 * 4
 * 7
 * 5
 * 2
 * 3
 * 6
 */

// 30.
// Promise.resolve().then(() => {
//   console.log('1');
//   throw 'Error';
// }).then(() => {
//   console.log('2');
// }).catch(() => {
//   console.log('3');
//   throw 'Error';
// }).then(() => {
//   console.log('4');
// }).catch(() => {
//   console.log('5');
// }).then(() => {
//   console.log('6');
// });
/**
 * 1
 * 3
 * 5
 * 6
 * 题解: 
 * catch() 中如果没有报错，后续的 then() 也是会执行的
 */