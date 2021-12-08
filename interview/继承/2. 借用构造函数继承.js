// 核心: 在子类中通过 call() 调用父类，将父类实例属性绑定到子类
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
  // 核心: 通过 call() 来继承父类的实例属性和函数
  Animal.call(this)
  this.name = name
}
// 生成子类实例
const cat = new Cat('tony')

console.log(cat.type) // Animal; 继承父类
console.log(cat.name) // tony; 自身属性
cat.sleep() // tony 正在睡觉!; 继承父类
/**
 * 不能调用的原因:
 *    eat() 是父类原型上的函数，
 *    通过 call() 的调用只是将父类实例上的属性和方法绑定到了子类上，而父类原型和子类并没有什么关系。
 *    也就是说: 子类并没有通过某种方式来和父类原型上的属性和函数产生联系。
 */
// cat.eat('猫粮') // TypeError: cat.eat is not a function

console.log(cat instanceof Cat) // true. 实例是子类的实例
console.log(cat instanceof Animal) // false. 实例并不是父类的实例
