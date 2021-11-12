/**
 * 将多维数组转换为一维数组
 * @param {Array} arr 多维数组
 * @returns 一维数组
 * 整体思路:
 *    1. 将二维数组降为一维数组可通过: Array.prototype.concat.apply([], targetArr)
 *    2. targetArr 就是被降维的数组
 *    3. 如果数组中还有数组则递归调用 1
 */
function flat(arr) {
  // arr 中是否有数组，如果有则递归调用 flat, 没有则说明 arr 是一个一维数组，直接将其 return 即可
  const hasArr = arr.some(item => item instanceof Array)
  // 不存在 array
  if (!hasArr) return arr
  // 存在 array 将其进行降维操作
  const res = Array.prototype.concat.apply([], arr)
  // 递归调用 flat
  return flat(res)
}

const arr1 = [1, 2, 3, [5, 6, 7, [8, 9, 0, 10, 11, [12, 13, 14, 15]]]]
console.log(flat(arr1))

/**
 * 为什么通过 Array.prototype.concat.apply([], arr) 可以将二维数组降维？
 *    1. apply 的第二个参数会被作为参数一次传入到 concat 中，相当于是将 arr 给解构了
 *        相当于 Array.prototype.concat.apply([], [1, 2, 3, [5, 6, 7]]) 会转换成 [].concat(1, 2, 3, [5, 6, 7])
 *    2. concat 它的参数如果是一个数组的话，它会将数组中的每一项作为参数放到 concat 的返回值中
 *        相当于 [].concat(1, 2, 3, [5, 6, 7]) 会转换成 [ 1, 2, 3, 5, 6, 7 ]
 *        对应到 MDN 中的解释: concat方法创建一个新的数组，它由被调用的对象中的元素组成，每个参数的顺序依次是该参数的元素（如果参数是数组）或参数本身（如果参数不是数组）。它不会递归到嵌套数组参数中。
 */
 const arr = [1, 2, 3, [5, 6, 7]]
 const arr2 = []
 console.log(Array.prototype.concat.apply(arr2, arr)) // [ 1, 2, 3, 5, 6, 7 ]
 console.log(arr2.concat(arr)) // [ 1, 2, 3, [ 5, 6, 7 ] ]
 console.log(arr2.concat(1, 2, 3, [5, 6, 7])) // [ 1, 2, 3, 5, 6, 7 ]

// 第二种解决方法 ------------------------------------------------------------------------------------------------------------------------
console.log(arr.toString().split(',').map(item => Number(item)))

// 第三种解决方法 ------------------------------------------------------------------------------------------------------------------------
console.log(JSON.stringify(arr).replace(/\[|\]/g, '').split(',').map(item => Number(item)))

// 第四种解决方法 ------------------------------------------------------------------------------------------------------------------------
// function flat(arr) {
//   const hasArr = arr.some(item => item instanceof Array)
//   if (!hasArr) return arr
//   const res = Array.prototype.concat.apply([], arr)
//   return flat(res)
// }
console.log('flat(arr1) =>', flat(arr1))

// 第五种解决方法 ------------------------------------------------------------------------------------------------------------------------
Array.prototype.myFlat = function() {
  const _this = this
  const result = []
  let maxDeep = 1 // 最大深度
  function _flat(arr, loop = 1) {
    if (loop > maxDeep) maxDeep = loop
    arr.forEach(item => {
      if (Array.isArray(item)) {
        _flat(item, loop + 1)
      } else {
        result.push(item)
      }
    })
  }
  _flat(_this)
  console.log(`最大深度为: `, maxDeep)
  return result
}
console.log('arr1.myFlat() =>', arr1.myFlat())
