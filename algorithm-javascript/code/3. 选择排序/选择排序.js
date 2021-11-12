/**
 * 选择排序 时间复杂度: O(n方)
 * @param {array} list 无序数组
 * @returns list
 * 
 * 假设第一个元素是当前数组中最小的，将其索引存起来
 * 继续遍历后边的元素，如果有其他元素小于记下的这个元素的话则将记下的元素索引替换为这个元素的索引，
 * 遍历完成一遍之后将记下的这个索引对应的元素替换至数组第一位，遍历完成第二遍后，将记下的元素替换值数组第二位，
 * 也就是说每遍历完成第几遍，替换的位置就是第几个
 */
 function test(list) {
  let cacheIndex
  const len = list.length
  /**
   * 问: 为什么外层循环的结束条件是 i < len - 1 而不是 i < len ?
   * 答: 这里也可以写成 i < len，但是 - 1 的原因是可以减少最后一次的无用循环。
   *    [2, 8, 4, 5, 9, 0, 1] 这么一个数组
   *    他的外层满足条件的最后一次循环是 i = 6，由于内层循环的起始值是 i + 1，
   *    也就导致了外层的这次循环根本就进入不了内层循环，因为 6 + 1 不小于 len，
   *    也正因为最后一次什么都没做，倒数第二次的结果其实是和最后一次的结果是一样的，
   *    所以也就可以让外层循环少做一次循环，也就是把 i < len 改为 i < len - 1
   */
  for (let i = 0; i < len - 1; i++) {
    console.log(`外层索引为${i}的循环`)
    cacheIndex = i
    for (let k = i + 1; k < len; k++) {
      console.log(`内层索引为${k}的循环`)
      const iVal = list[cacheIndex]
      const kVal = list[k]
      if (iVal > kVal) {
        cacheIndex = k
      }
    }
    // 当记下的值小于 i 的值时进行替换
    if (list[cacheIndex] < list[i]) {
      const temp = list[i]
      list[i] = list[cacheIndex]
      list[cacheIndex] = temp
    }
    
    console.log(`外层索引为${i}的循环后的 list =>`, list)
  }
  return list
}

const arr = [2, 8, 4, 5, 9, 0, 1]
console.log(test(arr))