/**
 * 插入排序
 * @param {array} list 无序数组
 * @returns list
 * 
 * 1. 第一轮循环，将索引为 1 的值缓存，这个位置相当于空出来了。后续再循环的时候缓存的值就是上一个缓存的索引 + 1。
 * 2. 将缓存的值和其左侧的值依次对比
 *  1. 左侧的值大于缓存的值则将左侧的值放到被缓存值得索引处，然后左侧的值得位置就空了出来，
 *  2. 如果左侧没有值了则结束循环并将缓存中的值插入到这个空位置，并结束循环
 *  3. 左侧的值小于缓存的值则保持数组顺序不变，并结束循环   
 * 3. 第一轮循环结束，重复 1 - 3。
 */
 function test(list) {
  // 遍历 list 控制一共要循环多少轮，也就是有多少个元素，因为是从数组中的第二个元素去和其左侧的比较，所以 i 的初始值为 1
  // 问: 这里的 i < list.length 为什么不能写成 list.length - 1
  // 答: 因为当写成 list.length - 1 就意味着最后一个元素是匹配不到的，但是这里最后一个元素是需要进行比较的。
  for (let i = 1; i < list.length; i++) {
    // 第一轮循环，将索引为 1 的值缓存，这个位置相当于空出来了。后续再循环的时候缓存的值就是上一个缓存的索引 + 1。
    const temp = list[i];
    // 从当前循环的这个元素开始向左挨个儿比对
    // 如果左边这个值小于缓存的那个值则退出循环，将其插入到当前索引的上一个索引下
    // 如果左侧没有值了，也就是比对到了第 0 个，则将其插入到当前索引下
    let index = i
    // list[index - 1] > temp 不可以作为 if 判断的条件放到 while 循环里边，否则 while 循环会陷入死循环
    while (index > 0 && list[index - 1] > temp) {
      // if (list[index - 1] > temp) {
        list[index] = list[index - 1]
        index--
      // }
    }
    // 如果左侧没有值了，也就是比对到了第 0 个(index === 0)。也就是所有大于 0 的都在 while 循环中做了，这里处理的是 index === 0 的时候，然后将缓存中的值插入到开头
    // 问: 这里为什么不能写成 list[i] = temp？
    //  解答1: 在这个方法中，执行到这里的条件就是 index === 0 || 左边那个元素没有缓存的那个值大，一个是要插入到数组的开头，一个是为了保持原有位置不动。
    //        因为 i 是当前比较的元素的索引，而 index 是比对之后的索引。在比对的过程中有可能 index 向左移动了好几次，缓存中的值插入的时候就不是 i 对应的位置了
    //  解答2: 这里赋值的时候其实处理了两种情况
    //        1. index 等于 0 的时候，将 temp 赋值到数组开头
    //        2. 当 while 循环的过程中不满足 list[index - 1] > temp 条件的时候，这个时候就需要将 temp 插入到 index 的位置，而不是 i 的位置，因为这个时候有可能 i 的位置已经被其他值占了。
    list[index] = temp
  }
  return list
}
const arr = [2, 8, 4, 5, 9, 0, 1]
console.log(test(arr))

// 
// 插入排序的第二种实现方。
// https://segmentfault.com/a/1190000015489767
// function insertSort(arr) {
//   let length = arr.length;
//   for(let i = 1; i < length; i++) {
//     let temp = arr[i];
//     let index = i
//     for(let j = i; j > 0; j--) {
//       if(temp >= arr[j-1]) {
//         break;
//       }
//       arr[j] = arr[j-1];
//       index--
//     }
//     arr[index] = temp;
//   }
//   return arr;
// }
// const arr = [2, 8, 4, 5, 9, 0, 1]
// console.log(insertSort(arr))
