const str = 'abcba'
const str1 = 'abcdba'

/**
 * 将字符串翻转形成一个新的字符串，两个字符串做对比，看看是否相等
 * reverse(): 会改变原数组。
 */
// function test(str) {
//   const temp = str.split('').reverse().join('')
//   return temp === str
// }

/**
 * 遍历字符串，第一个和最后一个字符做对比，第二个和倒数第二个字符作对比，一直这样对比
 */
 function test(str) {
  // 空字符串
  if (!str) {
    return true
  }
  // 转换成消息，转换成数组
  str = str.toLowerCase().split('')
  let start = 0
  let end = str.length - 1
  while(start < end) {
    if (str[start] === str[end]) {
      start++
      end--
    } else {
      return false
    }
  }
  return true
}

/**
 * 和上边的实现原理一样，只不过采用递归的方式
 */
 function isPalindromicStr(str) {
  // 字符串处理完成时为空字符串
  if (!str) {
    return true
  }
  // 转换成消息，转换成数组
  str = str.toLowerCase()
  let start = 0
  let end = str.length - 1
  if (str[start] !== str[end]) {
    return false
  }
  // 删掉字符串首尾字符，进行递归
  // slice: 包含 end 
  return isPalindromicStr(str.slice(1, end))
}

console.log(test(str))
console.log(test(str1))