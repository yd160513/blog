/**
 * 快速排序
 * @param {array} list 无序数组
 * 引用: https://www.ruanyifeng.com/blog/2011/04/quicksort_in_javascript.html
 * 
 * 核心是通过递归来实现
 * 1. 随便在数组中找一个基准值存起来，将基准值从数组中删除，然后遍历这个数组依次和基准值比较
 * 2. 大于这个基准值的放到基准值的右边
 * 3. 小于这个基准值的放到基准值的左边
 * 4. 一轮循环完成之后，就可以保证基准值的位置已经是正确的了。基准值左侧的值都是小于基准值的，右侧都是大于基准值的。
 * 5. 再将基准值左边的值定义为一个新的数组，将这个数组重复 1 - 5。
 * 5. 左边的处理完成之后再去处理右边的，同 5。
 * 6. 递归过程中传入的数组如果只有一个值了，递归结束，直接将数组 return
 */
function quickSort(list) {
  // 如果 list 只有一个值，则直接将其 return
  if (list.length <= 1) return list
  // 随便找一个基准值，这里以数组的最后一个为基准值
  const pivotIndex = list.length - 1
  // 获取到基准值并将基准值从数组中删除
  const pivot = list.splice(pivotIndex, 1)[0]
  // 因为快排就是要不断地确定基准值，不断的进行分区。基准值左边的值 + 基准值 + 基准值右边的值就是最终的结果。
  // 所以在这里要定义一个存放基准值左侧值的数组和一个存放基准值右侧值的数组
  const leftArr = []
  const rightArr = []
  // 遍历这个数组，依次和基准值进行比较
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    // 如果 item 大于基准值则将其放到大于基准值的数组(rightArr)中
    if (item > pivot) {
      rightArr.push(item)
    } else if (item < pivot) {
      leftArr.push(item)
    }
  }
  
  // 基准值左边的值 + 基准值 + 基准值右边的值就是排序之后的结果，将其 return
  return quickSort(leftArr).concat([pivot], quickSort(rightArr))
}

const arr = [2, 8, 4, 5, 9, 0, 1]
console.log(quickSort(arr))