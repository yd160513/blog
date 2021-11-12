const arr = [4, 5, 20, 90, 2, 33, 88, 0]

// 第四种实现方式
// 先将数组排序，然后取最大值和最小值
function getMax(arr) {
  function sortHandle(a, b) {
    return a - b
  }
  arr = arr.sort(sortHandle)
  return arr[arr.length - 1]
}
function getMin(arr) {
  function sortHandle(a, b) {
    return a - b
  }
  arr = arr.sort(sortHandle)
  return arr[0]
}
console.log(getMax(arr))
console.log(getMin(arr))

// 第三种实现方式: 利用 reduce()。
// reduce() 如果传入了第二个参数初始值，那么 callback 的第一个参数就是初始值，如果没有传，就是数组第一个，在后边遍历的时候它就是 callback 中计算后的返回值
// function getMax(arr) {
//   return arr.reduce((prevVal, currVal) => {
//     return prevVal > currVal ? prevVal : currVal
//   })
// }
// function getMin(arr) {
//   return arr.reduce((prevVal, currVal) => {
//     return prevVal > currVal ? currVal : prevVal
//   })
// }
// console.log(getMax(arr))
// console.log(getMin(arr))

// 第二种实现方式
// 利用 Math.max() 函数，改变其调用体
// Array.prototype.myMax = function() {
//   return Math.max.call(null, ...this)
// }
// Array.prototype.myMin = function() {
//   return Math.min.call(null, ...this)
// }
// console.log(arr.myMax())
// console.log(arr.myMin())

// 第一种实现方式
// function getMax(arr) {
//   let max = arr[0]
//   for (let index = 0; index < arr.length; index++) {
//     if (arr[index] > max) {
//       max = arr[index]
//     }
//   }
//   return max
// }
// function getMin(arr) {
//   let min = arr[0]
//   for (let index = 0; index < arr.length; index++) {
//     if (arr[index] < min) {
//       min = arr[index]
//     }
//   }
//   return min
// }
// console.log(getMax(arr))
// console.log(getMin(arr))

