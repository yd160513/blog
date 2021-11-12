// 使用方式
jsonp({
  url: 'https://www.baidu.com/sugrec',
  params: {
    prod: 'pc',
    wd: 'children'
  },
  cb: 'getData'
}).then(res => {
  console.log('success =>', res)
})

function jsonp({ url, params, cb }) {
  return new Promise((resolve, reject) => {
    // 定义 callback
    window[cb] = function(data) {
      resolve(data)
    }
    // 获取参数
    const args = []
    for (const key in params) {
      if (Object.hasOwnProperty.call(params, key)) {
        args.push(`${key}=${params[key]}`)
      }
    }
    // 创建 script 标签
    const script = document.createElement('script')
    script.src = `${url}?${args.join('&')}&cb=${cb}`
    // 执行
    document.body.append(script)
  })
}