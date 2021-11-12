const str = '213738439137284321999373333337996273339983'

/**
 * 遍历字符串，将出现过的字符以及其出现次数按照 key-value 的形式存储
 */
// function getMaxCountVal(str) {
//   let res = {}
//   let maxCount = 0
//   let value
//   // 遍历字符串
//   for (let index = 0; index < str.length; index++) {
//     const element = str.charAt(index);
//     // 对象中没有当前字符则设定出现次数初始值为 1
//     if (!res[element]) {
//       res[element] = 1
//     } 
//     // 对象中已经有当前字符，则将其出现次数 +1
//     else {
//       res[element] += 1
//     }
//   }
//   for (const key in res) {
//     if (Object.hasOwnProperty.call(res, key)) {
//       const element = res[key];
//       if (element > maxCount) {
//         maxCount = element
//         value = key
//       }
//     }
//   }
//   return {
//     maxCount,
//     value
//   }
// }

/**
 * 1. 将字符串转换为数组然后遍历
 * 2. 在遍历中，用每一项来对源字符串做分割，分割出来的数组长度 -1 就是当前字符出现的次数
 * 3. 如果当前字符串出现的次数大于记录中的出现次数则替换，直到遍历完成
 * 4. 将记录中的返回
 */
// function getMaxCountVal(str) {
//   let maxCount = 0
//   let value
//   const arr = str.split('')
//   arr.forEach(item => {
//     /**
//      * var s = '22345112322'
//      * s.split('2') 得到: ['', '', '34511', '3', '', '']
//      * length 为 6， -1 得到 '2' 出现的次数
//      */
//     const count = str.split(item).length - 1
//     // 对比是否大于记录中出现次数
//     if (maxCount < count) {
//       maxCount = count
//       value = item
//     }
//   })
//   return {
//     maxCount,
//     value
//   }
// }

/**
 * 将字符串进行排序，然后遍历字符串，根据 lastIndexOf() 来确定字符出现的次数
 */
function getMaxCountVal(str) {
  let maxCount = 0
  let value
  // 将字符串排序
  str = str.split('').sort().join('')
  for (let index = 0; index < str.length - 1; index++) {
    // 获取到当前字符
    const val = str.charAt(index)
    /**
     * str.lastIndexOf(val): 获取到当前字符在整个字符串中最后一次出现的索引
     * 减 index 的原因: 
     *    当遍历到当前字符的时候，它的前面也有可能有其他字符，所以要将前边遍历的次数减掉。
     *    也就是说当前遍历的次数就是处理过几个字符的次数，也就说明了当前字符前边有几个不同的字符，在获取到 lastIndexOf() 之后要将当前字符前边的其他字符的占位去掉，所以进行了 -index
     *    eg: 
     *      字符串: '12234'
     *      1. 第一次执行到这里的时候: 
     *            str.lastIndexOf(val) 得到的是 0，
     *            index 为 0，
     *            -index + 1 得到真实的出现次数 1
     *      2. 第二次执行到这里的时候:
     *            str.lastIndexOf(val) 得到的是 2，
     *            index 为 1，
     *            -index + 1 得到真实的出现次数 2
     *      3. 第三次执行到这里的时候:
     *            str.lastIndexOf(val) 得到的是 3，
     *            index 为 3，因为下边有 index = str.lastIndexOf(val)，在第二次循环结束之后将 index 重置了
     *            -index + 1 得到真实出现次数 1
     *      4. 第四次执行到这里的时候:
     *            str.lastIndexOf(val) 得到的是 4，
     *            index 为 4，
     *            -index + 1 得到真实的出现次数 1
     * 加 1 的原因: 因为 lastIndexOf() 获取到的是索引，所以需要 +1 来得到数量
     */
    const count = str.lastIndexOf(val) - index + 1
    if (count > maxCount) {
      maxCount = count
      value = val
    }
    /**
     * 当遍历的字符第一次被遍历到的时候，在这一步: const count = str.lastIndexOf(val) - index + 1 就已经拿到了它出现的次数，
     * 所以重复的就无需再遍历了，所以下一次循环可以直接从下一个字符开始遍历了。
     * 所以将 index 置为当前字符的最后一个的索引，这样在下次遍历的时候就可以从新的字符开始了
     */
    index = str.lastIndexOf(val)
  }
  return {
    maxCount,
    value
  }
}

console.log(getMaxCountVal(str))
