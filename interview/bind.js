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

// 完整版
// fn.bind(obj, 1, 2, 3, 4, ...)
// fn.bind(obj, 1, 2, 3, ...)(123)
Function.prototype.myBind = function (context) {
  // 获取第一个参数: this 指向
  context = context || window
  // 获取其他参数
  const outerArgs = [...arguments].slice(1)
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
  //    eg: let YPoint3 = Point.myBind(null, 1)
  //        YPoint3.prototype.getName = () => {}
  //        这个时候就会在 thatFunc.prototype 上增加一个 getName 方法
  //        所以为了不污染 thatFunc.prototype 所以使用 Object.create() 创建了一个副本
  fBound.prototype = Object.myCreate(thatFunc.prototype)
  return fBound
}

/**
 * 提示: 
 *    定义了一个 Point 函数，接收两个参数。Point 调用 bind，只传入 Point 的第一个参数。然后定义 YPoint 来接收 bind 的返回值，
 *    这个时候再调用 YPoint 传入一个参数，这个时候这个参数就是 Point 的第二个参数了
 *    function Point(x, y) {}
 *    let YPoint = Point.bind(null, 1) // 传入 Point 的第一个参数
 *    let axiosPoint = new YPoint(2) // 传入 Point 的第二个参数
 */
function sum(...args) {
  return this.prefix + (args.reduce((prevValue, currValue) => prevValue + currValue, 0))
}
let obj = {
  prefix: `$`
}
let bindSum = sum.myBind(obj, 1, 2, 3)
console.log(bindSum(4, 5))

function Point(x, y, z, q) {
  this.x = x
  this.y = y
  console.log(x)
  console.log(y)
  console.log(z)
  console.log(q)
}
Point.prototype.toString = function () {
  return `${this.x},${this.y}`
}

console.log('系统方法: ----------------')
// 系统方法
let YPoint3 = Point.bind(null, 1)
YPoint3(2, [1, 2, 3])
let axiosPoint3 = new YPoint3(2)
console.log(axiosPoint3.toString()) // 1,2
console.log(axiosPoint3 instanceof Point) // true
console.log(YPoint3 instanceof Point) // false
console.log(axiosPoint3 instanceof YPoint3) // true

console.log('myBind: ----------------')
let YPoint2 = Point.myBind(null, 1)
YPoint2(2, [1, 2, 3])
let axiosPoint2 = new YPoint2(2)
console.log(axiosPoint2.toString())
console.log(axiosPoint2 instanceof Point) // true
console.log(YPoint2 instanceof Point) // false
console.log(axiosPoint2 instanceof YPoint2) // true
