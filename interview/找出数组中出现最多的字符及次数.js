const arr = [1, 1, 1, 1, 1, 3, 3, 4, 2, 5, 8, 9, 1, 3, 4, 1, 2, 2, 2, 9]
// 统计数组中每个元素出现的次数
const res = arr.reduce((count, cur) => {
  count[cur] ? count[cur]++ : count[cur] = 1
  return count
}, {})

// 利用 reduce()
function getMaxCount(arr) {
  let maxVal
  let maxCount = 1
  // 这里的 count 就是 reduce 函数的第二个参数 {}
  arr.reduce((count, cur) => {
    count[cur] ? count[cur]++ : count[cur] = 1
    if (count[cur] > maxCount) {
      maxCount = count[cur]
      maxVal = cur
    }
    return count
  }, {})
  return {
    maxVal,
    maxCount
  }
}
console.log(getMaxCount(arr))
