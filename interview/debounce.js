
function debounce(fn, delay = 500) {
  let timer
  // 因为要拿到上一次的时间，所以采用闭包
  return () => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, arguments)
      timer = null
    }, delay)
  }
}