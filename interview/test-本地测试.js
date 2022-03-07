// isEqual 判断两个对象是否全相等
// const obj1 = {
//   a: 1,
//   b: 2,
//   c: {
//     q: 1,
//     w: 2,
//     e: 3,
//     r: [1, 2, 3]
//   }
// }

// const obj2 = {
//   a: 1,
//   b: 2,
//   c: {
//     q: 1,
//     w: 2,
//     e: 3,
//     r: [1, 2, 3]
//   }
// }

function isObject(obj) {
  return typeof obj === 'object' && obj !== null
}

function isEqual(obj1, obj2) {
  // 1. 两个参数不是对象则直接比较
  if (!isObject(obj1) || !isObject(obj2)) return obj1 === obj2

  /**
   * 2. obj1 等于 obj2 (调用 isEqual 时传入的两个参数是同一个对象)
   *    这一步在前是不是就可以省略掉判断这两个参数是不是对象了? 
   *      不可以，后边会调用 Object.keys() 判断这个两个参数的个数是否一样，这个时候如果是字符串的话就会把字符串的内容每一个都拆分开，这个时候就不对了
   *      Object.keys('123') => ['1', '2', '3']
   *      如果传入的是一个 null 的话就直接报错了
   */
  if (obj1 === obj2) return true

  // 3. 两个参数的 key 的个数是否一样
  const obj1Vals = Object.keys(obj1)
  const obj2Vals = Object.keys(obj2)
  // 个数不一样
  if (obj1Vals.length !== obj2Vals.length) return false

  // 4. 基于 obj1 中的 key 和 obj2 做递归对比
  for (const key in obj1) {
    if (Object.hasOwnProperty.call(obj1, key)) {
      // 递归调用 isEqual 对比当前 key 对应的 value 是否相等
      const res = isEqual(obj1[key], obj2[key])
      // 如果返回的是 true 则继续比较其他 key 这里不做任何处理
      // 如果返回的是 false 则直接 return 也就不用继续比较其他 key 了
      if (!res) {
        return false
      }
    }
  }
  // 5. 循环中没有 return 的话说明 这两个参数是完全相等的，因为如果有不相等的值在 for 循环中就被 return 了
  return true
}

// console.log(isEqual(obj1, obj2))

// ------------------------------------------------------------------------------------------------------------------------

// pop push unshift shift 的区别
// const arr = [1, 2, 3, 4, 5]
// const popVal = arr.pop()
// console.log(arr) // [ 1, 2, 3, 4 ]
// console.log(popVal) // 5

// const arr = [1, 2, 3, 4, 5]
// const arrLen = arr.push(0)
// console.log(arr) // [ 1, 2, 3, 4, 5, 0 ]
// console.log(arrLen) // 6

// const arr = [1, 2, 3, 4, 5]
// const arrLen = arr.unshift(0)
// console.log(arr) // [ 0, 1, 2, 3, 4, 5 ]
// console.log(arrLen) // 6

// const arr = [1, 2, 3, 4, 5]
// const arrLen = arr.shift()
// console.log(arr) // [ 2, 3, 4, 5 ]
// console.log(arrLen) // 1

// ------------------------------------------------------------------------------------------------------------------------
// 数组的纯函数: concat map filter slice
// const arr = [1, 2, 3, 4, 5]
// const newArr = arr.concat([9, 8, 7])
// console.log(arr) // [ 1, 2, 3, 4, 5 ]
// console.log(newArr) // [ 1, 2, 3, 4, 5, 9, 8, 7 ]

// const arr = [1, 2, 3, 4, 5]
// const newArr = arr.map(item => item * 4)
// console.log(arr) // [ 1, 2, 3, 4, 5 ]
// console.log(newArr) // [ 4, 8, 12, 16, 20 ]

// const arr = [1, 2, 3, 4, 5]
// const newArr = arr.filter(item => item > 2)
// console.log(arr) // [ 1, 2, 3, 4, 5 ]
// console.log(newArr) // [ 3, 4, 5 ]

// const arr = [1, 2, 3, 4, 5]
// const newArr = arr.slice(0, 3)
// console.log(arr) // [ 1, 2, 3, 4, 5 ]
// console.log(newArr) // [ 1, 2, 3 ]

// ------------------------------------------------------------------------------------------------------------------------
// slice 和 splice 的区别
// slice 有第二个参数的时候，返回的数组是不包含第二个参数对应值的
// const arr = [1, 2, 3, 4, 5]
// const arr2 = arr.slice(2, 4) // [3, 4]
// console.log(arr, arr2)

// 从后往前截取传入负数即可
// const arr = [1, 2, 3, 4, 5]
// const arr2 = arr.slice(-2) // [4, 5]
// console.log(arr, arr2)

// splice
// const arr = [1, 2, 3, 4, 5]
// // 将从 1 一个索引开始删除 2 个元素，将 a 和 b 插入到从 1 开始的位置
// const arr2 = arr.splice(1, 2, 'a', 'b')
// console.log(arr)
// console.log(arr2)

// ------------------------------------------------------------------------------------------------------------------------
/**
 * [10, 20, 30].map(parseInt) 的执行结果 => [ 10, NaN, NaN ]
 * [10, 20, 30].map(parseInt) 等同于: [10, 20, 30].map((item, index) => parseInt(item, index))
 * parseInt 第二个参数的规则: 
 *    第二个参数表示要解析的数字的基数。
 *    该值介于 2 ~ 36 之间。如果省略该参数或其值为 0，则数字将以 10 为基础来解析。
 *    如果它以 “0x” 或 “0X” 开头，将以 16 为基数。如果该参数小于 2 或者大于 36，则 parseInt() 将返回 NaN。
 * 执行过程:
 * 1. parseInt 第二个参数为 0 则表示 10 进制， 结果为 10
 * 2. parseInt 第二个参数为 1，而第二个参数的范围必须是在 2 - 36 之间，所以这是一个无效参数，返回 NaN
 * 3. parseInt 第二个参数为 2，这个时候第二个参数是正确的，但是第一个参数 3 是不合法的二进制数组，返回 NaN
 */

// ------------------------------------------------------------------------------------------------------------------------
// 函数和变量重名，哪个优先级更高一些，最后会采用哪个 => 变量
// var test = '变量'

// function test() {
//   console.log('test fn')
// }

// console.log(test) // 变量

// ------------------------------------------------------------------------------------------------------------------------
// 手写 trim 方法
// String.prototype.myTrim = function () {
//   // \s => 只要出现空白就匹配
//   // \S => 非空白就匹配
//   // + => 一个或多个
//   return this.replace(/^\s+/, '').replace(/\s+$/, '')
// }
// const str = '    哈哈      '
// console.log(str.length) // 12
// console.log(str.myTrim().length) // 2

// ------------------------------------------------------------------------------------------------------------------------
// 手写 max 方法
// function max() {
//   // 获取所有参数
//   const args = Array.prototype.slice.call(arguments)
//   // console.log(args)
//   let maxVal

//   args.forEach(item => {
//     // !maxVal: 第一次循环 maxVal 是 undefined 所以需要将 item 赋值给它
//     // maxVal < item: item 大于上一次的 maxVal
//     if (!maxVal || maxVal < item) maxVal = item
//   })
//   return maxVal
// }

// console.log(max(1, 2, 3, 99, 20, 10, 30))

// ------------------------------------------------------------------------------------------------------------------------
/**
 * 手写 flatern 函数，将多维数组转换位一维数组
 * 整体思路:
 *    1. 将二维数组降为一维数组可通过: Array.prototype.concat.apply([], targetArr)
 *    2. targetArr 就是被降维的数组
 *    3. 如果数组中还有数组则递归调用 1
 */
function flat(arr) {
  // 1. arr 中是否还有数组
  const isDeep = arr.some(item => item instanceof Array)
  // 2. 没有数组了说明是一个一维数组，可以 return
  if (!isDeep) return arr
  // 3. 有数组则处理
  const res = Array.prototype.concat.apply([], arr)
  // 4. 递归调用处理
  return flat(res)
}
const arr1 = [1, 2, 3, [5, 6, 7, [8, 9, 0, 10, 11, [12, 13, 14, 15]]]]
// console.log(flat(arr1))

/**
 * 为什么通过 Array.prototype.concat.apply([], arr) 可以将二维数组降维？
 *    1. apply 的第二个参数会被作为参数一次传入到 concat 中，相当于是将 arr 给解构了
 *        相当于 Array.prototype.concat.apply([], [1, 2, 3, [5, 6, 7]]) 会转换成 [].concat(1, 2, 3, [5, 6, 7])
 *    2. concat 它的参数如果是一个数组的话，它会将数组中的每一项作为参数放到 concat 的返回值中
 *        相当于 [].concat(1, 2, 3, [5, 6, 7]) 会转换成 [ 1, 2, 3, 5, 6, 7 ]
 *        对应到 MDN 中的解释: concat方法创建一个新的数组，它由被调用的对象中的元素组成，每个参数的顺序依次是该参数的元素（如果参数是数组）或参数本身（如果参数不是数组）。它不会递归到嵌套数组参数中。
 */
// const arr = [1, 2, 3, [5, 6, 7]]
// const arr2 = []
// console.log(Array.prototype.concat.apply(arr2, arr)) // [ 1, 2, 3, 5, 6, 7 ]
// console.log(arr2.concat(arr)) // [ 1, 2, 3, [ 5, 6, 7 ] ]
// console.log(arr2.concat(1, 2, 3, [5, 6, 7])) // [ 1, 2, 3, 5, 6, 7 ]

// ------------------------------------------------------------------------------------------------------------------------
// 数组去重
// 1. for 循环的方式
function unique(arr) {
  const result = []
  arr.forEach(item => {
    if (!result.includes(item)) {
      result.push(item)
    }
  })
  return result
}

// 2. new set()
function unique(arr) {
  return [...new Set(arr)]
}

// const arr = [1, 1, 1, 2, 3, 4, 5, 6, 99, 0, 2, 44, 2, 333, 444, 9, 9, 9]
// console.log(unique(arr))

// ------------------------------------------------------------------------------------------------------------------------
// 深拷贝
// function deepClone(obj) {
//   if (!obj || typeof obj !== 'object') return obj
//   const result = typeof Array.isArray(obj) ? [] : {}
//   for (const key in obj) {
//     if (Object.hasOwnProperty.call(obj, key)) {
//       result[key] = typeof obj[key] === 'object' ? deepClone(obj[key]) : obj[key]
//     }
//   }
//   return result
// }

function isObject(obj) {
  return typeof obj === 'object' || obj !== null
}

const deepCloneObj = {
  a: 1,
  b: 2,
  c: {
    q: 1,
    w: 2,
    e: 3,
    r: [1, 2, 3]
  }
}

// const deepCloneRes = deepClone(deepCloneObj)
// console.log('deepClone(deepCloneObj) =>', deepCloneRes)
// deepCloneRes.a = 123
// console.log('deepClone(deepCloneObj) =>', deepCloneRes)
// console.log('deepCloneObj =>', deepCloneObj)

// ------------------------------------------------------------------------------------------------------------------------
/**
 * 编写 parse 函数，实现通过字符串访问对象里属性的值
 * 第一种解决方案
 */
function parse(obj, str) {
  /**
   * 解析: [Function](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function)
   *    new Function ([arg1[, arg2[, ...argN]],] functionBody)
   *    最终得到一个匿名函数，最后一个参数是函数内部的执行语句，前边的参数全部都是匿名函数的参数
   * eg: 
   *    new Function('obj', `return obj.a`) 返回结果是:
   *    function anonymous(obj) {
   *      return obj.a
   *    }
   */
  const fn = new Function('obj', `return obj.${str}`)
  return fn(obj)
}
/**
 * 第二种解决方案
 */
function parse(obj, str) {
  /**
   * d+: 最少有一个数字
   * (): 对要替换的地方进行分区
   * .$1: 第一个 () 就是第一个分区，对应的就是 $1, 意思就是将第一个分区替换为 .
   * g: 全局匹配
   */
  str = str.replace(/\[(\d+)\]/g, `.$1`)
  // 将 str 按 . 做分割，分别获取对应的值
  const strArr = str.split('.')
  strArr.forEach(item => {
    /**
     * for 循环中 obj = obj[item] 操作的原因:
     * 因为 parse 这个方法不是循环调用，所以可以直接更改 obj 这个对象；
     * 这样在遇到嵌套对象的时候，第一次获取到外层的对象，第二次就可以去这个对象里边的值了
     * eg:
     *  str = 'b.c'
     *  const strArr = str.split('.') // [b, c]
     *  // 第一次循环 strArr 的时候 obj 如下:
     *  obj = {
     *    a: 1,
     *    b: { c: 2 },
     *    d: [1, 2, 3],
     *    e: [
     *      {
     *        f: [4, 5, 6]
     *      }
     *    ]
     *  }
     *  // 当第一次循环 strArr 结束之后，obj 如下:
     *  obj = { c: 2 }
     *  // 第二次循环 strArr 的时候，循环的 item 就是 c 这个时候正好从 obj 中获取 c 的值
     */
    obj = obj[item]
  })
  return obj
}

// const obj = {
//   a: 1,
//   b: { c: 2 },
//   d: [1, 2, 3],
//   e: [
//     {
//       f: [4, 5, 6]
//     }
//   ]
// }

// const r1 = parse(obj, 'a')
// const r2 = parse(obj, 'b.c')
// const r3 = parse(obj, 'd[2]')
// const r4 = parse(obj, 'e[0].f[0]')

// console.log(r1)
// console.log(r2)
// console.log(r3)
// console.log(r4)

// ------------------------------------------------------------------------------------------------------------------------
// call
Function.prototype.myCall = function (context, ...args) {
  context = context || window
  const fn = Symbol()
  context[fn] = this
  const res = context[fn](...args)
  delete context[fn]
  return res
}

// apply
Function.prototype.myApply = function (context, args) {
  context = context || window
  const fn = Symbol()
  context[fn] = this
  const res = context[fn](...args)
  delete context[fn]
  return res
}

// const obj = {
//   a:1
// }
// global.a = 1
// function test(q, w, e) {
//   console.log(this.a)
//   console.log(q)
//   console.log(w)
//   console.log(e)
// }
// test('你好', '2', 3)
// test.myCall(obj, 'hah', '123', '124213')
// test.myApply(obj, ['hah', '123', '124213'])

function fn1() {
  // console.log(1)
}
function fn2() {
  // console.log(2)
}
// fn1.myCall.myCall(fn2)

// ------------------------------------------------------------------------------------------------------------------------
// bind
Function.prototype.myBind = function (context) {
  context = context || window
  const args = [...arguments].slice(1)
  const _self = this
  return Fn = () => {
    if (this instanceof Fn) new _self(...args, ...arguments)
    return _self.myApply(context, args.concat(...arguments))
  }
}

// ------------------------------------------------------------------------------------------------------------------------
// Object.create
// Object.prototype.myCrate = function (prototype) {
//   function F() { }
//   F.prototype = prototype
//   return new F()
// }

// ------------------------------------------------------------------------------------------------------------------------
/**
  实现这个 add 函数
  console.log(add(1, 2, 3, 4, 5))
  console.log(add(1, 2)(3)(4, 5))
  console.log(add(1)(2)(3)(4)(5))
 */
// 第一种解决方案: 通过闭包来缓存参数个数，当参数个数达到指定个数时进行参数求和
const add = ((total) => {
  // 缓存
  let args = []
  // 这里利用闭包来缓存参数
  return _add = (...innerArgs) => {
    // 将缓存中的参数和传入的参数合并
    args = [...args, ...innerArgs]
    // 当总参数个数等于 total 的时候进行求和操作
    if (args.length === total) {
      const res = args.reduce((prevVal, currVal) => prevVal + currVal, 0)
      /**
       * 这里的清空是为了解决多次调用 add 的问题:
       *    因为当进行求和的时候肯定是当前整个流程就结束了，所以要将闭包中的缓存(argTotalArr) 清除掉，否则下一次再调用 add 的时候还会访问到上一次的缓存
       *    否则在下一次调用 add 方法的时候，argTotalArr 内部还会存储着上一次的值，
       *    但是上一次调用 add 的内容和当前这次已经完全没有关系了，所以在每次求值之后要将闭包内的数据清空。
       */
      args = []
      return res
    }
    // 参数不够的话则将 _add 方法继续抛出，接收后续的参数
    else {
      return _add
    }
  }
})(5)

// console.log(add(1, 2, 3, 4, 5))
// console.log(add(1, 2, 3)(4, 5))
// console.log(add(1)(2)(3)(4)(5))

// 第二种解决方案: 通过 bind 函数来缓存参数， 利用 alert() 方法会默认调用 toString() 方法，这里来重写 toString() 方法把求值放到这里。
function add2(...args) {
  const _add = add2.bind(null, ...args)
  _add.toString = () => {
    return args.reduce((prevVal, currVal) => prevVal + currVal, 0)
  }
  return _add
}
// alert(add2(1, 2, 3, 4, 5))
// alert(add2(1, 2, 3)(4, 5))
// alert(add2(1)(2)(3)(4)(5))

/**
 * 第三种解决方案: 通过函数柯里化实现
 * 柯里化: 柯里化（Currying）是把接受多个参数的函数变换成接受一个单一参数(最初函数的第一个参数)的函数，并且返回接受余下的参数且返回结果的新函数的技术
 */
// 最终求值的方法
function _add(a, b, c, d, e) {
  return a + b + c + d + e
}
// 柯里化函数
// 这里也是利用了缓存参数个数，比较参数个数是否和求值方法的形参个数相等
function curry(fn, ...args) {
  // 参数个数不够的时候
  if (args.length < fn.length) {
    // 这里向外抛出一个函数用来继续接收参数
    return (...innerArgs) => curry(fn, ...innerArgs, ...args)
  }
  else {
    // 进行求和
    return fn(...args)
  }
}

const add3 = curry(_add)
// console.log(add3(1, 2, 3, 4, 5))
// console.log(add3(1, 2, 3)(4, 5))
// console.log(add3(1)(2)(3)(4)(5))

// ------------------------------------------------------------------------------------------------------------------------
// 手写 Promise
// function MyPromise(actuator) {
//   this.status = 'pending'
//   this.value = null
//   this.reason = null
//   this.resolvedCache = []
//   this.rejectedCache = []

//   this.resolve = (value) => {
//     if (this.status === 'pending') {
//       this.status = 'resolved'
//       this.value = value
//       while (this.resolvedCache.length) {
//         this.resolvedCache.shift()(this.value)
//       }
//     }
//   }
//   this.reject = (reason) => {
//     if (this.status === 'pending') {
//       this.status = 'rejected'
//       this.reason = reason
//       while (this.rejectedCache.length) {
//         this.rejectedCache.shift()(this.reason)
//       }
//     }
//   }

//   try {
//     actuator(this.resolve, this.reject)
//   } catch (error) {
//     this.reject(error)
//   }
// }

// MyPromise.prototype.then = function (resolvedCallback, rejectedCallback) {
//   const promise2 = new MyPromise((resolve, reject) => {
//     if (this.status === 'resolved') {
//       queueMicrotask(() => {
//         const res = resolvedCallback(this.value)
//         // 这里直接使用 promise2 会报错: Cannot access 'p1' before initialization
//         // 所以这里需要引入一个微任务: queueMicrotask
//         resolvePromise(promise2, res, resolve, reject)
//       })
//     } else if (this.status === 'rejected') {
//       queueMicrotask(() => {
//         const res = rejectedCallback(this.reason)
//         resolvePromise(promise2, res, resolve, reject)
//       })
//     } else if (this.status === 'pending') {
//       this.resolvedCache.push(() => {
//         queueMicrotask(() => {
//           try {
//             const res = resolvedCallback(this.value)
//             resolvePromise(promise2, res, resolve, reject)
//           } catch (error) {
//             this.reject(error)
//           }
//         })
//       })
//       this.rejectedCache.push(() => {
//         queueMicrotask(() => {
//           try {
//             const res = rejectedCallback(this.reason)
//             resolvePromise(promise2, res, resolve, reject)
//           } catch (error) {
//             this.reject(error)
//           }
//         })
//       })
//     }
//   })
//   return promise2
// }

// function resolvePromise(promise2, value, resolve, reject) {
//   if (promise2 === value) {
//     return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
//   }
//   if (value instanceof MyPromise) {
//     value.then(resolve, reject)
//   } else {
//     resolve(value)
//   }
// }

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

// const promise = new MyPromise((resolve, reject) => {
//   resolve(100)
// })
// const p1 = promise.then(value => {
//   console.log(value)
//   return p1
// }, reason => {
//   console.log(`error => ${reason}`)
// }).then(value => {
//   console.log(`success => ${value}`)
// }, reason => {
//   console.log(`error2 => ${reason}`)
// })

// ------------------------------------------------------------------------------------------------------------------------
// function Cat(name, age) {
//   console.log(this)
//   this.name = name
//   this.age = age
// }
// console.log(new Cat('123', 123)) // Cat {name: '123', age: 123}

// function Cat(name, age) {
//   console.log(this) // Cat {}
//   this.name = name
//   this.age = age
// }
// new Cat('123', 123)

function Cat(name, age) {
  this.name = name
  this.age = age
}
// console.log(new Cat('123', 123)) // Cat {name: '123', age: 123}

/**
 * 
 * @param {function} Fun 构造函数
 */
// function myNew(Fun) {
//   // 创建实例对象
//   const obj = {}

//   /**
//    * 将构造函数的原型赋值给实例对象
//    * eg: 在 Cat 的原型上定义了一个 sayHi() 方法，这个时候实例对象想要去调用的话就需要将实例对象的原型指向构造函数的原型，否则实例对象获取不到这个方法。
//    *     myNew(Cat, '123', 123).sayHi()
//    */
//   obj.__proto__ = Fun.prototype

//   // 获取 new 时的参数
//   const arg = Array.prototype.slice.call(arguments, 1)
//   // 将 this 指向实例对象
//   const res = Fun.apply(obj, arg)

//   // 如果构造函数中 return 的是对象 new 返回的就是这样对象，反之如果是基本类型，则返回实例对象 obj
//   return typeof res === 'object' ? res : obj
// }
// console.log(myNew(Cat, '123', 123))
// ------------------------------------------------------------------------------------------------------------------------
// var a = [1, 2, 3]
// console.log(a.constructor === Array) // true
// console.log(a.constructor === Object) // false

// var b = { name: 'test' }
// console.log(b.constructor === Array) // false
// console.log(b.constructor === Object) // true

// console.log([].__proto__ === [].constructor.prototype) // true
// console.log([].__proto__ === Array.prototype) // true
// // 同理
// console.log([].__proto__.constructor === Array) // true
// console.log([].__proto__.constructor === Object) // false

// ------------------------------------------------------------------------------------------------------------------------
// reduce()
// 求和
// const res = [1, 2, 3, 4, 5].reduce((count, cur) => count + cur, 0)
// console.log(res)

// 统计数组中每个元素出现的次数
// const res = [1, 1, 1, 1, 1, 3, 3, 4, 2, 5, 8, 9, 1, 3, 4, 1, 2, 2, 2, 9].reduce((count, cur) => {
//   count[cur] ? count[cur]++ : count[cur] = 1
//   return count
// }, {})
// console.log(res)

// ------------------------------------------------------------------------------------------------------------------------
// function getMax(arr) {
//   let maxValue = arr[0]
//   for(let i = 0; i < arr.length; i++) {
//     if (arr[i] > maxValue) {
//       maxValue = arr[i]
//     }
//   }
//   return maxValue
// }

// function getMax(arr) {
//   return Math.max.call(null, ...arr)
// }

// function getMax(arr) {
//   return arr.reduce((prevVal, currVal) => {
//     return prevVal > currVal ? prevVal : currVal
//   })
// }

function getMax(arr) {
  arr = arr.sort((a, b) => {
    return a - b
  })
  return arr[arr.length - 1]
}
// const arr = [2, 3, 4, 5, 6, 9, 10, 0, 100]
// console.log(getMax(arr))

// ------------------------------------------------------------------------------------------------------------------------
// function quchong(arr) {
//   const res = []
//   for (let index = 0; index < arr.length; index++) {
//     const element = arr[index];
//     if (!res.includes(element)) {
//       res.push(element)
//     }
//   }
//   return res
// }

// function quchong(arr) {
//   const res = arr.reduce((prevVal, currVal) => {
//     if (!prevVal.includes(currVal)) {
//       prevVal.push(currVal)
//     }
//     return prevVal
//   }, [])
//   return res
// }

function quchong(arr) {
  return Array.from(new Set(arr))
}

// const arr = [1, 1, 1, 1, 1, 1, 1, 5, 3, 2, 2, 2, 0, 8, 8, 90]
// console.log(quchong(arr))

// ------------------------------------------------------------------------------------------------------------------------
/**
 * 闭包的作用
 */
// 缓存的容器
const cachedBox = (() => {
  const cache = {}
  return {
    searchBox: (id) => {
      // 如果在内存中，直接返回
      if (id in cache) {
        return `缓存中查找的结果为: ${cache[id]}`
      }
      // 经过一段很耗时的 dealFn() 函数处理
      const result = dealFn(id)
      // 更新缓存的结果
      cache[id] = result
      // 返回计算的结果
      return `计算返回的查找结果为: ${cache[id]}`
    }
  }
})()
// 处理很耗时的函数
function dealFn(id) {
  // console.log(`这是一段很耗时的操作`)
  return id
}
// 两次调用 searchBox() 函数
// console.log(cachedBox.searchBox(1)) // 计算返回的查找结果为: 1
// console.log(cachedBox.searchBox(1)) // 缓存中查找的结果为: 1

// 使用数组模仿栈的实现
const stack = (() => {
  const arr = []
  return {
    push: (value) => {
      arr.push(value)
    },
    pop: () => {
      return arr.pop()
    },
    size: () => {
      return arr.length
    }
  }
})()
stack.push('abc')
stack.push('def')
// console.log(stack.size()) // 2
// console.log(stack.pop())
// console.log(stack.size()) // 1

// ------------------------------------------------------------------------------------------------------------------------
// 构造函数中定义实例的属性
// function Person(name, age, address) {
//   this.name = name
//   this.age = age
//   this.address = address
// }
// // 原型中添加实例共享的函数
// Person.prototype.getName = function() {
//   return this.name
// }
// // 生成两个实例
// const person = new Person('king', 11, {
//   name: '北京',
//   code: '123'
// })
// const person2 = new Person('king2', 12, {
//   name: '上海',
//   code: '222'
// })
// // 输出实例初始的 name 属性值
// console.log(person.name)
// console.log(person2.name)
// // 改变一个实例的属性值
// person.address.name = '广州'
// person.address.code = '111111'
// // 不影响另一个实例的属性值
// console.log(person2.address.name)
// console.log(person2.address.code)
// // 不同的实例共享相同的函数，因此在比较时是相等的
// console.log(person.getName === person2.getName)
// // 改变一个实例的属性，函数仍能正常执行
// person2.name = 'king3'
// console.log(person.getName())
// console.log(person2.getName())

// 构造函数中定义实例的属性
// function Person(name, age, address) {
//   this.name = name
//   this.age = age
//   this.address = address
//   if (!Person._initalized) {
//     // 原型中添加实例共享的函数
//     Person.prototype.getName = function() {
//       return this.name
//     }
//     Person._initialized = true
//   }
// }
// // 生成两个实例
// const person = new Person('king', 11, {
//   name: '北京',
//   code: '123'
// })
// const person2 = new Person('king2', 12, {
//   name: '上海',
//   code: '222'
// })
// // 输出实例初始的 name 属性值
// console.log(person.name) // king
// console.log(person2.name) // king2
// // 改变一个实例的属性值
// person.address.name = '广州'
// person.address.code = '111111'
// // 不影响另一个实例的属性值
// console.log(person2.address.name) // 上海
// console.log(person2.address.code) // 222
// // 不同的实例共享相同的函数，因此在比较时是相等的
// console.log(person.getName === person2.getName) // true
// // 改变一个实例的属性，函数仍能正常执行
// person2.name = 'king3'
// console.log(person.getName()) // king2
// console.log(person2.getName()) // king3


// ------------------------------------------------------------------------------------------------------------------------
// function Person1() {}
// Person1.prototype = {
//   // constructor: Person1,
//   name: '',
//   age: 0,
//   sayName: function() {
//     console.log(this.name)
//   }
// }
// console.log(Person1.prototype.constructor === Object) // true
// console.log(Person1.prototype.constructor === Person1) // false
// function Person1() {}
// const person1 = new Person1()
// Person1.prototype = {
//   name: '',
//   age: 0,
//   sayName: function() {
//     console.log(this.name)
//   }
// }
// const Person3 = new Person1()
// person1.sayName() // person1.sayName is not a function
// person3.sayName()

function Person() { }
const person = new Person()
// console.log(person.__proto__ === Person.prototype) // true
// console.log(person.__proto__.__proto__ === Person.prototype.__proto__) // true
// console.log(person.__proto__.__proto__.__proto__ === Object.prototype.__proto__) // true
// console.log(Object.prototype.__proto__) // null
// console.log(person.__proto__.__proto__.__proto__) // null

// ------------------------------------------------------------------------------------------------------------------------
// 继承
// 定义一个父类 Animal 
// function Animal(name) {
//   // 属性
//   this.type = 'Animal'
//   this.name = name || '动物'
//   // 实例函数
//   this.sleep = function () {
//     console.log(`${this.name}正在睡觉!`)
//   }
// }
// Animal.prototype.eat = function (food) {
//   console.log(`${this.name}正在吃${food}`)
// }
// // 原型链继承: 重写子类 prototype 属性，将其指向父类的实例
// function Cat(name) {
//   this.name = name
// }
// // 原型链继承
// Cat.prototype = new Animal()
// /**
//  * 核心: 将 Cat 的构造函数指向自身
//  *  如果不将 Cat 原型对象的 constructor 属性指向自身的构造函数的话，那么将会指向父类的 Animal 的构造函数:
//  *    通过原型链继承更改了 Cat.prototype, 将 Cat 的原型改为了 Animal 的实例。
//  *    这个时候通过 Cat.prototype 取到的是 Animal 的实例，也就是说 Cat.prototype.constructor 其实是 Animal 实例的 constructor，自然而然也就指向了 Animal。
//  */
// Cat.prototype.constructor = Cat
// Cat.prototype.eat = function () {
//   console.log('我是子类原型上的 eat')
// }
// const cat = new Cat('加菲猫')
// // console.log(cat.type) // Animal
// // console.log(cat.name) // 加菲猫
// // cat.sleep() // 加菲猫正在睡觉!
// // cat.eat('猫粮') // 加菲猫正在吃猫粮
// // console.log(cat instanceof Cat) // true
// // console.log(cat instanceof Animal) // true
// function myInstanceof(self, target) {
//   // 取到目标类型的原型
//   const prototype = target.prototype
//   // 取到被验证的原型
//   let proto = self.__proto__
//   while (true) {
//     // null | undefined 原型的尽头是 null
//     if (!proto) {
//       return false
//     } else if (prototype === proto) {
//       return true
//     }
//     // 当前循环次上述条件都不符合就继续判断它的原型的原型，直到找到或者原型不存在(找到头了)
//     proto = proto.__proto__
//   }
// }

// const myRes = myInstanceof(cat, Cat)
// console.log(myRes)

// 父类
// function Animal() {
//   this.feature = [1, 2, 3]
// }
// // 子类
// function Cat() {}
// // 原型链继承
// Cat.prototype = new Animal()
// Cat.prototype.constructor = Cat
// // 生成实例
// const cat1 = new Cat()
// const cat2 = new Cat()
// // 输出两个实例的值
// console.log(cat1.feature)
// console.log(cat2.feature)
// // 改变 cat1 实例的 feature 的值
// cat1.feature.push(4)
// // 再次输出两个实例的值，发现实例 cat2 也受到了影响
// console.log(cat1.feature) // [1, 2, 3, 4]
// console.log(cat2.feature) // [1, 2, 3, 4]

// 借用构造函数继承
// 定义一个父类 Animal 
// function Animal(name) {
//   // 属性
//   this.type = 'Animal'
//   this.name = name || '动物'
//   // 实例函数
//   this.sleep = function () {
//     console.log(`${this.name}正在睡觉!`)
//   }
// }
// Animal.prototype.eat = function (food) {
//   console.log(`${this.name}正在吃${food}`)
// }
// // 子类
// function Cat(name) {
//   // 核心: 通过 call() 来继承 Animal 的实例的属性和函数
//   Animal.call(this)
//   this.name = name
// }
// // 生成子类实例
// const cat = new Cat('tony')
// cat.sleep() // tony正在睡觉!
// /**
//  * 不能调用父类原型函数
//  *    因为子类并没有通过某种方式来调用父类原型上的函数。
//  *    通俗点说: 通过 call 的调用只是将父类实例上的属性和方法绑定到了子类上，而父类原型和子类并没有什么关系
//  */
// // cat.eat() // cat.eat is not a function
// console.log(cat instanceof Cat) // true
// console.log(cat instanceof Animal) // false

// 复制继承
// 定义一个父类 Animal 
// function Animal(name) {
//   // 属性
//   this.type = 'Animal'
//   this.name = name || '动物'
//   // 实例函数
//   this.sleep = function () {
//     console.log(`${this.name}正在睡觉!`)
//   }
// }
// Animal.prototype.eat = function (food) {
//   console.log(`${this.name}正在吃${food}`)
// }
// // 子类
// function Cat(name) {
//   const animal = new Animal(name)
//   // 遍历父类实例，将其所有的属性和函数添加到子类中
//   for (const key in animal) {
//     const element = animal[key];
//     // 实例属性和函数
//     if (Object.hasOwnProperty.call(animal, key)) {
//       this[key] = element
//     }
//     // 原型对象上的属性和方法
//     else {
//       Cat.prototype[key] = element
//     }
//   }
//   this.name = name
// }
// Cat.prototype.eat = function (food) {
//   console.log(`子类中的: ${this.name}正在吃${food}`)
// }
// // 生成子类实例
// const cat = new Cat('tony')
// console.log(cat.name) // tony
// cat.sleep() // tony正在睡觉!
// /**
//  * 这里的 eat() 为什么执行的是父类中的? 
//  *    因为代码执行顺序的问题，对子类原型的赋值: Cat.prototype.eat = function (food) { } 要优先与复制继承，所以在这里赋值之后，后续复制继承的时候又将其覆盖掉了
//  */
// cat.eat('猫粮') // tony正在吃猫粮
// console.log(cat instanceof Cat) // true
// console.log(cat instanceof Animal) // false

// 组合继承
// 定义一个父类 Animal 
// function Animal(name) {
//   // 属性
//   this.type = 'Animal'
//   this.name = name || '动物'
//   // 实例函数
//   this.sleep = function() {
//     console.log(`${this.name}正在睡觉!`)
//   }
// }
// Animal.prototype.eat = function(food) {
//   console.log(`${this.name}正在吃${food}`)
// }
// function Cat(name) {
//   // 借用构造函数继承
//   Animal.call(this)
//   this.name = name
// }
// // 原型链继承
// Cat.prototype = new Animal()
// Cat.prototype.constructor = Cat
// const cat = new Cat('加菲猫')
// console.log(cat.type) // Animal
// console.log(cat.name) // 加菲猫
// cat.sleep() // 加菲猫正在睡觉!
// cat.eat('猫粮') // 加菲猫正在吃猫粮
// console.log(cat instanceof Cat) // true
// console.log(cat instanceof Animal) // true

// function Animal(name) {
//   // 属性
//   this.type = 'Animal'
//   this.name = name || '动物'
//   // 实例函数
//   this.sleep = function() {
//     console.log(`${this.name}正在睡觉!`)
//   }
// }
// Animal.prototype.eat = function(food) {
//   console.log(`${this.name}正在吃${food}`)
// }
// function Cat(name) {
//   // 借用构造函数继承
//   Animal.call(this)
//   this.name = name
// }
// (function() {
//   // 设置任意函数 Super()
//   const Super = function() {}
//   /**
//    * 关键性语句: 
//    *    Super() 函数的原型指向父类 Animal 的原型，去掉父类的实例属性。
//    *    只取父类的原型属性，过滤掉父类的实例属性，从而避免了父类的实例属性。
//    */
//   Super.prototype = Animal.prototype
//   Cat.prototype = new Super()
//   Cat.prototype.constructor = Cat
// })()
// const cat = new Cat('加菲猫')
// console.log(cat.type) // Animal
// console.log(cat.name) // 加菲猫
// cat.sleep() // 加菲猫正在睡觉!
// cat.eat('猫粮') // 加菲猫正在吃猫粮

// ------------------------------------------------------------------------------------------------------------------------
// 输出顺序是什么
// const first = () => (new Promise((resolve, reject) => {
//   console.log(3)
//   const p = new Promise((resolve, reject) => {
//     console.log(7)
//     setTimeout(() => {
//       resolve(6)
//       console.log(5)
//     }, 0)
//     resolve(1)
//   })
//   resolve(2)
//   p.then(arg => {
//     console.log(arg)
//   }).catch(err => {
//     reject()
//     console.log(0)
//   })
// }))
// first().then(arg => {
//   console.log(arg)
// }).catch(err => {
//   console.log(8)
// })
// console.log(4)

// ------------------------------------------------------------------------------------------------------------------------
// /**
//  * 1. 首先要明白使用方法
//  *    setTimeout(() => {}, timeout)
//  * 2. 其次要明白规则
//  *    1. setTimeout() 接收两个参数: callback 和 timeout
//  *    2. setTimeout() 为了不阻塞进程是放到了另外一个进程中执行的，这个时候就需要用到 node 中的 child_process
//  */
// // index.js
// import { fork } from 'child_process'
// // 宏任务队列
// const macroTasks = []
// function mySetTimeout(callback, timeout) {
//   // 创建一个子进程
//   const child = fork('./child.js')
//   // 向子进程发送通知，对应子进程中通过 onmessage 来监听
//   child.send({ type: 'start', timeout })
//   // 监听子进程的返回内容
//   child.on('message', message => {
//     const { type } = message
//     if (type === 'ready') {
//       // 将 callback 添加到宏任务队列中，等待事件循环调用
//       macroTasks.push(callback)
//     }
//   })
// }
// // 模拟事件循环。浏览器每秒循环 60 帧，也就是一秒刷新 60 次，1000/60≈16ms 得到 16ms 刷新一次
// setInterval(() => {
//   // 取出任务队列中的第一个，并将其从队列中删除
//   const task = macroTasks.shift()
//   // 执行回调
//   task && task()
// })
// // child.js 子进程
// process.on('message', message => {
//   // index.js 中发送过来的
//   const { type, timeout } = message
//   // 算出结束时间，如果当前时间大于结束时间，说明 callback 可以执行了，则通知 index.js 中可以执行了
//   const endMs = Date.now() + timeout
//   setInterval(() => {
//     // 如果当前时间大于结束时间，说明 callback 可以执行了，则通知父进程 callback 可以执行了
//     if (Date.now() > endMs) {
//       // 通知父进程
//       process.send({ type: 'ready' })
//       // 退出当前进程
//       process.exit()
//     }
//   }, 100)
// })

// const macroTasks = []
// let delayQueue = []
// function mySetTimeout(callback, timeout) {
//   // 将 callback、timeout、当前时间放到异步队列中
//   delayQueue.push({
//     callback,
//     timeout,
//     startMs: Date.now()
//   })
// }
// // 模拟事件循环
// setInterval(() => {
//   // 执行宏任务队列中的 callback
//   const task = macroTasks.shift()
//   task && task()
//   delayQueue = delayQueue.filter(item => {
//     // 判断异步队列中的每一项是否该执行了(当前时间 > timeout + startMs)，该执行的将其放到宏任务队列中，等到下一次事件循环执行；反之继续待在异步队列中不做处理。
//     if (Date.now() > (item.startMs + item.timeout)) {
//       // 放到宏任务队列中等待下一次事件循环执行
//       macroTasks.push(item.callback)
//       // 将其从异步队列中删除
//       return false
//     }
//     // 不符合执行条件的则继续保持在异步队列中
//     return true
//   })
// }, 16)


// ------------------------------------------------------------------------------------------------------------------------
// console.log('事件循环 -------------')
// 第一题
// async function async1() {
//   console.log('async1 start')
//   await async2()
//   // await 的后边，都可以看成是 callback 里边的内容，即异步
//   // 类似于将 await 后边的内容封装到了 Promise.resolve().then(cb) 中、setTimeout(cb) 中
//   console.log('async1 end')
// }

// async function async2() {
//   console.log('async2')
// }

// console.log('script start')
// async1()
// console.log('script end')
/**
 * 执行结果
 * script start
 * async1 start
 * async2
 * script end
 * async1 end
 */

// 第二题
// async function async1() {
//   console.log('async1 start')
//   await async2()
//   // await 的后边，都可以看成是 callback 里边的内容，即异步
//   // 类似于将 await 后边的内容封装到了 Promise.resolve().then(cb) 中、setTimeout(cb) 中
//   console.log('async1 end')
//   await async3()
//   console.log('async1 end 2')
// }

// async function async2() {
//   console.log('async2')
// }

// async function async3() {
//   console.log('async3')
// }

// console.log('script start')
// async1()
// console.log('script end')
/**
 * 执行结果
 * script start
 * async1 start
 * async2
 * script end
 * async1 end
 * async3
 * async1 end 2
 */

// 第三题
// async function async1() {
//   console.log('async1 start')
//   await async2() // resolve(Promise.resolve())
//   console.log('async1 end')
// }

// async function async2() {
//   console.log('async2')
// }

// console.log('script start')

// setTimeout(function () {
//   console.log('setTimeout')
// }, 0)

// async1()

// new Promise(function (resolve) {
//   console.log('promise1')
//   resolve()
// }).then(function () {
//   console.log('promise2')
// })

// console.log('script end')
/**
 * 执行结果
 * script start
 * async1 start
 * async2
 * promise1
 * script end
 * async1 end
 * promise2
 * setTimeout
 */

// 第四题
// console.log('script start')

// async function async1() {
//   await async2()
//   console.log('async1 end')
// }
// async function async2() {
//   console.log('async2 end')
// }
// async1()

// setTimeout(function () {
//   console.log('setTimeout')
// }, 0)

// new Promise(resolve => {
//   console.log('Promise')
//   resolve()
// })
//   .then(function () {
//     console.log('promise1')
//   })
//   .then(function () {
//     console.log('promise2')
//   })

// console.log('script end')
/**
 * 执行结果
 * script start
 * async2 end
 * Promise
 * script end
 * async1 end
 * promise1
 * promise2
 * setTimeout
 */
// ------------------------------------------------------------------------------------------------------------------------
// 手写 Promise
// 基本用法
// const promsie = new Promise((resolve, reject) => {
//   console.log('1')
//   resolve("1")
// }, reason => {
//   console.error('失败原因: ', reason)
// })

// promsie.then(res => {
//   console.log('then 中的结果: ', res)
// })

/**
 * 手写 Promise
 * @param {function} func 理解执行的 callback
 */
// function MyPromise(func) {
//   // 状态
//   this.status = 'pending'
//   // 成功之后的值
//   this.value = null
//   // 失败原因
//   this.reason = null
//   // 当 Promise 的 callback 中有异步，并且 resolve 在异步中，这个时候就需要等待 resolve 有结果了之后再去响应到 then 中
//   // 所以这里
//   this.resolveCache = null
//   this.rejectCache = null

//   /**
//    * 这里的 resolve 和 reject 如果定义成普通函数，则函数内部的 this 会指向 window/global；
//    * 可以在内部使用 this === global/window 测试。
//    * 因为普通函数的 this 指向是由调用时决定的。而 resolve 和 reject 是在外部调用的，所以会指向全局。
//    * 所以这里需要改为箭头函数。
//    */
//   this.resolve = (_value) => {
//     // 只有在 pending 状态才能改变状态
//     if (this.status === 'pending') {
//       this.status = 'resolved'
//       this.value = _value
//       this.resolveCache && this.resolveCache(this.value)
//     }
//   }
//   this.reject = (_reason) => {
//     if (this.status === 'pending') {
//       this.status = 'rejected'
//       this.reason = _reason
//       this.rejectCache && this.rejectCache(this.reason)
//     }
//   }

//   func(this.resolve, this.reject)
// }

// MyPromise.prototype.then = function (resolvedCallback, rejectedCallback) {
//   if (this.status === 'resolved') {
//     resolvedCallback(this.value)
//   } else if (this.status === 'rejected') {
//     rejectedCallback(this.reason)
//   } else if (this.status === 'pending') {
//     this.resolveCache = resolvedCallback
//     this.rejectCache = rejectedCallback
//   }
// }

// // 1. 第一版
// // const myPromise = new MyPromise((resolve, reject) => {
// //   console.log('1')
// //   resolve("1")
// // }, reason => {
// //   console.error('失败原因: ', reason)
// // })

// // myPromise.then(res => {
// //   console.log('then 中的结果: ', res)
// // })
// // 2. 第二版，在 Promise 的 callback 中增加异步
// const myPromise = new MyPromise((resolve, reject) => {
//   console.log('1')
//   setTimeout(() => {
//     resolve("1")
//   }, 3000)
// })

// myPromise.then(res => {
//   console.log('then 中的结果: ', res)
// }, reason => {
//   console.error('失败原因: ', reason)
// })

// ------------------------------------------------------------------------------------------------------------------------
/**
 * 手写 Promise
 */
// function MyPromise(callback) {
//   // Promise 的状态
//   this.status = 'pending'
//   // 成功的值
//   this.value = null
//   // 失败的原因
//   this.reason = null
//   /**
//    * 当 resolve、reject 是在异步中的时候，这个时候 then 中的回调是需要等待异步的结果才会有响应。
//    * 这里增加对 then 中回调的缓存
//    */
//   this.resolvedCache = []
//   this.rejectedCache = []

//   /**
//    * 这里的 resolve 和 reject 如果定义成普通函数，则函数内部的 this 会指向 window/global；
//    * 可以在内部使用 this === global/window 测试。
//    * 因为普通函数的 this 指向是由调用时决定的。而 resolve 和 reject 是在外部调用的，所以会指向全局。
//    * 所以这里需要改为箭头函数。
//    */
//   // 成功回调
//   this.resolve = (_value) => {
//     // 只能在 pending 的时候更改状态
//     if (this.status === 'pending') {
//       this.status = 'resolved'
//       this.value = _value
//       // 遍历缓存数组，将每个缓存执行并从数组中删除
//       while (this.resolvedCache.length) {
//         this.resolvedCache.shift()(this.value)
//       }
//     }
//   }
//   // 失败回调
//   this.reject = (_reason) => {
//     // 只能在 pending 的时候更改状态
//     if (this.status === 'pending') {
//       this.status = 'rejected'
//       this.reason = _reason
//       // 遍历缓存数组，将每个缓存执行并从数组中删除
//       while (this.rejectedCache.length) {
//         this.rejectedCache.shift()(this.reason)
//       }
//     }
//   }
//   try {
//     // 立即执行
//     callback(this.resolve, this.reject)
//   } catch (error) {
//     this.reject(error)
//   }
// }

// const resHandle = (res, resolve, reject, thenRes) => {
//   /**
//    * 解决问题: then 方法链式调用识别 then 的 callback 中 return 的 Promise 是否是自己，是自己会报错。
//    * 这个时候需要将 then 的返回值传入进来，然后判断一下 then 的 callback return 的值和 then 的返回值是不是一样，如果一样则会报错。
//    */
//   if (res === thenRes) {
//     return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
//   }
//   /**
//    * 如果 resolveRes 是一个 Promise，则链式调用的时候需要等待上一个 Promise 的结果。
//    * 对应的就是调用 then() 方法来求值，将 resolve 和 reject 传入是为了被 return 出去的 Promise(thenPromise) 拿到求出来的结果。
//    * 后续链式调用的时候就相当于是调用了 thenPromise 的 then 方法，也就可以拿到了 resolveRes 的结果。
//    */
//   if (res instanceof MyPromise) {
//     // 这里将 resolve 和 reject 传入就是为了拿到 resolveRes 的结果。
//     res.then(resolve, reject)
//   }
//   // 如果是一个普通值，则用 resolve 包装
//   else {
//     resolve(res)
//   }
// }

// MyPromise.prototype.then = function (resolvedCallback, rejectedCallback) {
//   resolvedCallback = typeof resolvedCallback === 'function' ? resolvedCallback : value => value
//   /**
//    * 问: rejectedCallback : () => { throw this.reason } 这里的 throw this.reason, 为什么不像 resolvedCallback 那样直接 return reason, 而是 throw reason?
//    * 答: 如果说这个 Promise 失败了， 同时 rejectedCallback 也没有传， 这样这个错误就会被吞掉。 
//    *     而采用 throw 则会将 resolvedCallback 的状态也置为失败， 这样在外界就可以收到 resolvedCallback 的结果， 可以做出对应的处理。
//    */
//   rejectedCallback = typeof rejectedCallback === 'function' ? rejectedCallback : reason => { throw reason }
//   // 因为要链式调用，所以这里需要 return 一个 Promise，并在后边 return 出去
//   const thenPromise = new MyPromise((resolve, reject) => {
//     // 触发成功、失败的回调
//     if (this.status === 'resolved') {
//       queueMicrotask(() => {
//         try {
//           /**
//            * 将成功的值回传: resolvedCallback(this.value)
//            * 拿到 resolvedCallback() 的结果是为了链式调用。
//            */
//           const resolveRes = resolvedCallback(this.value)
//           resHandle(resolveRes, resolve, reject, thenPromise)
//         } catch (error) {
//           reject(error)
//         }
//       })
//     } else if (this.status === 'rejected') {
//       queueMicrotask(() => {
//         try {
//           // 将失败原因回传
//           const rejectedRes = rejectedCallback(this.reason)
//           resHandle(rejectedRes, resolve, reject, rejectedRes)
//         } catch (error) {
//           reject(error)
//         }
//       })
//     }
//     // 当执行到 then 时状态还是 pending 说明 resolve/reject 在异步中，所以对 resolvedCallback 和 rejectedCallback 进行缓存
//     else if (this.status === 'pending') {
//       /**
//        * this.resolvedCache.push() 解决的问题: 
//        *    如果 Promise 的 callback 中 resolve/reject 在异步中，并且多次调用这个实例上的 then，
//        *    这个时候需要将每次调用的 resolvedCallback 和 rejectedCallback 都进行缓存，所以改用数组。
//        */
//       this.resolvedCache.push(() => {
//         queueMicrotask(() => {
//           try {
//             const resolveRes = resolvedCallback(this.value)
//             resHandle(resolveRes, resolve, reject, resolveRes)
//           } catch (error) {
//             reject(error)
//           }
//         })
//       })
//       this.rejectedCache.push(() => {
//         queueMicrotask(() => {
//           try {
//             const rejectedRes = rejectedCallback(this.reason)
//             resHandle(rejectedRes, resolve, reject, rejectedRes)
//           } catch (error) {
//             reject(error)
//           }
//         })
//       })
//     }
//   })

//   return thenPromise
// }

// MyPromise.resolve = arg => {
//   if (arg instanceof MyPromise) {
//     return arg
//   }
//   return new MyPromise((resolve, reject) => {
//     resolve(arg)
//   })
// }
// MyPromise.reject = arg => {
//   return new MyPromise((resolve, reject) => {
//     reject(arg)
//   })
// }

// 测试
// const promise = new MyPromise((resolve, reject) => {
//   resolve(1)
// })
// const other = () => {
//   return new MyPromise((resolve, reject) => {
//     resolve(200)
//   })
// }
// const p1 = promise.then(res => {
//   console.log(1)
//   console.log('res => ', res)
//   return p1
// }, reason => {
//   console.log('reason => ', reason)
// })
// p1.then(res => {
//   console.log(2)
//   console.log(`res2 =>`, res)
// }, reason => {
//   console.log(3)
//   console.log(`res3 =>`, reason)
// })

// ------------------------------------------------------------------------------------------------------------------------
// let promise = new Promise(function (resolve, reject) {
//   resolve('第一次成功')
// })

// promise.then(function (val) {
//   //第三种方法
//   return new Promise(() => { })
// }).catch(function (val) {
//   console.log('返回失败')
// }).then(function (val) {
//   console.log('被跳过的方法')
// })

// Promise.resolve()
//   .then(() => {
//     console.log('[onFulfilled_1]');
//     throw 'throw on onFulfilled_1';
//   })
//   .then(() => {  // 中间的函数不会被调用
//     console.log('[onFulfilled_2]');
//   })
//   .catch(err => {
//     console.log('[catch]', err);
//   }).then(res => {
//     console.log('catch 后的 then')
//   })

// let promise = new Promise(function (resolve, reject) {
//   resolve('第一次成功')
// })

// promise.then(function (val) {
//   // 两种方法意思都代表报错，【中断下一步，直接报错】
//   // 第一种方法
//   // throw new error()
//   // 第二种方法　　
//   return Promise.reject()
// }).then(function (val) {
//   console.log('被跳过的方法')
// }).catch(function (val) {
//   console.log('返回失败')
// }).then(res => {
//   console.log('catch 后的 then')
// })

// catch 中没有报错
// const p1 = Promise.reject('my error').catch(err => {
//   throw new Error('11')
// }).then(() => {
//   console.log('then') // 这里也会执行
// }).catch(e => {
//   console.log(e)
// })
// console.log('p1', p1) // 这里的 p1 是 resolved 状态的 promise！触发 then 回调

// ------------------------------------------------------------------------------------------------------------------------
// 手写 instanceof
// function myInstanceof(left, right) {
//   const prototype = right.prototype
//   let __proto__ = left.__proto__
//   while(true) {
//     // 找到头了。原型的尽头为 null
//     if (!__proto__) {
//       return false
//     }
//     if (prototype === __proto__) {
//       return true
//     }
//     __proto__ = __proto__.__proto__
//   }
// }
// console.log(myInstanceof([], Array))

// Object.create()
// Object.myCreate = function(proto) {
//   function Fn() {}
//   Fn.prototype = proto
//   return new Fn()
// }

// ------------------------------------------------------------------------------------------------------------------------
// 手写 call()
// 使用方法
// const obj = {
//   a: 1
// }
// global.a = '全局的a'
// function fun(b) {
//   console.log(this.a)
//   console.log(b)
//   return 1123
// }
// fun(123)

// Function.prototype.myCall = function (context) {
//   context = context || global // 浏览器环境下是 window，node 环境下是 global
//   const args = [...arguments].slice(1)
//   const temp = Symbol('temp')
//   context[temp] = this
//   const result = context[temp](...args)
//   delete context[temp]
//   return result
// }
Function.prototype.myCall = function (context) {
  context = context || window
  const args = [...arguments].slice(1)
  const fn = Symbol('fn')
  context[fn] = this
  const result = context[fn](...args)
  delete context[fn]
  return result
}
// Function.prototype.myApply = function (context) {
//   context = context || global // 浏览器环境下是 window，node 环境下是 global
//   const secArg = [...arguments][1]
//   const temp = Symbol('temp')
//   context[temp] = this
//   let result
//   if (secArg) {
//     result = context[temp](...secArg)
//   } else {
//     result = context[temp]()
//   }
//   delete context[temp]
//   return result
// }
Function.prototype.myApply = function (context) {
  context = context || global
  const args = [...arguments][1]
  const fn = Symbol('fn')
  context[fn] = this
  let result
  if (args) {
    result = context[fn](...args)
  } else {
    result = context[fn]()
  }
  delete context[fn]
  return result
}
// Function.prototype.myBind = function (context) {
//   context = context || global // 浏览器环境下是 window，node 环境下是 global
//   const args = [...arguments].slice(1)
//   _self = this
//   const Fun = function(...innerArgs) {
//     return _self.call(
//       this instanceof _self ? this : context,
//       ...args, ...innerArgs
//     )
//   }
//   Fun.prototype = Object.create(_self.prototype)
//   return Fun
// }
Function.prototype.myBind = function (context) {
  const selfFun = this
  const args = [...arguments].slice(1)
  const Fun = function (...innerArgs) {
    selfFun.call(
      this instanceof selfFun ? this : context,
      ...args, ...innerArgs
    )
  }
  Fun.prototype = Object.create(selFun.prototype)
  return Fun
}


// console.log(fun.call(obj, 123))
// console.log(fun.myCall(obj, 123))

// console.log(fun.apply(null, [1, 2, 3]))
// console.log('----')
// console.log(fun.myApply(null, [1, 2, 3]))

// function Point(x, y, z, q) {
//   this.x = x
//   this.y = y
//   console.log(x)
//   console.log(y)
//   console.log(z)
//   console.log(q)
// }
// Point.prototype.toString = function () {
//   return `${this.x},${this.y}`
// }
// let YPoint2 = Point.myBind(null, 1)
// YPoint2(2, [1, 2, 3])
// let axiosPoint2 = new YPoint2(2)
// console.log(axiosPoint2.toString())
// console.log(axiosPoint2 instanceof Point) // true
// console.log(YPoint2 instanceof Point) // false
// console.log(axiosPoint2 instanceof YPoint2) // true

// ------------------------------------------------------------------------------------------------------------------------
// let obj1 = {
//   person: {
//     name: "AAA"
//   },
//   test: '111'
// };
// let obj2 = Object.assign({}, obj1);
// obj2.person.name = "BBB";
// obj2.test = '222'
// console.log(obj1); // {"person":{"name":"BBB"},"test":"111"}
// console.log(obj2); // {"person":{"name":"BBB"},"test":"222"}

// let obj1 = {
//   person: {
//     name: "AAA"
//   },
//   test: '111'
// };
// let obj2 = { ...obj1 };
// obj2.person.name = "BBB";
// obj2.test = '222'
// console.log(obj1); // {"person":{"name":"BBB"},"test":"111"}
// console.log(obj2); // {"person":{"name":"BBB"},"test":"222"}

// let arr = [
//   1,
//   3,
//   {
//     username: 'AAA'
//   }
// ];
// let arr2 = arr.concat();
// arr2[2].username = 'BBB';
// console.log(arr); // [1,3,{"username":"BBB"}]
// console.log(arr2); // [1,3,{"username":"BBB"}]

// let arr = [
//   1,
//   3,
//   {
//     username: 'AAA'
//   }
// ];
// let arr2 = arr.slice();
// arr2[2].username = 'BBB';
// console.log(arr); // [1,3,{"username":"BBB"}]
// console.log(arr2); // [1,3,{"username":"BBB"}]

// function deepClone(obj) {
//   if (typeof obj !== 'object' && obj === null) return obj
//   const result = Array.isArray(obj) ? [] : {}
//   for (let key in obj) {
//     if (Object.hasOwnProperty.call(obj, key)) {
//       const value = obj[key]
//       if (typeof value === 'object') {
//         result[key] = deepClone(value)
//       } else {
//         result[key] = value
//       }
//     }
//   }
//   return result
// }

// const obj111 = {
//   a: 1,
//   b: 2,
//   c: {
//     aa: 1,
//     bb: 2,
//     cc: 3
//   }
// }
// const res = deepClone(obj111)
// res.c.aa = 'hhhh'
// console.log(JSON.stringify(obj111))
// console.log(JSON.stringify(res))


// ------------------------------------------------------------------------------------------------------------------------
// settimeout 第一种实现方式
// const tasks = []
// function mySetTimeout(callback, timeout) {
//   const { fork } = require('child_process')

//   const child = fork('./setTimeout/child2.js')
//   child.send({ status: 'start', timeout })
//   child.on('message', (data) => {
//     if (data.status === 'ready') {
//       tasks.push(callback)
//     }
//   })
// }

// setInterval(() => {
//   const task = tasks.shift()
//   task && task()
// }, 16)

// // child2.js
// // 监听 send 事件
// process.on('message', message => {
//   // 父进程中发送过来的
//   const { type, timeout } = message
//   if (type === 'start') {
//     // 算出结束时间(当前时间 + timeout = 结束时间)，如果当前时间大于结束时间，说明 callback 可以执行了，则通知 index.js 中可以执行了
//     const endMs = Date.now() + timeout
//     setInterval(() => {
//       // 如果当前时间大于结束时间，说明 callback 可以执行了，则通知父进程 callback 可以执行了
//       if (endMs <= Date.now()) {
//         // 通知父进程
//         process.send({ type: 'ready' })
//         // 退出当前进程
//         process.exit()
//       }
//     }, 100)
//   }
// })

// setTimeout 第二种实现方式
// let task1 = []
// const task2 = []

// function mySetTimeout(callback, timeout) {
//   const endMs = Date.now() + timeout
//   task1.push({
//     timeout,
//     callback,
//     endMs
//   })
// }

// setInterval(() => {

//   const task = task2.shift()
//   task && task()

//   task1 = task1.filter((item) => {
//     const { endMs, callback } = item
//     if (Date.now() > endMs) {
//       task2.push(callback)
//       return false
//     }
//     return true
//   })

// }, 16)

// // 测试
// mySetTimeout(() => {
//   console.log('mySetTimeout 的内容')
// }, 3000)

// 手写 promise
// function MyPromise(callback) {
//   this.status = 'pending'
//   this.value = null
//   this.reason = null
//   this.resolveCache = []
//   this.rejectCache = []

//   this.resolve = (_value) => {
//     if (this.status === 'pending') {
//       this.status = 'resolved'
//       this.value = _value
//       while (this.resolveCache.length) {
//         this.resolveCache.shift()(this.value)
//       }
//     }
//   }
//   this.reject = (_reason) => {
//     if (this.status === 'pending') {
//       this.status = 'rejected'
//       this.reason = _reason
//       while (this.rejectCache.length) {
//         this.rejectCache.shift()(this.reason)
//       }
//     }
//   }

//   callback(this.resolve, this.reject)
// }

// MyPromise.prototype.then = function (resolvedCallback, rejectedCallback) {
//   const tempPromise = new MyPromise((resolve, reject) => {
//     if (this.status === 'resolved') {
//       const result = resolvedCallback(this.value)
//       if (result instanceof MyPromise) {
//         result.then(resolve, reject)
//       } else {
//         resolve(result)
//       }
//     }
//     if (this.status === 'rejected') {
//       const result = rejectedCallback(this._reason)
//       if (result instanceof MyPromise) {
//         result.then(resolve, reject)
//       } else {
//         resolve(result)
//       }
//     }
//     if (this.status === 'pending') {
//       this.resolveCache.push(() => {
//         const result = resolvedCallback(this.value)
//         if (result instanceof MyPromise) {
//           result.then(resolve, reject)
//         } else {
//           resolve(result)
//         }
//       })
//       this.rejectCache.push(() => {
//         const result = rejectedCallback(this.reason)
//         if (result instanceof MyPromise) {
//           result.then(resolve, reject)
//         } else {
//           resolve(result)
//         }
//       })
//     }
//   })
//   return tempPromise
// }
// const myPromise = new MyPromise((resolve, reject) => {
//   setTimeout(() => {
//     resolve(123)
//   }, 1000)
// }, reason => {
//   console.log('reason =>', reason)
// })
// function other() {
//   return new MyPromise((resolve, reject) => {
//     resolve('other')
//   })
// }
// myPromise.then(res => {
//   console.log('res1 =>', res)
//   return other()
// }, reason => {
//   console.log('reason =>', reason)
// }).then(res => {
//   console.log('res2 =>', res)
//   return 456
// }, reason => {
//   console.log('reason =>', reason)
// }).then(res => {
//   console.log('res3 =>', res)
// }, reason => {
//   console.log('reason =>', reason)
// })

// Promise.all()
// Promise.myAll = function (list) {
//   const result = []
//   list = Array.from(list)
//   return new Promise((resolve, reject) => {
//     list.forEach((item, index) => {
//       Promise.resolve(item).then(res => {
//         result[index] = res
//         if (result.length === list.length) {
//           resolve(result)
//         }
//       }).catch(err => {
//         reject(err)
//       })
//     })
//   })
// }
// const promise1 = Promise.resolve(3);
// const promise2 = 42;
// const promise3 = new Promise((resolve, reject) => {
//   setTimeout(resolve, 1000, 'foo');
// });

// Promise.all([promise1, promise2, promise3]).then((values) => {
//   console.log(values); // 返回结果: [ 3, 42, 'foo' ]
// });
// Promise.myAll([promise1, promise2, promise3]).then((values) => {
//   console.log(values); // 返回结果: [ 3, 42, 'foo' ]
// });

// Promise.myRace = function (list) {
//   list = Array.from(list)
//   let flag = 0
//   return new Promise((resolve, reject) => {
//     list.forEach(item => {
//       Promise.resolve(item).then(res => {
//         if (!flag) {
//           resolve(res)
//           flag = 1
//         }
//       }).catch(err => {
//         reject(err)
//       })
//     })
//   })
// }
// Promise.race([promise1, promise2, promise3]).then((values) => {
//   console.log(values); // 返回结果: [ 3, 42, 'foo' ]
// });
// Promise.myRace([promise1, promise2, promise3]).then((values) => {
//   console.log(values); // 返回结果: [ 3, 42, 'foo' ]
// });

// 利用 Promise() 实现红绿灯效果
// function green() {
//   console.log('现在是绿灯')
// }
// function red() {
//   console.log('现在是红灯')
// }
// function yellow() {
//   console.log('现在是黄灯')
// }

// function handle(callback, timer) {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       callback()
//       resolve()
//     }, timer)
//   })
// }

// function stup() {
//   Promise.resolve().then(() => {
//     return handle(green, 1000)
//   }).then(() => {
//     return handle(yellow, 4000)
//   }).then(() => {
//     return handle(red, 5000)
//   }).then(() => {
//     stup()
//   })
// }
// stup()
// ------------------------------------------------------------------------------------------------------------------------
/**
 * 手写 instanceof()
 * [] instanceof Array
 */
// function myInstanceof(value, target) {
//   const prototype = target.prototype
//   let proto = value.__proto__
//   while(true) {
//     if (!proto) return false
//     if (proto === prototype) {
//       return true
//     }
//     proto = proto.__proto__
//   }
// }
// console.log(myInstanceof([], Array))
// console.log(myInstanceof([], Object))
// console.log(myInstanceof('', Array))

// 手写 Object.create()
// Object.myCreate = function (proto) {
//   function F() { }
//   F.prototype = proto
//   return new F()
// }

// 继承
// 父类
// function Animal(name) {
//   // 实例属性
//   this.type = 'Animal'
//   this.name = name || '动物'
//   this.test = []

//   // 实例函数
//   this.sleep = function () {
//     console.log(`${this.name} 正在睡觉!`)
//   }
// }

// // 原型方法
// Animal.prototype.eat = function (food) {
//   console.log(`${this.name} 正在吃 ${food}`)
// }

// // 子类
// function Cat(name) {
//   Animal.call(this, name)
//   this.name = name
// }

// const proto = Object.create(Animal.prototype)
// proto.construtor = Cat
// Cat.prototype = proto

// const cat = new Cat('加菲猫')
// console.log(cat.type) // Animal
// console.log(cat.name) // 加菲猫
// cat.sleep() // 加菲猫正在睡觉!
// cat.eat('猫粮') // 加菲猫正在吃猫粮

// cat.test.push(1)
// const cat2 = new Cat('test Cat')
// cat2.test.push(2)
// console.log(cat.test) // [1]
// console.log(cat2.test) // [2]

// console.log(cat instanceof Cat) // true. 实例是子类的实例
// console.log(cat instanceof Animal) // true. 实例也是父类的实例。原型链解决。

// console.log(Cat.prototype.construtor === Cat) // true

// Function.prototype.myCall = function (context) {
//   context = context || global
//   const args = [...arguments].slice(1)
//   const fn = Symbol('fn')
//   context[fn] = this
//   const result = context[fn](...args)
//   delete context[fn]
//   return result
// }

// Function.prototype.myApply = function (context) {
//   context = context || global
//   const argArr = [...arguments][1]
//   const fn = Symbol('fn')
//   context[fn] = this
//   let result
//   if (argArr) {
//     result = context[fn](...argArr)
//   } else {
//     result = context[fn]()
//   }
//   delete context[fn]
//   return result
// }

// Function.prototype.myBind = function (context) {
//   context = context || global
//   const args = [...arguments].slice(1)
//   const _selfFun = this
//   const F = function (...innerArgs) {
//     return _selfFun.call(
//       this instanceof _selfFun ? this : context,
//       ...args,
//       ...innerArgs
//     )
//   }
//   F.prototype = Object.create(_selfFun.prototype)
//   return F
// }

// function deepClone(obj, map = new Map) {
//   if (!obj || typeof obj === 'string') return obj
//   if (map.get(obj)) return map.get(obj)
//   const result = Array.isArray(obj) ? [] : {}
//   map.set(obj, result)
//   for (const key in obj) {
//     if (Object.hasOwnProperty.call(obj, key)) {
//       const value = obj[key];
//       if (typeof value === 'object') {
//         result[key] = deepClone(value)
//       } else {
//         result[key] = value
//       }
//     }
//   }
//   return result
// }

// Promise.all() 的执行过程中，继续向传入 Promise.all() 的数组中 push 数据，这个时候结果中会包含新  push 进去的数据吗？
// 不会
// const promise1 = Promise.resolve(3);
// const promise2 = 42;
// const promise3 = new Promise((resolve, reject) => {
//   setTimeout(resolve, 1000, 'foo');
// });
// const promise4 = new Promise((resolve, reject) => {
//   setTimeout(resolve, 10000, 'foo');
// });
// const promise5 = Promise.resolve(123123123)
// const arr = [promise1, promise2, promise3, promise4]
// console.log('同步执行')
// setTimeout(() => {
//   console.log('开始 push', arr)
//   arr.push(promise5)
//   console.log('push 结束', arr) // [Promise, 42, Promise, Promise, Promise]
// }, 2000)
// console.log('同步执行2')
// Promise.all(arr).then((values) => {
//   console.log('最终结果: ', values); // [3, 42, 'foo', 'foo']
// });

// ------------------------------------------------------------------------------------------------------------------------
/**
 * 使用JS实现一个 repeat 方法 log 4次 hello world, 每次间隔3秒
 *    加大难度版：输出第几次helloworld
 */
// function repeat(num) {
//   let count = 1
//   function handle() {
//     setTimeout(() => {
//       if (count <= 4) {
//         console.log(`第${count}次`)
//         if (count === num) {
//           console.log('hello world')
//         }
//         count++
//         handle()
//       }
//     }, 500)
//   }
//   handle()
// }
// repeat(3)

/**
 * 实现一个一维数组转二维数组的方法（arrayToMatrix）传入一个一维数组 arr 以及转换后每个数组的长度 length。
 * arrToMatrix([1, 2, 3, 4, 5, 6, 7, 8, 9], 2) 返回 [[1, 2], [3, 4], [5, 6], [7, 8], [9]]
 */
// function arrToMatrix(arr, len) {
//   const result = []
//   let index = 0
//   while (arr.length) {
//     const item = arr.shift()
//     if (!result[index]) {
//       result[index] = []
//     } else if (result[index].length === len) {
//       index += 1
//       result[index] = []
//     }
//     result[index].push(item)
//   }

//   return result
// }
// const result = arrToMatrix([1, 2, 3, 4, 5, 6, 7, 8, 9], 4)
// console.log(result)

// api接口请求列表
const apiList = [
  'url___A',
  'url___B',
  'url___C',
  'url___D',
  'url___E',
  'url___F',
  'url___G',
]

// 模拟请求数据
const request = api => {
  console.log(`${api} 请求start`)

  // 请求时间 0 ~ 3 秒
  const wait = Math.random() * 3000

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // reject(`${api} 请求结束，可以进行下一次请求`)
      resolve(`${api} 请求结束，可以进行下一次请求`)
    }, wait)
  })
}

// 并发请求控制器
// function requestLimit(apiList, limit) {
//   // 记录请求中的接口数量
//   let count = 0
//   return new Promise((resolve, reject) => {
//     const handle = () => {
//       const api = apiList.shift()
//       // 请求中的接口 +1
//       ++count
//       request(api).then(res => {
//         console.log(res)
//         // 请求中的接口 -1
//         --count

//         /**
//          * 整体流程
//          * 1. 当有接口请求完成之后，接口列表中还有待请求的接口时则如果还没有到最大并发的限制，则发起新的请求。
//          * 2. 如果没有接口需要请求了，则将最终结果返回
//          */
//         // 1. 当有接口请求完成之后，接口列表中还有待请求的接口时则如果还没有到最大并发的限制，则发起新的请求。
//         if (apiList.length && count <= limit) {
//           handle()
//         }
//         /**
//          * 2. 如果没有接口需要请求了，则将最终结果返回
//          *    这个时候不能单纯的通过 apiList 中是否还有数据来判断，因为有可能请求发起了，但是响应还没有回来，这个时候虽然它是空的，但其实并不是所有的接口都请求完成了。
//          *    所有需要增加一个变量(count)来判断所有的请求是否全部请求完成，也就是记录一下正在请求中的接口数量。
//          *    发起请求的时候 count +1，请求结束的时候 count -1, 当 apiList 中没有数据且 count 为 0 的时候则说明所有接口都请求完成了。
//          */
//         if (!apiList.length && !count) {
//           resolve('所有接口请求完毕!')
//         }
//       }).catch(err => {
//         /**
//          * 整体逻辑是进入无线重试，弊端就是会阻塞后边的代码执行。
//          */
//         console.log(err)
//         // 1. 接口失败之后也将请求中的接口 -1
//         --count
//         // 2. 将失败的接口再次 push 到 apiList 中
//         apiList.push(api)
//         // 3. 接口列表中还有待请求的接口时则如果还没有到最大并发的限制，则发起新的请求。
//         if (apiList.length && count <= limit) {
//           handle()
//         }
//       })
//     }

//     // 一直都按最高并发走
//     for (let index = 0; index < limit; index++) {
//       handle()
//     }

//   })
// }

// // 测试
// requestLimit(apiList, 3).then(res => {
//   console.log(res)
// })

/**
 * @description 限制并发请求
 * @param {apiList} 请求接口列表
 * @param {limit} 限制请求接口的数量，默认每次最多发送3次请求
 * @return { Promise<Array> } resList
 */
// 这里没有 callback 是因为返回的是 Promise 对象，其 then 方法取代了 callback
const requestWithLimit = (apiList, limit = 3) => {
  // apiList 的副本，避免 shift 方法对参数造成影响
  let list = [...apiList]
  // 用来记录api - response 的映射
  // 保证输出与输入顺序一致
  let map = new Map()
  // 递归调用
  const run = () => {
    if (list.length) {
      const api = list.shift()
      return request(api).then(res => {
        console.log(res)
        map.set(api, res)
        return run()
      })
    }
  }
  // 当 apiList.length < limit 的时候，避免创建多余的 Promise
  const promiseList = Array(Math.min(apiList.length, limit)).fill(Promise.resolve()).map(promise => promise.then(run))
  return Promise.all(promiseList).then(() => {
    return apiList.map(c => map.get(c))
  })
}

// requestWithLimit(apiList, 3).then(res => {
//   console.log('请求完毕:', res)
// })

// 判断是不是回文数组
function testHandle(arr) {
  let start = 0
  let end = arr.length - 1
  while (start < end) {
    if (arr[start] === arr[end]) {
      ++start
      --end
    } else {
      return false
    }
  }
  return true
}

// console.log(testHandle([1, 2, 2, 1,3]))

// ------------------------------------------------

// function handle(arr) {
//   // reverse(): 会改变原数组，所以这里进行一次浅拷贝
//   const reverseStr = [...arr].reverse().join('')
//   const str = arr.join('')
//   return reverseStr === str
// }
// function handle(arr) {
//   // 开始索引
//   let start = 0
//   // 结束索引
//   let end = arr.length - 1
//   // 如果开始索引一直小于结束索引说明还有需要比较的项则一直遍历。
//   while (start < end) {
//     const item1 = arr[start]
//     const item2 = arr[end]
//     // 两个索引值相等则比较下一项
//     if (item1 === item2) {
//       ++start
//       --end
//     } else {
//       return false
//     }
//   }
//   return true
// }

// console.log(handle([1, 2, 3, 2, 1]))


// 实现一个 repeat 方法 log 4次 hello world, 每次间隔3秒
// function repeat(num) {
//   let count = 1

//   const handle = () => {
//     setTimeout(() => {
//       console.log('hello world')
//       ++count
//       if (count <= num) {
//         handle()
//       }
//     }, 3000)
//   }

//   handle()
// }
// repeat(4)
// 加大难度版：输出第几次helloworld
function repeat(num, con) {
  let count = 1

  const handle = () => {
    setTimeout(() => {
      console.log(`第${count}次`)
      if (count === con) {
        console.log('hello world')
      }
      ++count
      if (count <= num) {
        handle()
      }
    }, 3000)
  }

  handle()
}
// repeat(4, 3)

// function handle(a, b, c, d, e) {
//   return a + b + c + d + e
// }
// function currying(fn, ...args) {
//   if (fn.length === args.length) {
//     return fn(...args)
//   } else {
//     return (...innerArgs) => currying(fn, ...args, ...innerArgs)
//   }
// }
// const _curring = currying(handle)
// console.log(_curring(1, 2, 3, 4, 5))
// console.log(_curring(1, 2, 3)(4, 5))
// console.log(_curring(1)(2)(3)(4)(5))

// 获取多个数字中的最大值 - max() 方法
// function max() {
//   const args = Array.prototype.slice.call(arguments)
//   let maxVal
//   args.forEach(item => {
//     if (item > maxVal || !maxVal) maxVal = item
//   })
//   return maxVal
// }
// console.log(max(1, 2, 3, 99, 20, 10, 30))

// 手写 flat 函数 - 将多维数组转换为一维数组
// function myFlat(arr) {
//   const isDeep = arr.some(item => item instanceof Array)
//   if (!isDeep) return arr
//   const res = Array.prototype.concat.apply([], arr)
//   return myFlat(res)
// }
// const testArr = [
//   1, 2, 3, 4, 5,
//   [9, 0, 88, 99],
//   [
//     11, 22, 33, 44,
//     [555, 444, 44444, 22222]
//   ]
// ]
// console.log(myFlat(testArr))

// 通过 constructor 判断类型
// 正常情况下
// console.log((2).constructor === Number) // true
// console.log((true).constructor === Boolean) // true
// console.log(('str').constructor === String) // true
// console.log(([]).constructor === Array) // true
// console.log((function() {}).constructor === Function) // true
// console.log(({}).constructor === Object) // true
// prototype 属性被更改
// function Fn() {}
// Fn.prototype = new Array()
// const f = new Fn()
// console.log(f.constructor === Fn) // false
// console.log(f.constructor === Array) // true

// 判断数组的方式
// console.log(Object.prototype.toString.call([]) === '[object Array]') // true
// console.log([].__proto__ === Array.prototype) // true
// console.log(Array.isArray([])) // true
// console.log([] instanceof Array) // true
// console.log(Array.prototype.isPrototypeOf([])) // true

// isNaN 和 Number.isNaN 的区别
// console.log(isNaN('123')) // false
// console.log(isNaN('aaa')) // true
// console.log(isNaN({})) // true
// console.log(isNaN(NaN)) // true
// console.log('--')
// console.log(Number.isNaN('123')) // false
// console.log(Number.isNaN('aaa')) // false
// console.log(Number.isNaN({})) // false
// console.log(Number.isNaN(NaN)) // true

// 极大 number 转字符串
// const value = 999999999999999999999999999999999999
// const value = Symbol('123')
// const str = value.toString()
// console.log(str)
// console.log(typeof str)

// Object.assign 和扩展运算符的区别
// let outObj = {
//   inObj: {a: 1, b: 2},
//   test: 123
// }
// let newObj = {...outObj}
// newObj.inObj.a = 2
// newObj.test = 456
// console.log(JSON.stringify(outObj)) // {"inObj":{"a":2,"b":2},"test":123}
// let outObj = {
//   inObj: {a: 1, b: 2},
//   test: 123
// }
// let newObj = Object.assign({}, outObj)
// newObj.inObj.a = 2
// newObj.test = 456
// console.log(JSON.stringify(outObj)) // {"inObj":{"a":2,"b":2},"test":123}

// proxy() 实现数据响应式
// let onWatch = (obj, setBind, getLogger) => {
//   let handler = {
//     get(target, property, receiver) {
//       getLogger(target, property)
//       return Reflect.get(target, property, receiver)
//     },
//     set(target, property, value, receiver) {
//       setBind(value, property)
//       return Reflect.set(target, property, value)
//     }
//   }
//   return new Proxy(obj, handler)
// }
// let obj = { a: 1 }
// let p = onWatch(
//   obj,
//   (v, property) => {
//     console.log(`监听到属性${property}改变为${v}`)
//   },
//   (target, property) => {
//     console.log(`'${property}' = ${target[property]}`)
//   }
// )
// p.a = 2 // 监听到属性a改变
// p.a // 'a' = 2

// Object.is() 和 === 的区别
// console.log(NaN === NaN) // false
// console.log(Object.is(NaN, NaN)) // true
// console.log(-0 === +0) // true
// console.log(Object.is(-0, +0)) // false

// 包装类型
// const a = 'abc'
// const objA = Object(a)
// console.log(objA) // String ('abc')
// console.log(typeof objA) // object
// const _a = objA.valueOf()
// console.log(_a) // abc
// console.log(typeof _a) // string
// // console.log(a.length) // 3
// // console.log(a.toLocaleUpperCase()) // ABC

// 遍历类数组对象
// let obj = {
//   0:'one',
//   1:'two',
//   length: 2
// };
// obj = Array.from(obj);
// for(const k of obj){
//   console.log(k)
// }

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
// /**
//  * then:success1
//  */

// Promise.resolve(1)
//   .then(2)
//   .then(Promise.resolve(3))
//   .then(console.log)
// /**
//  * 1 // then() 如果接收的不是一个函数，则会将前一个 promise 的结果透传下去
//  */

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
// /**
//  * pending
//  * pending
//  * error!!!
//  */

// Promise.resolve(1)
//   .then(res => {
//     console.log(res);
//     return 2;
//   })
//   .catch(err => {
//     return 3;
//   })
//   .then(res => {
//     console.log(res);
//   });
//   /**
//    * 1
//    * 2
//    */

// Promise.resolve().then(() => {
//   return new Error('error!!!')
// }).then(res => {
//   console.log("then: ", res)
// }).catch(err => {
//   console.log("catch: ", err)
// })
// /**
//  * then: error!!! // 因为是 return，如果是 throw 则会进入 catch
//  */

// const promise = Promise.resolve().then(() => {
//   return promise;
// })
// promise.catch(console.err)
// /**
//  * 直接报错，因为在 .then() 和 .catch() 中不能 return 自身。会直接报错，并不会被 catch 捕获
//  */

// Promise.resolve(1)
//   .then(2)
//   .then(Promise.resolve(3))
//   .then(console.log)
// /**
//  * 1 // then() 方法接收到的如果不是函数，则会将前一个 promise 的结果透传下去
//  */

Promise.resolve('err!!!')
  .then((res) => {
    console.log('success', res)
  }, (err) => {
    console.log('error', err)
    throw new Error('111')
  }).catch(err => {
    console.log('catch', err)
  })
/**
 * error err!!!
 * 题解: 
 * then() 方法接受两个函数，第一个函数是成功触发，第二个是失败触发，所以这里被第二个函数捕获，并不会走到 catch() 中。
 * 但是，基于上述条件，在第二个函数中增加一个 throw new Error('xxx') 这时候就会被 catch() 捕获，
 * 也就是说，在 then() 的第一个函数中或第二个函数中报错就会被后面的 catch() 捕获。
 */

// ------------------------------------------------
// function handle (i) {
//   if (i <= 2) return 1
//   return handle(i - 1) + handle(i - 2)
// }

// function test1(len) {
//   let ref = ``
//   for (var i = 1; i <= len; i++) {
//     ref = `${ref} ${handle(i)}`
//   }
//   return ref
// }
// console.log('tetst', test1(9))

// const str = `123321`
// const handle = (str) => {
//   if (!str) return true
//   let start = 0
//   let end = str.length - 1
//   while (start <= end) {
//     if (str[start] === str[end]){
//       ++start
//       --end
//     } else {
//       return false
//     }
//   }
//   return true
// }
// console.log(handle(str))

// const str = `123321`
// const handle = (str) => {
//   const arr = Array.prototype.slice.call(str)
//   const set = new Set(arr)
//   return [...set].join('')
// }
// console.log(handle(str))

// const handle = (arr, len) => {
//   const result = []
//   let index = 0
//   while(arr.length) {
//     const item = arr.shift()
//     if (!result[index]) {
//       result[index] = []
//     } else if (result[index].length === len) {
//       ++index
//       result[index] = []
//     }
//     result[index].push(item)
//   }
//   return result
// }

// console.log(handle([1, 2, 3, 4, 5, 6, 7, 8, 9], 4))

// const a = () => {
//   console.log('红灯')
// }
// const b = () => {
//   console.log('绿灯')
// }
// const c = () => {
//   console.log('黄灯')
// }

// const handle = (cb, timer) => {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       cb()
//       resolve()
//     }, timer)
//   })
// }

// const test = async () => {
//   await handle(a, 1000)
//   await handle(b, 2000)
//   await handle(c, 3000)
//   test()
// }
// test()


// function repeat(num) {
//   let count = 1
//   function handle() {
//     setTimeout(() => {
//       if (count <= 4) {
//         console.log(`第${count}次`)
//         if (count === num) {
//           console.log('hello world')
//         }
//         count++
//         handle()
//       }
//     }, 500)
//   }
//   handle()
// }
// repeat(3)

// const arr = [1, 1, 3, 4, 5, 6, 3, 2, 5, 5, 6, 6, 7, 9, 10]
// // const handle = (arr) => {
// //   return [...new Set(arr)]
// // }
// const handle = (arr) => {
//   const result = arr.reduce((prevVal, currVal) => {
//     if (!prevVal.includes(currVal)) {
//       prevVal.push(currVal)
//     }
//     return prevVal
//   }, [])
//   return result
// }
// console.log(handle(arr))

// const str = '213738439137284321999373333337996273339983'
// const handle = (str) => {
//   const arr = str.split('')
//   let max = 0
//   let value 
//   arr.forEach(item => {
//     const count = str.split(item).length - 1
//     if (max < count) {
//       max = count
//       value = item
//     }
//   })
//   return {
//     max,
//     value
//   }
// }
// console.log(handle(str))

// async function fn() {
//   return 100
// }

// (async function () {
//   const a = fn() // ? => pending 状态的 promise 对应值为 100
//   console.log('a', a)
//   const b = await fn() // ? => 100
//   console.log('b', b)
// })()

// (async function() {
//   console.log('start')
//   const a = await 100
//   console.log('a', a)
//   const b = await Promise.resolve(200)
//   console.log('b', b)
//   const c = await Promise.reject(300)
//   console.log('c', c)
//   console.log('end')
// })()

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


// script start
// async1 start
// promise1
// script end
// promise1 resolve
// async1 success
// async1 end

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

// script start
// async1 start
// async2
// promise1
// script end
// async1 end
// promise2
// setTimeout

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
// 3
// 7
// 4
// 1
// 2


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

// script start
// async1
// promise1
// script end
// 1
// timer2
// timer1


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
// resolve1
// finally undefined
// timer1
// resolved promise









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


// 1 
// 7
// 6
// 8
// 2
// 4
// 3
// 5
// 9
// 11
// 10
// 12



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


// 1
// 3
// 8
// 4
// 2
// 5
// 6
// 7



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


// 1
// 4
// 7
// 5
// 2
// 3
// 6




//  Promise.resolve().then(() => {
//     console.log('1');
//     throw 'Error';
//   }).then(() => {
//     console.log('2');
//   }).catch(() => {
//     console.log('3');
//     throw 'Error';
//   }).then(() => {
//     console.log('4');
//   }).catch(() => {
//     console.log('5');
//   }).then(() => {
//     console.log('6');
//   });

// 1
// 3
// 5
// 6


// const arr = [1, 1, 1, 1, 1, 3, 3, 4, 2, 5, 8, 9, 1, 3, 4, 1, 2, 2, 2, 9]
// // 统计数组中每个元素出现的次数
// const res = arr.reduce((count, cur) => {
//   count[cur] ? count[cur]++ : count[cur] = 1
//   return count
// }, {})
// console.log(res)


// let res = ''
// const str = '1234567890'
// for (let index = str.length - 1; index >= 0; index--) {
//   const element = str[index];
//   res += element
// }
// console.log(res)


// const handle = (...args) => {
//   const fn = handle.bind(null, ...args);
//   fn.toString = () => {
//     return args.reduce((prevVal, currVal) => prevVal + currVal, 0)
//   }
//   return fn
// }
// console.log(handle(1, 2, 3, 4, 5, 1, 2, 4, 5, 3).toString())

Function.prototype.myApply = function(ctx) {
  ctx = ctx || global
  const args = [...arguments][1]
  const fn = Symbol()
  ctx[fn] = this
  let res
  if (args) {
    res = ctx[fn](...args)
  } else {
    res = ctx[fn]()
  }
  delete ctx[fn]
  return res
}

Function.prototype.myCall = function(ctx) {
  ctx = ctx || global
  const fn = Symbol()
  ctx[fn] = this
  const args = [...arguments].slice(1)
  let res
  if (args) {
    res = ctx[fn](...args)
  } else {
    res = ctx[fn]()
  }
  delete ctx[fn]
  return res
}

function sum(...args) {
  return this.prefix + (args.reduce((prevValue, currValue) => prevValue + currValue, 0))
}

Function.prototype.myBind = function(ctx) {
  ctx = ctx || global
  const _self = this
  const outArgs = [...arguments].slice(1)
  const innerFn = function (...args) {
    return _self.call(
      this instanceof innerFn ? this : ctx,
      ...outArgs,
      ...args
    )
  }
  innerFn.prototype = Object.create(_self.prototype)
  return innerFn
}

let obj = {
  prefix: `$`
}
let bindSum = sum.myBind(obj, 1, 2, 3)
console.log(bindSum(4, 5))

// global.a = 2
// var a = 2
// function fn() {
//   console.log(this.a)
// }


// const obj = {
//   a: 1
// }

// // 调用方式
// fn()
// fn.myApply(obj)
// fn.myCall(obj)




// const handle = (obj) => {
//   if (!obj || typeof obj !== 'object') return
//   const res = Array.isArray(obj) ? [] : {}
//   for (const key in obj) {
//     if (Object.hasOwnProperty.call(obj, key)) {
//       res[key] = typeof obj[key] === 'object' ? handle(obj[key]) : obj[key]
//     }
//   }
//   return res
// }

// const deepCloneObj1 = {
//   a: 1,
//   b: 2,
//   c: {
//     q: 1,
//     w: 2,
//     e: 3,
//     r: [1, 2, 3]
//   }
// }
// const deepCloneObj2 = handle(deepCloneObj1)
// deepCloneObj2.c.q = 2222
// console.log(deepCloneObj)
// console.log(deepCloneObj2)



// const handle = (arr) => {
//   const hasArr = arr.some(item => Array.isArray(item))
//   if (!hasArr) return arr
//   const res = Array.prototype.concat.apply([], arr)
//   return handle(res)
// }
// const arr1111111 = [1, 2, 3, [5, 6, 7, [8, 9, 0, 10, 11, [12, 13, 14, 15]]]]
// console.log(handle(arr1111111))



// function myInstanceof(left, right) {
//   let prototype = left.__proto__
//   const _proto_ = right.prototype
//   while (true) {
//     if (!prototype) {
//       return false
//     } else if (prototype === _proto_) {
//       return true
//     }
//     prototype = prototype._proto_
//   }
// }
// console.log(myInstanceof(123, Array))



// function myNew(func) {
//   const obj = {}
//   const args = Array.prototype.slice(arguments, 1)
//   const res = func.apply(obj, args)
//   return typeof res === 'object' && res !== null ? res : obj
// }



/**
 * 多次触发只会最后一次管用
 */
function fd (cb, delay) {
  let timer = null
  return () => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      cb()
    }, delay)
  }
}

/**
 * 节流
 */
function jl (cb, delay) {
  let timer = null
  return () => {
    if (!timer) {
      timer = setTimeout(() => {
        timer = null
        cb()
      }, delay)
    }
  }
}


















