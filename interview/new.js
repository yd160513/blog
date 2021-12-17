/**
 * 实现流程:
 * 1. 创建实例对象
 * 2. 将实例对象原型和构造函数绑定。(将构造函数原型赋值给实例对象的原型)
 * 2. 更改 this 指向，通过实例对象来调用构造函数并接收其返回值
 * 3. 如果构造函数返回的是对象则将这个对象 return， 如果是基本类型则将第一步中创建的实例对象 return。(new 的规定)
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
  return typeof res === 'object' && res !== null ? res : obj
}

// 简化版
// function myNew(parent, ...args) {
//   const newObj = Object.create(parent.prototype)
//   const result = parent.apply(newObj, args)
//   return newObj
// }

function Cat(name, age) {
  this.name = name
  this.age = age
  
  // return {}
  // return 123
}
// 构造函数原型上定义方法
Cat.prototype.sayHi = function() {
  console.log('hi')
}

console.log(new Cat('123', 123)) // Cat {name: '123', age: 123}
console.log(myNew(Cat, '123', 123))
myNew(Cat, '123', 123).sayHi()
