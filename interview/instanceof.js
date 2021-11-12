// 原理: 通过查找原型链来检测某个变量是否为某个类型数据的实例
// 用法
const res = [] instanceof Array
const res1 = [] instanceof Object
console.log(res)
console.log(res1)
console.log('---')

/**
 * self 被验证的
 * target 目标类型
 * ----
 * prototype 和 __proto__:
 *    它俩都指向原型，只不过在不同对象上 key 是不一样的，在构造函数上是 prototype， 在实例上是 __proto__
 */
function myInstanceof(self, target) {
  // 取到目标类型的原型
  const prototype = target.prototype
  // 取到被验证的原型
  let proto = self.__proto__
  while (true) {
    // null | undefined, 原型的尽头是 null
    if (!proto) {
      return false
    } else if (prototype === proto) {
      return true
    }
    // 当前循环次上述条件都不符合就继续判断它的原型的原型，直到找到或者原型不存在(找到头了)
    proto = proto.__proto__
  }
}

const myRes = myInstanceof([], Array)
const myRes2 = myInstanceof([], Object)
console.log(myRes)
console.log(myRes2)
console.log('----')
// 以下可以总结为: 两个基础类型的构造函数相比的情况下都会返回 false；应用类型的构造函数相比都会返回 true
function Foo() {}
console.log(myInstanceof(Object, Object)) // true
console.log(myInstanceof(Function, Function)) // true
console.log(myInstanceof(Number, Number)) // false
console.log(myInstanceof(Boolean, Boolean)) // false
console.log(myInstanceof(String, String)) // false
console.log(myInstanceof(Function, Object)) // true
console.log(myInstanceof(Foo, Function)) // true
console.log(myInstanceof(Foo, Foo)) // false