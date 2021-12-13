
// 接收传入的对象，也就是 this 指向
Function.prototype.myApply = function(context) {
  if (typeof this !== 'function') {
    throw new TypeError('Error')
  }
  context = context || window
  // 这里用来改变 this 指向，使用 context 来调用 fn，this 也就指向了 context
  const fn = Symbol()
  context[fn] = this
  const args = [...arguments][1]
  let result
  // 处理参数和 call 有区别
  if (args) {
    // 将函数参数结构传入到调用 apply 的函数中
    result = context[fn](...args)
  } else {
    // 调用 apply 的时候没有传入第二个参数
    result = context[fn]()
  }
  delete context[fn]
  return result
}

// const/let 定义的值不会绑定在 window 上
// var 定义的变量在浏览器环境会默认绑定在 window 上
// 如果 js 文件是通过 node 跑起来的则是 node 环境，node 环境下不存在 window，只有 global，但是 var 声明的变量不会赋值到 global 上
// 所以，当在全局环境下定义 var a = 1， 然后在函数中通过 this.a 访问 a 是访问不到的，会返回 undefined
global.a = 2
var a = 2
function fn() {
  console.log(this.a)
}


const obj = {
  a: 1
}

// 调用方式
fn()
fn.myApply(obj)

const arr = [1, 2, 3, [5, 6, 7]]
const arr2 = []
console.log(Array.prototype.concat.myApply(arr2, arr)) // [ 1, 2, 3, 5, 6, 7 ]
