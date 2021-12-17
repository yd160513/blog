/**
 * 输出 9 个长度的斐波那契数列: 
 *    1 1 2 3 5 8 13 21 34 ...
 */

function handle(num) {
  if (num <= 2) return 1
  // 获取当前元素的前两个元素相加的结果
  return handle(num - 1) + handle(num - 2)
}

function fibonacci(length) {
  let res = ``
  for (let index = 1; index <= length; index++) {
    res = `${res} ${handle(index)}`
  }
  return res
}

console.log(fibonacci(8))