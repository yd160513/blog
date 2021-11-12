/**
 * 在一个有序列表 list 中寻找 target, 存在则返回 target 在 list 中的索引，反之返回 -1
 *  1. 初始化的时候获取一个开始的索引值 startIndex 和一个结束的索引值 endIndex，用来维护动态区间
 *  2. 如果 startIndex <= endIndex 说明这个区间就是有值的，就需要取比对
 *  3. 通过 (startIndex + endIndex) / 2 得到区间的中间的那个值对应的索引 middleIndex
 *  4. 通过 middleIndex 获取对应的 middleValue
 *  4. 用 middleValue 和 target 相比:
 *    1. middleValue 和 target 相等则将 middle return
 *    2. 如果 middleValue 大于 target，说明这个值比 target 大，然后将 middle - 1 赋值给 endIndex
 *    3. 如果 middleValue 小于 target，说明这个值比 target 小，然后将 middle + 1 赋值给 startIndex
 *    4. 然后再次循环判断
 */
/**
 * 在一个有序的 list 中查找 target, 有则返回 target 对应的索引，反之返回 -1
 * @param {array} list 有序 list
 * @param {string | number} target 被查找的值
 * @returns number
 */
function search(list, target) {
  // 定义一个区间，这个区间是动态的，每遍历一遍匹配不到值的话这个区间就会缩小，缩小就是通过改变 startIndex 和 endIndex 来缩小的。
  let startIndex = 0
  let endIndex = list.length - 1

  // 因为是有序的，当 startIndex 一直小于 endIndex 的时候说明区间内一直有值，所以需要一直循环比较。当 startIndex > endIndex 的时候说明区间内没有值了，也就没有匹配到 return null
  while (startIndex <= endIndex) {
    // 根据区间来取中间数。这里为什么不采用 list.length 来取中，因为这个区间是动态的，而 list.length 是不变的
    const middleIndex = (startIndex + endIndex) / 2
    const middleValue = list[middleIndex]
    // 中间值等于目标值
    if (middleValue === target) {
      return middleIndex
    }
    // 中间值大于目标值
    else if (middleValue > target) {
      // [1, 2, 3, 4, 5, 6, 7] 比如 middleValue 为 4，则新的区间应该为 1 - 3 了，所以 middleIndex - 1
      endIndex = middleIndex - 1
    }
    // 中间值小于目标值
    else if (middleValue < target) {
      // [1, 2, 3, 4, 5, 6, 7] 比如 middleValue 为 4，则新的区间应该为 5 - 7 了，所以 middleIndex + 1
      startIndex = middleIndex + 1
    }
  }
  return -1
}

const list = [4, 8, 12, 33, 88, 99, 190]
const target = 8
const otherTarget = 10000
console.log(search(list, otherTarget))