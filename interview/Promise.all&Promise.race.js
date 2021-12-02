// --------------------- Promise.all() ---------------------
/**
 * MDN: 等待所有传入的参数都有结果之后才会有最终的结果
 * 1. Promise.all() 方法接收一个 promise 的 iterable 类型（Array、Map、Set都属于 ES6 的 iterable 类型）的输入，
 *    并且只返回一个 Promise 实例，输入的所有 Promise 的 resolve 回调的结果将以一个数组返回。
 * 2. 这个 Promise 的 resolve 回调执行是在所有输入的 Promise 的 resolve 回调都结束，或者输入的 iterable 里没有 Promise 了的时候。
 * 3. reject 回调执行时机: 只要任何一个输入的 Promise 的 reject 回调执行或者输入不合法的 promise 就会立即抛出错误，并且 reject 的是第一个抛出的错误信息。
 */
// 用法:
const promise1 = Promise.resolve(3);
const promise2 = 42;
const promise3 = new Promise((resolve, reject) => {
  setTimeout(resolve, 1000, 'foo');
});

Promise.all([promise1, promise2, promise3]).then((values) => {
  console.log(values);
});
// 返回结果: [ 3, 42, 'foo' ]

/**
 * 实现
 * @param {Array、Map、Set}} iterable 所有的 iterable 类型数据
 * @returns Promise，结果是数组。
 * 整体思路:
 *    遍历传入的参数，每个都去执行对应的 then 方法，当 then 的回调被执行的时候将当前结果添加到一个数组(result)中用于最终返回，并且记录下这是第几次调用 then 方法，
 *    当调用次数和传入的参数的个数一样的时候，说明 resolve 方法全部执行完毕，然后调用 Promise 的 resolve 方法将前边定义的数组返回。
 * 核心思路:
 *  1. Promise.all() 返回的肯定是一个 Promise，所以可以直接在方法内部 return new Promise()。
 *  2. 遍历传入的参数，用 Promise.resolve() 将每个参数包一层，使其变成一个 Promise 对象。
 *  3. 什么时候进行最终的 resolve，也就是将最终的结果向外抛。
 *     使用计数的方式，在 then 方法内部进行计数，并判断计数之后是否和传入参数的个数相等，如果相等则进行最终的 resolve。
 *     如果任何一个 Promise 失败则调用 reject() 方法。
 *  4. 官方规定可传入的参数是可遍历（iterable 类型）的就可以，并没有说一定是一个数组。
 */
Promise.myAll = function (iterator) {
  // 不存在直接 return
  if (!iterator) return

  // 用于计数
  let count = 0
  // 传入 iterator 内部的数量
  const len = iterator.length
  // 用于存放最终结果
  const result = []
  /**
   * 为了统一遍历，将传入的参数转为数组。
   * 这里不用担心转换出错，因为官方规定必须是 iterable 类型，所以转换不会出错
   */
  const list = Array.from(iterator)

  return new Promise((resolve, reject) => {
    list.forEach((item, index) => {
      /**
       * 这里用 Promise.resolve() 包装是为了解决 item 不是 Promise 类型的情况，
       * 这里包装一下，使之都称为 Promise。
       */
      Promise.resolve(item).then(res => {
        // 这里没有采取 push 的原因是为了保持最终返回结果要保持和传入参数的一样的顺序。
        result[index] = res
        ++count
        // 如果 resolve 的总数和传入参数的个数相等了则进行最终的 resolve
        if (count === len) {
          // 将所有 item 的结果返回
          resolve(result)
        }
      }).catch(err => {
        // 一旦有 error 则 reject()
        reject(err)
      })
    })
  })
}
// 测试
Promise.myAll([promise1, promise2, promise3]).then((values) => {
  console.log(values);
});

// --------------------- Promise.race() ---------------------
/**
 * MDN: 方法返回一个 promise，一旦迭代器中的某个promise解决或拒绝，返回的 promise就会解决或拒绝。
 * 实现: 可根据 Promise.all(）改版即可
 */
Promise.myRace = function (iterator) {
  if (!iterator) return
  // 是否已经有 resolve 的了
  let flag = false
  /**
   * 为了统一遍历，将传入的参数转为数组。
   * 这里不用担心转换出错，因为官方规定必须是 iterable 类型，所以转换不会出错
   */
  let list = Array.from(iterator)

  return new Promise((resolve, reject) => {
    for (let index = 0; index < list.length; index++) {
      const item = list[index];
      /**
       * 这里用 Promise.resolve() 包装是为了解决 item 不是 Promise 类型的情况，
       * 这里包装一下，使之都称为 Promise。
       */
      Promise.resolve(item).then(res => {
        // 只要有一个 resolve 了，则后面的都忽略
        if (!flag) {
          flag = true
          resolve(res)
        }
      }).catch(err => {
        reject(err)
      })
    }
  })
}