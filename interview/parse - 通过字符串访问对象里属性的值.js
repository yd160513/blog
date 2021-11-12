/**
 * 编写 parse 函数，实现通过字符串访问对象里属性的值
 * 第一种解决方案
 */
function parse(obj, str) {
  /**
   * 解析: [Function](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function)
   *    new Function ([arg1[, arg2[, ...argN]],] functionBody)
   *    最终得到一个匿名函数，最后一个参数是函数内部的执行语句，前边的参数全部都是匿名函数的参数
   * eg: 
   *    new Function('obj', `return obj.a`) 返回结果是:
   *    function anonymous(obj) {
   *      return obj.a
   *    }
   */
  const fn = new Function('obj', `return obj.${str}`)
  return fn(obj)
}
/**
 * 第二种解决方案
 */
function parse(obj, str) {
  /**
   * d+: 最少有一个数字
   * (): 对要替换的地方进行分区
   * .$1: 第一个 () 就是第一个分区，对应的就是 $1, 意思就是将第一个分区替换为 .
   * g: 全局匹配
   */
  str = str.replace(/\[(\d+)\]/g, `.$1`)
  // 将 str 按 . 做分割，分别获取对应的值
  const strArr = str.split('.')
  strArr.forEach(item => {
    /**
     * for 循环中 obj = obj[item] 操作的原因:
     * 因为 parse 这个方法不是循环调用，所以可以直接更改 obj 这个对象；
     * 这样在遇到嵌套对象的时候，第一次获取到外层的对象，第二次就可以去这个对象里边的值了
     * eg:
     *  str = 'b.c'
     *  const strArr = str.split('.') // [b, c]
     *  // 第一次循环 strArr 的时候 obj 如下:
     *  obj = {
     *    a: 1,
     *    b: { c: 2 },
     *    d: [1, 2, 3],
     *    e: [
     *      {
     *        f: [4, 5, 6]
     *      }
     *    ]
     *  }
     *  // 当第一次循环 strArr 结束之后，obj 如下:
     *  obj = { c: 2 }
     *  // 第二次循环 strArr 的时候，循环的 item 就是 c 这个时候正好从 obj 中获取 c 的值
     */
    obj = obj[item]
  })
  return obj
}

const obj = {
  a: 1,
  b: { c: 2 },
  d: [1, 2, 3],
  e: [
    {
      f: [4, 5, 6]
    }
  ]
}

const r1 = parse(obj, 'a')
const r2 = parse(obj, 'b.c')
const r3 = parse(obj, 'd[2]')
const r4 = parse(obj, 'e[0].f[0]')

console.log(r1)
console.log(r2)
console.log(r3)
console.log(r4)
