/**
 * 使用JS实现一个 repeat 方法 log 4次 hello world, 每次间隔3秒
 *    加大难度版：输出第几次helloworld
 */
 function repeat(num) {
  let count = 1
  function handle() {
    setTimeout(() => {
      if (count <= 4) {
        console.log(`第${count}次`)
        if (count === num) {
          console.log('hello world')
        }
        count++
        handle()
      }
    }, 500)
  }
  handle()
}
repeat(3)