function isObject(obj) {
  return typeof obj === 'object' && obj !== null
}

function isEqual(obj1, obj2) {
  // 1. 两个参数不是对象则直接比较
  if (!isObject(obj1) || !isObject(obj2)) return obj1 === obj2

  /**
   * 2. obj1 等于 obj2 (调用 isEqual 时传入的两个参数是同一个对象)
   *    这一步在前是不是就可以省略掉判断这两个参数是不是对象了? 
   *      不可以，后边会调用 Object.keys() 判断这个两个参数的个数是否一样，这个时候如果是字符串的话就会把字符串的内容每一个都拆分开，这个时候就不对了
   *      Object.keys('123') => ['1', '2', '3']
   *      如果传入的是一个 null 的话就直接报错了
   */
  if (obj1 === obj2) return true

  // 3. 两个参数的 key 的个数是否一样
  const obj1Vals = Object.keys(obj1)
  const obj2Vals = Object.keys(obj2)
  // 个数不一样
  if (obj1Vals.length !== obj2Vals.length) return false

  // 4. 基于 obj1 中的 key 和 obj2 做递归对比
  for (const key in obj1) {
    if (Object.hasOwnProperty.call(obj1, key)) {
      // 递归调用 isEqual 对比当前 key 对应的 value 是否相等
      const res = isEqual(obj1[key], obj2[key])
      // 如果返回的是 true 则继续比较其他 key 这里不做任何处理
      // 如果返回的是 false 则直接 return 也就不用继续比较其他 key 了
      if (!res) {
        return false
      }
    }
  }
  // 5. 循环中没有 return 的话说明 这两个参数是完全相等的，因为如果有不相等的值在 for 循环中就被 return 了
  return true
}

const obj1 = {
  a: 1,
  b: 2,
  c: {
    q: 1,
    w: 2,
    e: 3,
    r: [1, 2, 3]
  }
}

const obj2 = {
  a: 1,
  b: 2,
  c: {
    q: 1,
    w: 2,
    e: 3,
    r: [1, 2, 3]
  }
}
console.log(isEqual(obj1, obj2))