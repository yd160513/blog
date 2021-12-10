

// 调用方式: fn.call(obj, arg1, arg2, ...)
Function.prototype.myCall = function (context){
  // 获取第一个参数: this 指向
  context = context || window
  // 获取其他参数
  const args = [...arguments].slice(1) // slice 获取到的是一个数组
  // 用传入的第一个参数法来调用调用 myCall 的函数
  const fn = Symbol()
  context[fn] = this
  const result = context[fn](...args)
  // 将 fn 从 context 上删除，否则在 context 上会多一个 key => fn
  delete context[fn]
  // 将执行结果 return
  return result
}

// const/let 定义的值不会绑定在 window 上
// var 定义的变量在浏览器环境会默认绑定在 window 上
// 如果 js 文件是通过 node 跑起来的则是 node 环境，node 环境下不存在 window，只有 global，但是 var 声明的变量不会赋值到 global 上
// 所以，当在全局环境下定义 var a = 1， 然后在函数中通过 this.a 访问 a 是访问不到的，会返回 undefined
global.a = 2
// var a = 2
const a = 1
const obj = {
  a: 12213
}
function test(b, c, d) {
  console.log(this.a)
  console.log(b)
  console.log(c)
  console.log(d)
}

// 调用方式
// test(1, 2,3)
test.myCall(obj, 1, 2,3)
