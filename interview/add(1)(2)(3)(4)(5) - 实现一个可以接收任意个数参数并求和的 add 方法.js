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
console.log(add3(1, 2, 3, 4, 5))
console.log(add3(1, 2, 3)(4, 5))
console.log(add3(1)(2)(3)(4)(5))