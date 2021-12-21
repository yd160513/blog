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
  return new Promise((resolve, reject) => {
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

/**
 * 第一种实现方式: 通过 for 循环实现。 
 */
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
         * 针对有错误的时候的方案: 
         *  1. 整体逻辑是进入无线重试，弊端就是会阻塞后边的代码执行。
         *  2. 解决无限重试的弊端: 有错就 return reject()。
         *  3. 最优解: 重试几次之后再向外抛出。
         */
        // 解决无限重试的弊端: 有错就 return reject()
        return reject(err)

        // /**
        //  * 整体逻辑是进入无线重试，弊端就是会阻塞后边的代码执行。
        //  */
        // console.log(err)
        // // 1. 接口失败之后也将请求中的接口 -1
        // --count
        // // 2. 将失败的接口再次 push 到 apiList 中
        // apiList.push(api)
        // // 3. 接口列表中还有待请求的接口时则如果还没有到最大并发的限制，则发起新的请求。
        // if (apiList.length && count <= limit) {
        //   handle()
        // }
      })
    }

    // 一直都按最高并发走
    for (let index = 0; index < limit; index++) {
      handle()
    }

  })
}

/**
 * 第二种实现方式: 通过 Promise.all() 实现。
 */
function requestLimit(apiList, limit) {
  // 对 apiList 进行浅拷贝，避免后续的 shift() 对原始数据造成影响。
  const list = [...apiList]
  // 用来存放所有 api 的请求结果。因为哪个接口先完成是不固定的，所以这里存放的其实是一个无序的。
  const map = new Map()
  // 处理器
  const handle = () => {
    if (list.length) {
      // 从列表中取出一个。
      const api = list.shift()
      return request(api).then(res => {
        // 将每个接口的结果以 api 为 key 存到 map 中。
        map.set(api, res)
        /**
         * 递归调用
         * 这里隐式的进行了并发限制: 因为是在接口请求完成后(then() 方法)后进行的递归调用，也就是只有当一个请求完成了才会进行下一次请求。
         */
        return handle()
      })
    }
  }

  /**
   * Array(number): 创建一定长度的数组。
   * Math.min(): 接收 N 个参数，返回所有参数中最小值。
   * Array.fill(): 用传入的参数来填充数组。
   */
  // Promise list 中每个 promise 的 then 的 callback 都是 handle 函数。
  const promiseList = Array(Math.min(apiList.length, limit)).fill(Promise.resolve()).map(promise => promise.then(handle))

  return Promise.all(promiseList).then(res => {
    // map 中存放是无序的，这里通过 apiList 来生成一个有序的 list。
    const result = apiList.map(api => map.get(api))
    return result
  })
}

// 测试
requestLimit(apiList, 3).then(res => {
  console.log('调用方收到的结果: ', res)
}).catch(err => {
  console.log('请求失败!', err)
})
