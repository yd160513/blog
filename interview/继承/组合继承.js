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
  // 构造函数继承
  Animal.call(this)
  
  this.name = name
}

// 原型继承
Cat.prototype = new Animal()
Cat.prototype.constructor = Cat

const cat = new Cat('加菲猫')
console.log(cat.type) // Animal
console.log(cat.name) // 加菲猫
cat.sleep() // 加菲猫正在睡觉!
cat.eat('猫粮') // 加菲猫正在吃猫粮