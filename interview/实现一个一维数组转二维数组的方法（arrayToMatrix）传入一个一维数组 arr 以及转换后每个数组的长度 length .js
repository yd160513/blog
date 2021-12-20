function arrayToMatrix(arr, len) {
  let index = 0
  const result = []
  while (arr.length) {
    const item = arr.shift()
    if (!result[index]) {
      result[index] = []
    } else if (result[index].length === len) {
      ++index
      result[index] = []
    }
    result[index].push(item)
  }
  return result
}

const result = arrayToMatrix([1, 2, 3, 4, 5, 6, 7, 8, 9], 2)
console.log(result)