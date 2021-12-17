// 闭包的理解
function parent() {
  const value = 'parent-value'
  return function() {
    const val = value
    console.log(val)
  }
}
// child 函数有权访问 parent 中的变量，child 函数就被称为闭包。
const child = parent()
child()

// 1. 封装: 使用数组模仿栈的实现
const stack = (() => {
  const arr = []
  return {
    push: (value) => {
      arr.push(value)
    },
    pop: () => {
      return arr.pop()
    },
    size: () => {
      return arr.length
    }
  }
})()
stack.push('abc')
stack.push('def')
console.log(stack.size()) // 2
console.log(stack.pop())
console.log(stack.size()) // 1

// 2. 缓存的容器
const cachedBox = (() => {
  const cache = {}
  return {
    searchBox: (id) => {
      // 如果在内存中，直接返回
      if (id in cache) {
        return `缓存中查找的结果为: ${cache[id]}`
      }
      // 经过一段很耗时的 dealFn() 函数处理
      const result = dealFn(id)
      // 更新缓存的结果
      cache[id] = result
      // 返回计算的结果
      return `计算返回的查找结果为: ${cache[id]}`
    }
  }
})()
// 处理很耗时的函数
function dealFn(id) {
  console.log(`这是一段很耗时的操作`)
  return id
}
// 两次调用 searchBox() 函数
console.log(cachedBox.searchBox(1)) // 计算返回的查找结果为: 1
console.log(cachedBox.searchBox(1)) // 缓存中查找的结果为: 1