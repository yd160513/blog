const str = '213738439137284321999373333337996273339983'

/**
 * 定义一个数组，并且遍历字符串，如果数组中没有当前字符则将其 push 到数组中，如果有了则不处理，最后将数组转换成一个字符串
 */
// function test(str) {
//   const arr = []
//   for (let index = 0; index < str.length; index++) {
//     const element = str[index];
//     if (!arr.includes(element)) {
//       arr.push(element)
//     }
//   }
//   return arr.join('')
// }

/**
 * 将字符串转换为数组，将数组转换为 set，利用 set 的特性自动去重，然后将 set 再转换为数组
 */
// function test(str) {
//   const arr = Array.prototype.slice.call(str)
//   const set = new Set(arr)
//   return [...set].join('')
// }

/**
 * 将字符串转换成数组并遍历，在遍历中判断当前字符的索引在整个数组中是不是第一个，如果是在将当前字符返回，如果不是则进行下一次遍历
 */
function test(str) {
  const arr = Array.prototype.slice.call(str)
  const filterArr = arr.filter((val, i, arr) => {
    // 当前字符是不是在整个字符串生成的数组中第一次出现，如果是则返回，不是则忽略
    // arr.indexOf(val): 返回 val 第一次出现在数组中的位置
    return i === arr.indexOf(val)
  })
  return filterArr.join('')
}

console.log(test(str))