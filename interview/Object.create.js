const proto = { name: '张三', age: 18 }
const other = {
  aaa: {
    value: 'hello'
  }
}
// 创建一个指定原型和属性的对象
const res = Object.create(proto, other)
/**
 * 结果:
 * {
 *  aaa: hello,
 *  __proto__: {
 *    age: 18,
 *    name: '张三'
 *  }
 * }
 */
console.log('官方结果 =>', res)

/**
 * 创建一个对象，这个对象的原型是第一个参数
 * 1. 创建一个函数
 * 2. 将函数原型指向传入的第一个参数
 * 3. 将 1 中的函数作为构造函数 new 一下，生成一个实例对象
 * 4. 第二个参数是一个对象，对象中的 key 将是新生成这个对象的属性。所以遍历第二个参数，将它的 key 设置到新的实例对象上， value 就是 key 的 value
 *    {
 *      name: { // key
 *        value: 'xxx' // value
 *      }
 *    }
 * 5. 将实例对象 return
 */
function myCreate(proto, other) {
  // 创建一个函数
  function Fn() { }
  // 将函数原型指向传入的第一个参数
  Fn.prototype = proto
  // 创建实例对象，这个对象也就是最终得到的对象
  const obj = new Fn()
  // 第二个参数是一个对象，对象中的 key 将是新生成这个对象的属性。
  for (const key in other) {
    if (Object.hasOwnProperty.call(other, key)) {
      // 将第二个参数的 key 设置到 obj 上
      // 参数中的 value 指向 key 的 value
      const element = other[key];
      obj[key] = element.value
    }
  }
  return obj
}
console.log(myCreate(proto, other))