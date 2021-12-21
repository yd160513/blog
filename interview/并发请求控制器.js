// 参考链接: https://blog.csdn.net/guizi0809/article/details/117227693

// api接口请求列表
const apiList = [
  'url___A',
  'url___B',
  'url___C',
  'url___D',
  'url___E',
  'url___F',
  'url___G',
]

// 模拟请求数据
const request = api => {
  console.log(`${api} 请求start`)

  // 请求时间 0 ~ 3 秒
  const wait = Math.random() * 3000

  return new Promise(resolve => {
    setTimeout(() => {
      // reject(`${api} 请求结束，可以进行下一次请求`)
      resolve(`${api} 请求结束，可以进行下一次请求`)
    }, wait)
  })
}

// 未做并发控制
// for (let index = 0; index < apiList.length; index++) {
//   const api = apiList[index];
//   request(api)
// }

// 并发请求控制器
function requestLimit(apiList, limit) {
  // 记录请求中的接口数量
  let count = 0
  return new Promise((resolve, reject) => {
    const handle = () => {
      const api = apiList.shift()
      // 请求中的接口 +1
      ++count
      request(api).then(res => {
        console.log(res)
        // 请求中的接口 -1
        --count

        /**
         * 整体流程
         * 1. 当有接口请求完成之后，接口列表中还有待请求的接口时则如果还没有到最大并发的限制，则发起新的请求。
         * 2. 如果没有接口需要请求了，则将最终结果返回
         */
        // 1. 当有接口请求完成之后，接口列表中还有待请求的接口时则如果还没有到最大并发的限制，则发起新的请求。
        if (apiList.length && count <= limit) {
          handle()
        }
        /**
         * 2. 如果没有接口需要请求了，则将最终结果返回
         *    这个时候不能单纯的通过 apiList 中是否还有数据来判断，因为有可能请求发起了，但是响应还没有回来，这个时候虽然它是空的，但其实并不是所有的接口都请求完成了。
         *    所有需要增加一个变量(count)来判断所有的请求是否全部请求完成，也就是记录一下正在请求中的接口数量。
         *    发起请求的时候 count +1，请求结束的时候 count -1, 当 apiList 中没有数据且 count 为 0 的时候则说明所有接口都请求完成了。
         */
        if (!apiList.length && !count) {
          resolve('所有接口请求完毕!')
        }
      }).catch(err => {
        /**
         * 整体逻辑是进入无线重试，弊端就是会阻塞后边的代码执行。
         */
        console.log(err)
        // 1. 接口失败之后也将请求中的接口 -1
        --count
        // 2. 将失败的接口再次 push 到 apiList 中
        apiList.push(api)
        // 3. 接口列表中还有待请求的接口时则如果还没有到最大并发的限制，则发起新的请求。
        if (apiList.length && count <= limit) {
          handle()
        }
      })
    }

    // 一直都按最高并发走
    for (let index = 0; index < limit; index++) {
      handle()
    }

  })
}

// 测试
requestLimit(apiList, 3).then(res => {
  console.log(res)
})
