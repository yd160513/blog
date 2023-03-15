// 核心: 和原型式继承紧密相关的一种思路，类似于增加了工厂模式。
//      创建一个仅用于封装继承过程的函数，该函数在内部以某种方式来增强对象，最后将这个对象返回。这个对象同原型式继承一样，都是被用作子类原型。
function createAnother(proto) {
  const clone = Object.create(proto) // 原型式继承

  // 以某种方式来增强对象
  clone.sayHi = function () {
    console.log('hi')
  }

  // 返回这个对象(被用来当做子类原型)
  return clone
}

// 使用寄生式继承
const person2 = {
  name: 'test',
  friends: [1, 2, 3]
}

const personInstance = createAnother(person2)
personInstance.sayHi() // hi

// ---------------- 使用寄生式继承 ----------------
// 父类
function Animal(name) {
  // 实例属性
  this.type = 'Animal'
  this.name = name || '动物'
  this.test = []

  // 实例函数
  this.sleep = function () {
    console.log(`${this.name} 正在睡觉!`)
  }
}

// 原型方法
Animal.prototype.eat = function (food) {
  console.log(`${this.name} 正在吃 ${food}`)
}

// 子类
function Cat(name) {
  this.name = name
}

// 寄生式继承核心
const parentInstance = new Animal
Cat.prototype = createAnother(parentInstance)
Cat.prototype.constructor = Cat

const cat = new Cat('加菲猫')
console.log(cat.type) // Animal; 继承父类
console.log(cat.name) // 加菲猫; 自身属性
cat.sleep() // 加菲猫 正在睡觉!; 继承父类
cat.eat('猫粮') // 加菲猫 正在吃 猫粮; 原型方法
cat.sayHi() // hi

console.log(cat instanceof Cat) // true. 实例是子类的实例
console.log(cat instanceof Animal) // true. 实例也是父类的实例。原型链解决。

console.log(Cat.prototype.constructor === Cat) // true

/**
 * 问题:
 * 子类的所有实例将享有父类的所有属性和方法:
 *    如果父类中的一个属性为引用数据类型，那么改变子类实例的属性值将会影响其他实例的属性值。
 */
cat.test.push(1)
const cat2 = new Cat('test Cat')
cat2.test.push(2)
console.log(cat.test) // [1, 2]