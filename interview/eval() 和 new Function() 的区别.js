// 1. 都会将传入的字符串作为 js 脚本执行。
// const test = 'test'
// eval('console.log(test)') // test

// let foo = new Function("name", "console.log(name)");
// foo('这是传入的 name')

// 2. eval() 访问的是当前作用域；new Function() 访问的是全局作用域。
// global.foo = 'foo' // 如果是浏览器环境下则是 window
// function bar() {
//   const foo = 'foo1'
//   eval('console.log(foo)') // foo1
//   global.eval('console.log(foo)') // foo

//   const fun = new Function('console.log(foo)')
//   fun() // foo
// }
// bar()

// 3. 严格模式下，对 eval 赋值会报错
'use strict'
eval = 1