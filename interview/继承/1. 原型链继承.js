// 核心: 将父类实例赋值给子类原型
// 父类
function Animal(name) {
  // 实例属性
  this.type = 'Animal'
  this.name = name || '动物'

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

// 原型链继承
Cat.prototype = new Animal()
/**
 * 指回原型。
 * 如果不将 Cat 原型对象的 constructor 属性指向自身的构造函数的话，那么将会指向父类的 Animal 的构造函数:
 *    通过原型继承更改了 Cat.prototype, 将 Cat 的原型改为了 Animal 的实例。
 *    这个时候通过 Cat.prototype 取到的是 Animal 的实例，也就是说 Cat.prototype.constructor 其实是 Animal 实例的 constructor，自然而然也就指向了 Animal。
 */
Cat.prototype.constructor = Cat

const cat = new Cat('加菲猫')
console.log(cat.type) // Animal; 继承父类
console.log(cat.name) // 加菲猫; 自身属性
cat.sleep() // 加菲猫 正在睡觉!; 继承父类
cat.eat('猫粮') // 加菲猫 正在吃 猫粮; 原型方法
