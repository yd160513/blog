/**
 * 连续触发事件，但是在 N 秒内只会执行一次回调函数。可以总结为稀释回调函数的执行频率。
 */
function throttle(callback, wait) {
  // 采用闭包的形式，后续每次触发事件的时候访问的都是同一个变量。
  let timer = null
  return function () {
    // 只有定时器执行完一轮之后才可以继续启动定时器
    if (!timer) {
      timer = setTimeout(() => {
        // 再次触发的时候可以启动定时器
        timer = null
        callback()
      }, wait)
    }
  }
}

// 测试
let num = 1;
let content = document.getElementById('content');
function count() {
  content.innerHTML = num++;
};
content.onmousemove = throttle(count, 1000);