/**
 * 思路: 
 *    一定时间内事件被多次触发，只会在最后一次触发之后执行回调函数。
 *    事件触发 N 秒后执行回调函数，如果 N 秒内事件再次被触发则重新计算执行回调函数的时间。简单可理解为延时执行，最后一次事件触发后执行回调函数。
 */
function debounce(callback, wait) {
  // 采用闭包的形式，后续每次触发事件的时候访问的都是同一个变量。
  let timer = null
  return function () {
    // 一定时间内再次触发事件，将上一次启动的定时器清空(重新计算回调函数执行的时间)。
    if (timer) clearTimeout(timer)
    // 启动定时器，一定时间之后执行回调函数。
    timer = setTimeout(() => {
      callback()
    }, wait)
  }
}

function debounce (fn, wait) {
  let timer = null; //注意点1: 借助闭包
  return function (...args) {
    if(timer) clearTimeout(timer); // 注意点2: 清除定时器
    timer = setTimeout (() => {
      fn.apply(this, args) //注意点3: setTimout会发生this隐式丢失；改变this指向为调用debounce所指的对象。
    }, wait)
  }
}

// 测试
let num = 1;
let content = document.getElementById('content');
function count() {
  content.innerHTML = num++;
};

content.onmousemove = debounce(count, 500);
content.onmousemove = count
