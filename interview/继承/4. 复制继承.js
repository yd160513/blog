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
  console.log(`父类中的 eat 方法: ${this.name} 正在吃 ${food}`)
}

// 子类
function Cat(name) {
  const animal = new Animal(name)
  // 遍历父类实例，将其所有属性和函数添加到子类
  for (const key in animal) {
    const value = animal[key]
    // 原型上的属性和函数
    if (Object.hasOwnProperty.call(animal, key)) {
      Cat.prototype[key] = value
    }
    // 实例上的属性和方法
    else {
      this[key] = value
    }
  }
  Cat.prototype.constructor = Cat
  this.name = name
}

// 原型方法
Cat.prototype.eat = function (food) {
  console.log(`子类中的 eat 方法: ${this.name} 正在吃 ${food}`)
}

// 生成子类实例
const cat = new Cat('tony')

console.log(cat.type) // Animal; 继承父类
console.log(cat.name) // tony; 自身属性
cat.sleep() // tony 正在睡觉!; 继承父类
/**
 * 这里的 eat() 为什么执行的是父类中的? 
 *    因为代码执行顺序的问题，对子类原型的赋值: Cat.prototype.eat = function (food) { } 要优先于复制继承，所以在这里赋值之后，后续复制继承的时候又将其覆盖掉了
 */
cat.eat('猫粮') // 父类中的 eat 方法: tony 正在吃 猫粮

console.log(cat instanceof Cat) // true. 实例是子类的实例
/**
 * 既然都使用 for...in 遍历了父类实例原型上的属性了，为什么没有仍然不是父类的实例呢？
 *    因为这里更改的是原型对象上的属性，更改的并不是原型对象的索引，所以索引指向的还是子类。
 */
console.log(cat instanceof Animal) // false. 实例并不是父类的实例
