// ------------------------------- 原型式继承 -------------------------------
// 核心: 先创建一个临时性的构造函数，然后将传入的对象作为这个构造函数的原型，最后返回这个临时构造函数的实例。这里的实例就会被用作子类的原型。
/**
 * 将传入的对象绑定到内部构造函数的原型上，然后生成该构造函数的实例并 return
 * 函数的作用就相当 Object.create()
 * @param {object} proto 原型对象
 * @returns 新的实例
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

// ------------------------------- 寄生式继承 -------------------------------
// 核心: 和原型式继承紧密相关的一种思路，类似于增加了工厂模式，创建一个仅用于封装继承过程的函数，该函数在内部以某种方式来增强对象，最后将这个对象返回。这个对象同原型式继承一样，都是被用作子类原型。
function createAnother(proto) {
  const clone = Object.create(proto) // 原型式继承

  // 以某种方式来增强对象
  clone.sayHi = function () {
    console.log('hi')
  }

  // 返回这个对象
  return clone
}

// 使用寄生式继承
const person2 = {
  name: 'test',
  friends: [1, 2, 3]
}

const personInstance = createAnother(person2)
personInstance.sayHi() // hi