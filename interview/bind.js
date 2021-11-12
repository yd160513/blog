// 调用方式: fn.apply(obj, [...])
Function.prototype.myApply = function (context) {
  // 获取第一个参数
  // context = context || window
  // 获取第二个参数
  const secArg = arguments[1]
  // 用传入的第一个参数法来调用调用 myApply 的函数
  const fn = Symbol()
  context[fn] = this
  let result
  if (secArg) {
    result = context.fn(...secArg)
  } else {
    result = context.fn()
  }
  delete context.fn
  return result
}

/**
 * 创建一个新对象，使用现有的对象来提供新创建的对象的__proto__。(以第一个参数作为新对象的构造函数的原型对象)
 * @param {object} prototype 原型对象
 * @returns 
 */
Object.myCreate = function(prototype) {
  // 定义一个空的构造函数
  function F() {}
  // 指定构造函数的原型对象
  F.prototype = prototype
  // 通过 new 运算符创建一个空对象
  const obj = new F()
  // 返回创建的对象
  return obj
}

// new 出来的实例的原型没有指向构造类
// fn.bind(obj, 1, 2, 3, 4, ...)
// fn.bind(obj, 1, 2, 3, ...)(123)
Function.prototype.myBind = function (context) {
  // 获取后边的参数
  const args = [...arguments].slice(1)
  // 获取 this 指向
  // context = context || window
  const fn = this
  // 因为 bind 是返回一个函数，函数就可以被 new
  const F = function () {
    // this instanceof F: 这里的判断相当于 new 的是 F 这个函数
    if (this instanceof F) {
      // 因为函数可以被 new 所以需要拼接 F 的参数 arguments
      // 因为 new 的 this 是指向实例的，所以需要忽略调用 bind 时传入的 this
      return new fn(...args, ...arguments)
    }
    // 普通的函数通过 apply 来实现
    return fn.apply(context, args.concat(...arguments))
  }
  //继承一下绑定函数属性的值 
  function Foo() { }
  Foo.prototype = this.prototype;
  //使用一个空函数进行中转。 
  F.prototype = new Foo();
  return F
}

// 完整版
// fn.bind(obj, 1, 2, 3, 4, ...)
// fn.bind(obj, 1, 2, 3, ...)(123)
Function.prototype.myBind2 = function (context, ...outerArgs) {
  // 第一版: 不支持 new
  // return (...innerArgs) => {
  //   return this.call(context, ...outerArgs, ...innerArgs)
  // }
  // 第二版
  // 缓存调用 bind 的函数
  const thatFunc = this
  // fBound 是被返回的函数
  const fBound = function (...innerArgs) {
    // bind() 方法返回的函数的结果，是调用 bind() 方法的函数的执行结果。
    // 所以这里采用了外侧的 this，也就是谁调用了 bind() 方法，这里就执行谁。
    return thatFunc.call(
      /**
       * 不论是 new 的方式调用，还是直接调用，它们都会被调用，
       * 只不过 this 的指向不一样，所以这里需要区分是哪种方式调用。
       * 因为如果 bind 返回的 fBound 函数是通过 new 来调用的话，则 fBound 的实例的原型必定是指向调用 bind 方法的函数的。也就是说 this 指向必定是指向调用 bind 的函数的。
       * 所以这里可以通过 instanceof 判断实例的原型是否存在于 thatFunc
       * 问题: this instanceof thatFunc 中 this 的指向是指向 fBound 函数的，和 thatFunc 有什么关系？
       *    这里正常是没有关系的，所以需要手动将 fBound 的原型指向给 thatFunc 的原型。
       *    这样 fBound 的实例就会指向 thatFunc 的原型，this instanceof thatFunc 也就可以成立。
       */
      this instanceof thatFunc ? this : context, ...outerArgs, ...innerArgs
    )
  } 
  // 使用 Object.create(thatFunc.prototype) 的原因:
  //    eg: let YPoint3 = Point.myBind2(null, 1)
  //        YPoint3.prototype.getName = () => {}
  //        这个时候就会在 thatFunc.prototype 上增加一个 getName 方法
  //        所以为了不污染 thatFunc.prototype 所以使用 Object.create() 创建了一个副本
  fBound.prototype = Object.myCreate(thatFunc.prototype)
  return fBound
}

// function sum(...args) {
//   return this.prefix + (args.reduce((prevValue, currValue) => prevValue + currValue, 0))
// }
// let obj = {
//   prefix: `$`
// }
// let bindSum = sum.myBind(obj, 1, 2, 3)
// console.log(bindSum(4, 5))

function Point(x, y) {
  this.x = x
  this.y = y
}
Point.prototype.toString = function () {
  return `${this.x},${this.y}`
}
/**
 * 定义了一个 Point 函数，接收两个参数。Point 调用 bind，只传入 Point 的第一个参数。然后定义 YPoint 来接收 bind 的返回值，
 * 这个时候再调用 YPoint 传入一个参数，这个时候这个参数就是 Point 的第二个参数了
 * function Point(x, y) {}
 * let YPoint = Point.bind(null, 1) // 传入 Point 的第一个参数
 * let axiosPoint = new YPoint(2) // 传入 Point 的第二个参数
 */

let emptyObj = {}

console.log('系统方法: ----------------')
// 系统方法
let YPoint3 = Point.bind(null, 1)
let axiosPoint3 = new YPoint3(2)
console.log(axiosPoint3.toString()) // 1,2
console.log(axiosPoint3 instanceof Point) // true
console.log(YPoint3 instanceof Point) // false
console.log(axiosPoint3 instanceof YPoint3) // true

// console.log('myBind: ----------------')
// let YPoint = Point.bind(null, 1)
// let YPoint = Point.myBind(null, 1)
// let axiosPoint1 = new YPoint(2)
// console.log(axiosPoint1.toString()) // 1,2
// console.log(axiosPoint1 instanceof Point) // true
// console.log(YPoint instanceof Point) // true
// console.log(axiosPoint1 instanceof YPoint) // false

console.log('myBind2: ----------------')
// let YPoint = Point.bind(null, 1)
let YPoint2 = Point.myBind2(null, 1)
let axiosPoint2 = new YPoint2(2)
console.log(axiosPoint2.toString())
console.log(axiosPoint2 instanceof Point) // true
console.log(YPoint2 instanceof Point) // false
console.log(axiosPoint2 instanceof YPoint2) // true
