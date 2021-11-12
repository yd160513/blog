const arr = [1, 1, 3, 4, 5, 6, 3, 2, 5, 5, 6, 6, 7, 9, 10]

// 3. 利用 reduce()
function test(arr) {
  const res = arr.reduce((prevVal, currVal) => {
    if (!prevVal.includes(currVal)) {
      prevVal.push(currVal)
    }
    return prevVal
  }, [])
  return res
}
console.log(test(arr))

// 2.
// function test(arr) {
//   const res = []
//   for (let index = 0; index < arr.length; index++) {
//     const item = arr[index];
//     if (!res.includes(item)) {
//       res.push(item)
//     }
//   }
//   return res
// }
// console.log(test(arr))

// 1. set()
// function test(arr) {
//   return Array.from(new Set(arr))
// }
// console.log(test(arr))