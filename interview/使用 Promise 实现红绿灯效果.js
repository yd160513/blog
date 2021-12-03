/**
 * 问题: 
 *    红灯 3 秒亮一次，黄灯 2 秒亮一次，绿灯 1 秒亮一次。
 *    如何让三个等不断交替重复亮灯。
 */

function red() {
  console.log('red')
}

function green() {
  console.log('green')
}

function yellow() {
  console.log('yellow')
}

/**
 * 亮灯处理程序
 * @param {function} callback 哪个灯亮
 */
function handle(callback, time) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      callback()
      resolve()
    }, time)
  })
}

function step() {
  /**
   * 这里可以改成 new Promise((resolve) => { resolve() }).then()
   */
  Promise.resolve().then(() => {
    return handle(red, 3000)
  }).then(() => {
    return handle(yellow, 2000)
  }).then(() => {
    return handle(green, 1000)
  })
  /**
   * 这里也可以改成 .then()
   */
  .finally(() => {
    return step()
  })
}
step()
