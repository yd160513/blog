const str = '1234567890'

/**
 * 将字符串转成数组然后利用 reverse() 函数来翻转，之后再拼接为字符串
 */
// function reverseStr(str) {
//   return str.split('').reverse().join('')
// }

/**
 * 通过改变 slice() 函数的调用主体获取到数组，然后调用数组的 reverse() 函数再拼接为字符串
 */
// function reverseStr(str) {
//   const temp = Array.prototype.slice.call(str)
//   return temp.reverse().join('')
// }

/**
 * 从字符串的最后一个向前遍历，然后拼接到新的字符串中将其返回
 */
// function reverseStr(str) {
//   let res = ''
//   for (let index = str.length - 1; index >= 0; index--) {
//     const element = str[index];
//     res += element
//   }
//   return res
// }

// console.log(reverseStr(str))

/**
 * 递归的方式
 */
function reverseStr(str, pos, res) {
  // pos 小于 0 了说明 str 的每一项都处理完了
  if (pos < 0) {
    return res
  }
  res += str[pos]
  return reverseStr(str, --pos, res)
}
console.log(reverseStr(str, str.length - 1, ''))