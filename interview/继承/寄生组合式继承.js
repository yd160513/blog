// 核心: 通过借用构造函数来继承实例上的属性和方法，通过原型链继承来继承原型上的属性和方法。
// 优化: 优化了组合继承中父类的实例属性和方法会被绑定两次。导致子类原型上多了不需要的父类实例属性，存在内存上的浪费的问题。
// 本质: 使用寄生式继承来继承父类原型，然后再将结果指定给子类型的原型。
/**
 * 寄生组合式继承的基本模式:
 * 第一步: 寄生式继承: 给创建父类原型副本(原型式继承)和原型链继承提供一个单独的方法
 * 第二步: 借用构造函数继承: 继承实例上的属性和方法
 */
// 第一步: 
function inheritPrototype(subClass, superClass) {
  // 创建对象，创建父类原型的副本
  const prototype = Object.create(superClass.prototype)
  // 增强对象，为副本添加 constructor 属性并指向子类
  prototype.constructor = subClass
  // 指定对象，赋值给子类原型
  subClass.prototype = prototype
}

function Animal(name) {
  // 属性
  this.type = 'Animal'
  this.name = name || '动物'
  // 实例函数
  this.sleep = function() {
    console.log(`${this.name}正在睡觉!`)
  }
}
Animal.prototype.eat = function(food) {
  console.log(`${this.name}正在吃${food}`)
}
function Cat(name) {
  // 第二步: 借用构造函数继承: 继承实例上的属性和方法
  Animal.call(this)
  
  this.name = name
}

// 第一步: 寄生式继承: 给创建父类原型副本(原型式继承)和原型链继承提供一个单独的方法
inheritPrototype(Cat, Animal)

const cat = new Cat('加菲猫')
console.log(cat.type) // Animal
console.log(cat.name) // 加菲猫
cat.sleep() // 加菲猫正在睡觉!
cat.eat('猫粮') // 加菲猫正在吃猫粮

console.log(cat instanceof Cat) // true. 实例是子类的实例
console.log(cat instanceof Animal) // true. 实例也是父类的实例。原型链解决。