// 前置知识 ----------------------------------------------------------------------
// 1. 
// function timeout(ms) {
//   return new Promise((resolve, reject) => {
//     setTimeout(resolve, ms, 'done') // 第三个及以后的参数都会作为第一个参数(函数)的参数传入
//   })
// }

// timeout(100).then(value => {
//   console.log(value)
// })

// 2. 
// const p1 = new Promise(function(resolve, reject) {
//   // ...
// })
// const p2 = new Promise(function(resolve, reject) {
//   // ...
//   // p1 的状态决定了 p2 的状态。如果 p1 的状态是 pending，则 p2 的回调函数就会等待 p1 的状态改变。
//   // 如果 p1 的状态已经是 resolved 或者 rejected, 那么 p2 的回调函数将会立即执行。
//   resolve(p1) // 将 p1 传入。等于: 一个异步操作的结果是返回另一个异步操作
// })

/**
 * eg: 
 * 这里的 p2 中的 setTimeout 会先于 p1 中的 setTimeout 执行，但是由于 p2 中的 resolve 传入的是 p1, 所以 p2 的状态会由 p1 来决定。
 * 当 p2 开始执行的时候 p1 的状态还是 pending, 所以会等待 p1 的执行，当 p1 执行完毕之后，因为抛出了一个 error，所以 p2 的执行也会进入 catch 中。
 */
// const p1 = new Promise((resolve, reject) => {
//   setTimeout(() => reject(new Error('fail')), 3000)
// }) 

// const p2 = new Promise((resolve, reject) => {
//   setTimeout(() => resolve(p1), 1000)
// })

// p2
//   .then(result => console.log(result))
//   .catch(error => console.log(error))

// 3. resolve/rejecet 不会阻止代码的执行，并且其后边的代码会先于其执行。因为立即 resolved 的 Promise 是在本轮事件循环的末尾执行，总是晚于本轮事件循环的同步任务
// new Promise((resolve, reject) => { // 执行结果: 2 1 
//   console.log(2)
//   resolve(1)
// }).then(v => {
//   console.log(v)
// })

/**
 * 4. then 方法返回得到是一个新的 Promise 实例(注意: 不是原来那个 Promise 实例)。因此可以采用链式写法。 
 *    采用链式的 then， 可以指定一组按照次序调用的回调函数。这时，前一个回调函数，有可能返回的还是一个 Promise 对象(即异步操作)，
 *    这时，后一个回调函数，就会等待该 Promise 对象的状态发生变化，才会被调用
 */

// 实现 ----------------------------------------------------------------------
/**
 * 实现流程:
 *  1. 最基本的功能
 *      1. Promise 中传入的回调函数立即执行
 *      2. 有三个状态: pending/resolved/rejected, 
 *         改变状态只能调用 resolve 将 pending 改为 resolved, 或者调用 reject 将 pending 改为 rejected
 *      3. 因为 then 在 promise 的实例上调用，所以 then 是定义在原型上的
 *      4. 状态为 resolved 则调用 then 的第一个回调，状态为 rejected 则调用 then 的第二个回调
 *  2. 增加异步处理逻辑
 *    eg: 
 *      const promise = new Promise((resolve, reject) => {
 *        setTimeout(() => {
 *          console.log('这是两秒之后的执行结果')
 *        }, 2000)
 *      })
 *      promse.then(value => {
 *        console.log(value)
 *      }, reason => {
 *        console.log(reason)
 *      })
 *    现象: 
 *      如上的 eg 不会答应任何结果: 
 *        同步代码立即执行， setTimeout 是异步代码。
 *        then 会立即执行，这个时候 Promise 的状态还是 pending， 不会进行执行任何操作， 
 *        当异步代码执行完毕之后，同步代码已经在其开始执行的时候就已经执行完毕了。 所以这个时候什么都不会打印
 *    实现:
 *      定义缓存，用来存储成功和失败的回调函数。
 *      在 then 中判断 resolvedCallback/rejectedCallback 如果 state 是 pending 状态的话则将其进行缓存
 *      在 resolve/reject 中判断如果有缓存则执行缓存。
 *  3. then 方法多次调用。 如果执行器中的是同步的则直接返回当前值就行；如果是异步回调，则需要分别保存成功和失败的回调。
 *    eg: 
 *      const promise = new MyPromise((resolve, reject) => {
 *        setTimeout(() => {
 *          resolve('这是两秒之后的执行结果')
 *        }, 2000)
 *      })
 *      promise.then(value => {
 *        console.log(1)
 *        console.log(`resolve => ${value}`)
 *      })
 *      promise.then(value => {
 *        console.log(2)
 *        console.log(`resolve => ${value}`)
 *      })
 *      promise.then(value => {
 *        console.log(3)
 *        console.log(`resolve => ${value}`)
 *      })
 *    现象: 
 *      只会打印: 3 \n resolve => 这是两秒之后的执行结果
 *      正常应该是 1 2 3 都会答应出来
 *    实现:
 *      跟踪代码可以发现，问题是出在 then 方法中对缓存的赋值上。多次调用 then 方法，后一次都会将前一次的缓存覆盖掉，所以最终只会打印出最后一次调用的结果。
 *      可将 resolvedCache 和 rejectedCache 分别改为数组，每次有回调需要缓存的时候向数组中 push，在执行的时候遍历数组从头分别执行
 *  4. then 方法的链式调用
 *      then 方法要链式调用那么就需要返回一个 Promise 对象，
 *      在使用 then 方法的时候，里面 return 一个返回值作为下一个 then 方法的参数。 实现 then 方法的时候需要判断: 如果是 return 一个 Promise 对象，那么就需要判断它的状态(调用 then 方法，交给 then 去处理)
 *    eg: 
 *      const promise = new MyPromise((resolve, reject) => {
 *        resolve('success')
 *      })
 *      function other() {
 *        return new MyPromise((resolve, reject) => {
 *          resolve('other')
 *        })
 *      }
 *      promise.then(value => {
 *        console.log(1)
 *        console.log(`resolve => ${value}`)
 *        return other()
 *      }).then(value => {
 *        console.log(2)
 *        console.log(`resolve => ${value}`)
 *        return 123
 *      }).then(value => {
 *        console.log(3)
 *        console.log(`resolve => ${value}`)
 *      })
 *  5. then 方法链式调用识别 then 的 callback 中 return 的 Promise 是否是自己。 如果是自己的话会报错。
 *    eg:
 *      const promise = new Promise((resolve, reject) => {
 *        resolve(100)
 *      })
 *      const p1 = promise.then(value => {
 *        console.log(value)
 *        return p1
 *      })
 *    实现:
 *      在 then 中判断一下 resolve callback 的返回值是否等于自身
 *  6. 执行器中错误捕获
 *  7. 参考 resolved 状态的处理方式，对 pending 和 rejected 状态进行改造
 *    1. 增加异步状态下的链式调用
 *    2. 增加回调函数执行结果的判断
 *    3. 增加 then 方法链式调用识别 then 的 callback 中 return 的 Promise 是否是自己。
 *    4. 增加错误捕获
 *  8. 将 then 的 callback 改为可选参数
 *  9. 实现 resolve 和 reject 的静态方法
 *    TIP:
 *      1. public 是定义在原型或者 this 上的
 *      2. static 是直接在 function 上 . 出来的
 *      3. private 是定义在局部作用域中的，类似于闭包
 */
function MyPromise(executor) {
  // 状态
  this.state = 'pending'
  // 成功之后的值
  this.value = null
  // 失败的原因
  this.reason = null
  // 存放异步成功的缓存
  this.resolvedCache = []
  // 存放异步失败的缓存
  this.rejectedCache = []

  /**
   * 这里采用箭头函数而不采用函数声明的原因: 是因为 this 指向的问题
   * 函数声明:
   *  function test () {}
   * 如果采用函数声明， this 指向是不固定的， 而采用箭头函数 this 是由外层的普通函数来决定的， 这个是在定义的时候就决定了的。 
   * eg: 
   *   new Promise((resolve, reject) => {
   *     resolve('...')
   *     // 这里调用 reject， 就会导致 reject 函数中的 this 指向 window/global， 而不是 MyPromise。 但是在 reject 函数中需要取到当前函数中的 state， 由于 this 的错误指向也就不会取到正确的值。
   *     reject('...')
   *   })
   */
  // function reject(_reason) {
  const reject = (_reason) => {
    /**
     * promise 只可以从 pending 改变到 rejected/resolved, 如果已经是 rejected/resolved 则无法更改状态
     * eg: 其中一种情况
     *    new Promise((resolve, reject) => {
     *      resolve('...') // 这里先调用 resolve， 下边又调用了 reject， 这个时候如果没有 if (this.state === 'pending') { } 的判断，则还会改变 state， 这个时候就违背了 promise 的原则。
     *      reject('...')
     *    })
     */
    if (this.state === 'pending') {
      // 修改状态
      this.state = 'rejected'
      // 保存失败原因
      this.reason = _reason
      // 循环执行异步回调。 循环调用的原因见上边实现流程中 3。
      while (this.rejectedCache.length) {
        // shift() 删除数组中的第一个元素并返回。这不是一个纯函数，会改变原数组。
        this.rejectedCache.shift()(this.reason)
      }
    }
  }
  /**
   * 这里采用箭头函数而不采用函数声明的原因: 是因为 this 指向的问题
   * 函数声明:
   *  function test () {}
   * 如果采用函数声明， this 指向是不固定的， 而采用箭头函数 this 是由外层的普通函数来决定的， 这个是在定义的时候就决定了的。 
   * eg: 
   *   new Promise((resolve, reject) => {
   *     // 这里调用 resolve 就会导致 resolve 函数中的 this 指向 window/global， 而不是 MyPromise。 但是在 resolve 函数中需要取到当前函数中的 state， 由于 this 的错误指向也就不会取到正确的值。
   *     resolve('...')
   *     reject('...')
   *   })
   */
  // function resolve(_value) {
  const resolve = (_value) => {
    /**
     * promise 只可以从 pending 改变到 rejected/resolved, 如果已经是 rejected/resolved 则无法更改状态
     * eg: 其中一种情况
     *    new Promise((resolve, reject) => {
     *      resolve('...') // 这里先调用 resolve， 下边又调用了 reject， 这个时候如果没有 if (this.state === 'pending') { } 的判断，则还会改变 state， 这个时候就违背了 promise 的原则。
     *      reject('...')
     *    })
     */
    if (this.state === 'pending') {
      // 保存状态
      this.state = 'resolved'
      // 保存成功后的值
      this.value = _value
      // 循环执行异步回调。 循环调用的原因见上边实现流程中 3。
      while (this.resolvedCache.length) {
        // shift() 删除数组中的第一个元素并返回。这不是一个纯函数，会改变原数组。ƒ
        this.resolvedCache.shift()(this.value)
      }
    }
  }

  // 捕获执行器的异常
  try {
    // 指向传入的函数， 对应到 promise 中就是立刻执行 Promise 的回调函数。
    executor(resolve, reject)
  } catch (error) {
    // 有错误直接执行 reject
    reject(error)
  }
}

/**
 * 这里的 then 不可以改为箭头函数。
 *  如果是箭头函数， 箭头函数中的 this 会指向谁？
 */ 
MyPromise.prototype.then = function (resolvedCallback, rejectedCallback) {
  // 将 resolvedCallback 和 rejectedCallback 改为可选参数
  resolvedCallback = typeof resolvedCallback === 'function' ? resolvedCallback : value => value
  /**
   * 问: rejectedCallback : () => { throw this.reason } 这里的 throw this.reason, 为什么不像 resolvedCallback 那样直接 return reason, 而是 throw reason?
   * 答: 如果说这个 Promise 失败了， 同时 rejectedCallback 也没有传， 这样这个错误就会被吞掉。 
   *     而采用 throw 则会将 resolvedCallback 的状态也置为失败， 这样在外界就可以收到 resolvedCallback 的结果， 可以做出对应的处理。
   */
  rejectedCallback = typeof rejectedCallback === 'function' ? rejectedCallback : (reason) => { throw reason }

  // 为了链式调用，这里直接创建一个 Promise 实例，并将实例 return 出去。
  const promise2 = new MyPromise((resolve, reject) => {
    // 成功时触发成功的回调
    if (this.state === 'resolved') {
      // 创建一个微任务等待 promise2 完成初始化
      queueMicrotask(() => {
        try {
          // 接收成功回调(第一个参数)的返回值
          const successRes = resolvedCallback(this.value)
          /**
           * 1. 对 resolve 的返回结果进行处理
           * 2. 将 promise2 传入是为了解决实现步骤 5 中的问题: then 方法链式调用识别 then 的 callback 中 return 的 Promise 是否是自己。
           *    promise2 是 new MyPromise 的实例，但是咱们又要在 new MyPromise 中使用这个实例，这个时候会抛出错误: 
           *      Cannot access 'p1' before initialization
           *    因为上边这个错误，所以需要创建一个微任务，在微任务中进行处理
           */
          resolvePromise(promise2, successRes, resolve, reject)
        } catch (error) {
          reject(error)
        }
      })
    }
    // 失败时触发失败的回调
    if (this.state === 'rejected') {
      // 创建一个微任务等待 promise2 完成初始化
      queueMicrotask(() => {
        try {
          // 接收失败回调(第二个参数)的返回值
          const rejectRes = rejectedCallback(this.reason)
          /**
           * 1. 对 reject 的返回结果进行处理
           * 2. 将 promise2 传入是为了解决实现步骤 5 中的问题: then 方法链式调用识别 then 的 callback 中 return 的 Promise 是否是自己。
           *    promise2 是 new MyPromise 的实例，但是咱们又要在 new MyPromise 中使用这个实例，这个时候会抛出错误: 
           *      Cannot access 'p1' before initialization
           *    因为上边这个错误，所以需要创建一个微任务，在微任务中进行处理
           */
          resolvePromise(promise2, rejectRes, resolve, reject)
        } catch (error) {
          reject(error)
        }
      })
    }
    // 状态仍然为 pending 时， promise 中有异步函数
    if (this.state === 'pending') {
      // 将成功的回调缓存起来， 等获取到成功的结果(resolve 函数中)的时候再执行
      this.resolvedCache.push(() => {
        queueMicrotask(() => {
          try {
            // 接收成功回调(第一个参数)的返回值
            const res = resolvedCallback(this.value)
            /**
             * 1. 对 resolve 的返回结果进行处理
             * 2. 将 promise2 传入是为了解决实现步骤 5 中的问题: then 方法链式调用识别 then 的 callback 中 return 的 Promise 是否是自己。
             *    promise2 是 new MyPromise 的实例，但是咱们又要在 new MyPromise 中使用这个实例，这个时候会抛出错误: 
             *      Cannot access 'p1' before initialization
             *    因为上边这个错误，所以需要创建一个微任务，在微任务中进行处理
             */
            resolvePromise(promise2, res, resolve, reject)
          } catch (error) {
            reject(error)
          }
        })
      })
      // 将失败的回调缓存起来， 等获取到失败的结果(reject 函数中)的时候再执行
      this.rejectedCache.push(() => {
        queueMicrotask(() => {
          try {
            // 接收成功回调(第一个参数)的返回值
            const res = rejectedCallback(this.reason)
            /**
             * 1. 对 resolve 的返回结果进行处理
             * 2. 将 promise2 传入是为了解决实现步骤 5 中的问题: then 方法链式调用识别 then 的 callback 中 return 的 Promise 是否是自己。
             *    promise2 是 new MyPromise 的实例，但是咱们又要在 new MyPromise 中使用这个实例，这个时候会抛出错误: 
             *      Cannot access 'p1' before initialization
             *    因为上边这个错误，所以需要创建一个微任务，在微任务中进行处理
             */
            resolvePromise(promise2, res, resolve, reject)
          } catch (error) {
            reject(error)
          }
        })
      })
    }
  })
  return promise2
}

// resolve 静态方法
MyPromise.resolve = (parameter) => {
  // 如果传入的是一个 Promise 则直接 return
  if (parameter instanceof MyPromise) {
    return parameter
  }
  // 常规方式处理
  // return new MyPromise((resolve, reject) => {
  //   resolve(param)
  // })
  // 等同于上边的
  return new MyPromise(resolve => {
    resolve(parameter)
  })
}

// reject 静态方法
MyPromise.reject = (reason) => {
  return new MyPromise((resolve, reject) => {
    reject(reason)
  })
}

/**
 * 对 then 的参数(resolvedCallback 和 rejectedCallback)的返回结果进行处理
 *  1. 传入 promise 是为了解决实现步骤 5 中的问题:  then 方法链式调用识别 then 的 callback 中 return 的 Promise 是否是自己。
 *  2. 解决值穿透的问题:
 *    1. 当 then 返回的是一个普通值的时候， 要调用一次 promise2 的 resolve, 从而将 promise2 的 value 设置为 then 的返回值
 *    2. 当 then 返回的是一个 promise 的时候， 则调用它自身的 then 方法， 根据这个新的 promise 的结果来设置 promise2 的 value/reason. 
 *       如果返回的 promise 的状态已经是 resolved, 也就是说在这个 promise 中已经调用了 resolve 方法， 这个时候只需要调用 promise2 的 resolve 方法， 将新返回的 promise 的 value 赋值给 promise2 的 value.
 *       从而实现值穿透。
 */
function resolvePromise(promise, callbackRes, resolve, reject) {
  // 如果相等了则说明 callback 中 return 的是自身。
  if (promise === callbackRes) {
    return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
  }
  // 返回值如果也是 Promise 则调用其 then 方法，等待得到 Promise 的结果
  if (callbackRes instanceof MyPromise) {
    // 等待 Promise 的结果，交给 .then 来处理。（递归调用 then 方法）
    callbackRes.then(resolve, reject)
  }
  // 返回值是普通值
  else {
    // 将结果直接返回
    resolve(callbackRes)
  }
}



// 使用 ----------------------------------------------------------------------
// 1. 基本功能
// const promise = new MyPromise((resolve, reject) => {
//   // const promise = new Promise((resolve, reject) => {
//   resolve('resolved')
//   reject('rejected')
// })

// promise.then(value => {
//   console.log(`resolved => ${value}`)
// }, reason => {
//   console.log(`rejected => ${reason}`)
// })

// 2. 增加异步
// const promise = new MyPromise((resolve, reject) => {
//   setTimeout(() => {
//     /**
//      * 这个时候不会打印任何结果: 
//      * 同步代码立即执行， setTimeout 是异步代码。
//      * then 会立即执行，这个时候 Promise 的状态还是 pending， 不会进行执行任何操作， 
//      * 当异步代码执行完毕之后，同步代码已经在其开始执行的时候就已经执行完毕了。 所以这个时候什么都不会打印
//      */
//     resolve('这是两秒之后的执行结果')
//   }, 2000)
// })

// promise.then(value => {
//   console.log(`resolved => ${value}`)
// }, reason => {
//   console.log(`rejected => ${reason}`)
// })

// 3. then 方法多次调用
// const promise = new MyPromise((resolve, reject) => {
//   setTimeout(() => {
//     resolve('这是两秒之后的执行结果')
//   }, 2000)
// })

// promise.then(value => {
//   console.log(1)
//   console.log(`resolve => ${value}`)
// })

// promise.then(value => {
//   console.log(2)
//   console.log(`resolve => ${value}`)
// })

// promise.then(value => {
//   console.log(3)
//   console.log(`resolve => ${value}`)
// })

// 4. then 方法的链式调用
// const promise = new MyPromise((resolve, reject) => {
//   resolve('success')
// })
// function other() {
//   return new MyPromise((resolve, reject) => {
//     resolve('other')
//   })
// }
// promise.then(value => {
//   console.log(1)
//   console.log(`resolve => ${value}`)
//   /**
//    * 在 other 方法中 return 了一个 promise，在 then 方法的实现中就需要注意: 必须等待这个 promise 有了结果，才能继续向下执行。
//    * 问题:
//    *  1. promise 中如果没有执行 resolve 是怎么阻断执行(没有执行 then 方法的 callback)的？
//    *     从源码中可以看到，其实是进入到了 then 方法中的，但是 then 方法中关于执行第一个参数(callback)的代码都是基于 promise 状态为 resolved 的。
//    *     而状态变为 resolved 又是通过调用 resolve 方法来改变的。
//    *     所以不调用 resolve 方法就不会执行 then 中的 callback。
//    *  1. 在 then 的 callback 中， 用户 return 了一个值，是怎么包装成 resolve 被返回的
//    *     在源码中，会先会去到 callback 的返回值，如果是一个普通的值，会直接被当做 resolve 方法的参数传入，这样也便于链式调用，作为下一个 then 的参数被传入。
//    */
//   return other()
// }).then(value => {
//   console.log(2)
//   console.log(`resolve => ${value}`)
//   return 123
// }).then(value => {
//   console.log(3)
//   console.log(`resolve => ${value}`)
// })

// 5. then 方法链式调用识别 then 的 callback 中 return 的 Promise 是否是自己。
//    如果是自己的话会报错
// const promise = new MyPromise((resolve, reject) => {
//   // const promise = new Promise((resolve, reject) => {
//   resolve(`success`)
// })
// const p1 = promise.then(value => {
//   console.log(1)
//   console.log(`resolve => ${value}`)
//   return p1 // TypeError: Chaining cycle detected for promise #<Promise>
// })
// p1.then(value => {
//   console.log(2)
//   console.log(`resolve => ${value}`)
// }, reason => {
//   console.log(3)
//   console.log(reason.message)
// })

// 6. 捕获执行器错误
// const promise = new MyPromise((resolve, reject) => {
//   resolve('success')
// })
// promise.then(value => {
//   console.log(1)
//   console.log(value)
//   throw new Error('error info')
// }, reason => {
//   console.log(2)
//   console.log(reason)
// }).then(value => {
//   console.log(3)
//   console.log(value)
// }, reason => {
//   console.log(4)
//   console.log(reason.message)
// })

// 7. 将 then 的 callback 改为可选参数
// const promise = new MyPromise((resolve, reject) => {
//   // resolve('success')
//   reject('reject')
// })
// promise.then().then().then().then(value => console.log(value), reason => console.log(reason))

// 8. 实现 resolve 和 reject 的静态调用
MyPromise.resolve().then(() => {
  console.log(0)
})
