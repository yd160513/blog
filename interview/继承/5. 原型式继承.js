// 核心: 先创建一个临时性的构造函数，然后将传入的对象作为这个构造函数的原型，最后返回这个临时构造函数的实例。这里的实例就会被用作子类的原型。
/**
 * 将传入的对象绑定到内部构造函数的原型上，然后生成该构造函数的实例并 return
 * 函数的作用就相当 Object.create()
 * @param {object} proto 原型对象
 * @returns 新的实例(被用作子类的原型)
 */
function object(proto) {
  function F() { }
  F.prototype = proto
  return new F()
}

const person = {
  name: 'test',
  friends: [1, 2, 3]
}

// 将 person 绑定到了 object() 函数返回的实例的原型上
// const anotherPerson = object(person)
// object() 函数的作用就相当 Object.create()
const anotherPerson = Object.create(person)
anotherPerson.name = 'anotherPerson'
anotherPerson.friends.push('anotherPerson')

// const yetAnotherPerson = object(person)
// object() 函数的作用就相当 Object.create()
const yetAnotherPerson = Object.create(person)
yetAnotherPerson.name = 'yetAnotherPerson'
yetAnotherPerson.friends.push('yetAnotherPerson')

// person 对象是被绑定到了实例的原型上，不论生成多少个实例，其实访问都是同一个原型。
console.log(person.friends) // [1, 2, 3, 'anotherPerson', 'yetAnotherPerson']

// ---------------- 使用原型式继承 ----------------
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

// 原型式继承核心
const parentInstance = new Animal
Cat.prototype = object(parentInstance)
Cat.prototype.constructor = Cat

const cat = new Cat('加菲猫')
console.log(cat.type) // Animal; 继承父类
console.log(cat.name) // 加菲猫; 自身属性
cat.sleep() // 加菲猫 正在睡觉!; 继承父类
cat.eat('猫粮') // 加菲猫 正在吃 猫粮; 原型方法

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
