// isEqual 判断两个对象是否全相等
const obj1 = {
  a: 1,
  b: 2,
  c: {
    q: 1,
    w: 2,
    e: 3,
    r: [1, 2, 3]
  }
}

const obj2 = {
  a: 1,
  b: 2,
  c: {
    q: 1,
    w: 2,
    e: 3,
    r: [1, 2, 3]
  }
}

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
function max() {
  // 获取所有参数
  const args = Array.prototype.slice.call(arguments)
  console.log(args)
  let maxVal

  args.forEach(item => {
    // !maxVal: 第一次循环 maxVal 是 undefined 所以需要将 item 赋值给它
    // maxVal < item: item 大于上一次的 maxVal
    if (!maxVal || maxVal < item) maxVal = item
  })
  return maxVal
}

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
function deepClone(obj) {
  if (!obj || typeof obj !== 'object') return obj
  const result = typeof Array.isArray(obj) ? [] : {}
  for (const key in obj) {
    if (Object.hasOwnProperty.call(obj, key)) {
      result[key] = typeof obj[key] === 'object' ? deepClone(obj[key]) : obj[key]
    }
  }
  return result
}

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

const obj = {
  a: 1,
  b: { c: 2 },
  d: [1, 2, 3],
  e: [
    {
      f: [4, 5, 6]
    }
  ]
}

const r1 = parse(obj, 'a')
const r2 = parse(obj, 'b.c')
const r3 = parse(obj, 'd[2]')
const r4 = parse(obj, 'e[0].f[0]')

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
  console.log(1)
}
function fn2() {
  console.log(2)
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
Object.prototype.myCrate = function (prototype) {
  function F() { }
  F.prototype = prototype
  return new F()
}

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
function MyPromise(actuator) {
  this.status = 'pending'
  this.value = null
  this.reason = null
  this.resolvedCache = []
  this.rejectedCache = []

  this.resolve = (value) => {
    if (this.status === 'pending') {
      this.status = 'resolved'
      this.value = value
      while (this.resolvedCache.length) {
        this.resolvedCache.shift()(this.value)
      }
    }
  }
  this.reject = (reason) => {
    if (this.status === 'pending') {
      this.status = 'rejected'
      this.reason = reason
      while (this.rejectedCache.length) {
        this.rejectedCache.shift()(this.reason)
      }
    }
  }

  try {
    actuator(this.resolve, this.reject)
  } catch (error) {
    this.reject(error)
  }
}

MyPromise.prototype.then = function (resolvedCallback, rejectedCallback) {
  const promise2 = new MyPromise((resolve, reject) => {
    if (this.status === 'resolved') {
      queueMicrotask(() => {
        const res = resolvedCallback(this.value)
        // 这里直接使用 promise2 会报错: Cannot access 'p1' before initialization
        // 所以这里需要引入一个微任务: queueMicrotask
        resolvePromise(promise2, res, resolve, reject)
      })
    } else if (this.status === 'rejected') {
      queueMicrotask(() => {
        const res = rejectedCallback(this.reason)
        resolvePromise(promise2, res, resolve, reject)
      })
    } else if (this.status === 'pending') {
      this.resolvedCache.push(() => {
        queueMicrotask(() => {
          try {
            const res = resolvedCallback(this.value)
            resolvePromise(promise2, res, resolve, reject)
          } catch (error) {
            this.reject(error)
          }
        })
      })
      this.rejectedCache.push(() => {
        queueMicrotask(() => {
          try {
            const res = rejectedCallback(this.reason)
            resolvePromise(promise2, res, resolve, reject)
          } catch (error) {
            this.reject(error)
          }
        })
      })
    }
  })
  return promise2
}

function resolvePromise(promise2, value, resolve, reject) {
  if (promise2 === value) {
    return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
  }
  if (value instanceof MyPromise) {
    value.then(resolve, reject)
  } else {
    resolve(value)
  }
}

const promise = new MyPromise((resolve, reject) => {
  // const promise = new Promise((resolve, reject) => {
  resolve(`success`)
})
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
function myNew(Fun) {
  // 创建实例对象
  const obj = {}

  /**
   * 将构造函数的原型赋值给实例对象
   * eg: 在 Cat 的原型上定义了一个 sayHi() 方法，这个时候实例对象想要去调用的话就需要将实例对象的原型指向构造函数的原型，否则实例对象获取不到这个方法。
   *     myNew(Cat, '123', 123).sayHi()
   */
  obj.__proto__ = Fun.prototype

  // 获取 new 时的参数
  const arg = Array.prototype.slice.call(arguments, 1)
  // 将 this 指向实例对象
  const res = Fun.apply(obj, arg)

  // 如果构造函数中 return 的是对象 new 返回的就是这样对象，反之如果是基本类型，则返回实例对象 obj
  return typeof res === 'object' ? res : obj
}
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
  console.log(`这是一段很耗时的操作`)
  return id
}
// 两次调用 searchBox() 函数
console.log(cachedBox.searchBox(1)) // 计算返回的查找结果为: 1
console.log(cachedBox.searchBox(1)) // 缓存中查找的结果为: 1

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
console.log(stack.size()) // 2
console.log(stack.pop())
console.log(stack.size()) // 1

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
console.log(person.__proto__ === Person.prototype) // true
console.log(person.__proto__.__proto__ === Person.prototype.__proto__) // true
console.log(person.__proto__.__proto__.__proto__ === Object.prototype.__proto__) // true
console.log(Object.prototype.__proto__) // null
console.log(person.__proto__.__proto__.__proto__) // null

// ------------------------------------------------------------------------------------------------------------------------
// 继承
// 定义一个父类 Animal 
function Animal(name) {
  // 属性
  this.type = 'Animal'
  this.name = name || '动物'
  // 实例函数
  this.sleep = function () {
    console.log(`${this.name}正在睡觉!`)
  }
}
Animal.prototype.eat = function (food) {
  console.log(`${this.name}正在吃${food}`)
}
// 原型链继承: 重写子类 prototype 属性，将其指向父类的实例
function Cat(name) {
  this.name = name
}
// 原型链继承
Cat.prototype = new Animal()
/**
 * 核心: 将 Cat 的构造函数指向自身
 *  如果不将 Cat 原型对象的 constructor 属性指向自身的构造函数的话，那么将会指向父类的 Animal 的构造函数:
 *    通过原型继承更改了 Cat.prototype, 将 Cat 的原型改为了 Animal 的实例。
 *    这个时候通过 Cat.prototype 取到的是 Animal 的实例，也就是说 Cat.prototype.constructor 其实是 Animal 实例的 constructor，自然而然也就指向了 Animal。
 */
Cat.prototype.constructor = Cat
Cat.prototype.eat = function () {
  console.log('我是子类原型上的 eat')
}
const cat = new Cat('加菲猫')
console.log(cat.type) // Animal
console.log(cat.name) // 加菲猫
cat.sleep() // 加菲猫正在睡觉!
cat.eat('猫粮') // 加菲猫正在吃猫粮
console.log(cat instanceof Cat) // true
console.log(cat instanceof Animal) // true
function myInstanceof(self, target) {
  // 取到目标类型的原型
  const prototype = target.prototype
  // 取到被验证的原型
  let proto = self.__proto__
  while (true) {
    // null | undefined 原型的尽头是 null
    if (!proto) {
      return false
    } else if (prototype === proto) {
      return true
    }
    // 当前循环次上述条件都不符合就继续判断它的原型的原型，直到找到或者原型不存在(找到头了)
    proto = proto.__proto__
  }
}

const myRes = myInstanceof(cat, Cat)
console.log(myRes)

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

// 构造函数继承
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
//   // 构造函数继承
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
//   // 构造函数继承
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
console.log('事件循环 -------------')
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
async function async1() {
  console.log('async1 start')
  await async2() // resolve(Promise.resolve())
  console.log('async1 end')
}

async function async2() {
  console.log('async2')
}

console.log('script start')

setTimeout(function () {
  console.log('setTimeout')
}, 0)

async1()

new Promise(function (resolve) {
  console.log('promise1')
  resolve()
}).then(function () {
  console.log('promise2')
})

console.log('script end')
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
console.log('script start')

async function async1() {
  await async2()
  console.log('async1 end')
}
async function async2() {
  console.log('async2 end')
}
async1()

setTimeout(function () {
  console.log('setTimeout')
}, 0)

new Promise(resolve => {
  console.log('Promise')
  resolve()
})
  .then(function () {
    console.log('promise1')
  })
  .then(function () {
    console.log('promise2')
  })

console.log('script end')
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


// ------------------------------------------------------------------------------------------------------------------------


// ------------------------------------------------------------------------------------------------------------------------


// ------------------------------------------------------------------------------------------------------------------------


// ------------------------------------------------------------------------------------------------------------------------


// ------------------------------------------------------------------------------------------------------------------------


// ------------------------------------------------------------------------------------------------------------------------


// ------------------------------------------------------------------------------------------------------------------------


// ------------------------------------------------------------------------------------------------------------------------


