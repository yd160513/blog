// 第一版: 基础版
function deepClone(obj) {
  if (!obj || typeof obj !== 'object') return obj
  const result = Array.isArray(obj) ? [] : {}
  for (const key in obj) {
    if (Object.hasOwnProperty.call(obj, key)) {
      result[key] = typeof obj[key] === 'object' ? deepClone(obj[key]) : obj[key]
    }
  }
  return result
}

// 第二版: 解决了循环引用
// 这里的 map 是用来解决循环引用的，map 用来存放所有被处理过的对象，当再次循环一个已经被循环过的对象的时候，则直接将 map 中对应的对象 return 出去即可。
function deepClone(obj, map = new Map()) {
  if (!obj || typeof obj !== 'object') return obj
  // 如果 map 中可以获取到对象，则说明之前处理过，则直接 return map 中的对象。这样可以解决循环引用的问题
  // 不可以将 return map.get(obj) 改为 return obj，因为在向 map 中存的时候是一个全新的对象，如果这里使用了 obj，这样就成了和原始对象引用的是同一个对象了
  if (map.get(obj)) return map.get(obj)
  const result = Array.isArray(obj) ? [] : {}
  // 将新的对象存到 map 中，key 是原始对象，存起来的这个对象是一个全新的，不可以将原始对象存储到 map 中，否则在后边用的时候还是和原始对象是同一个引用。
  map.set(obj, result)
  for (const key in obj) {
    if (Object.hasOwnProperty.call(obj, key)) {
      result[key] = typeof obj[key] === 'object' ? deepClone(obj[key], map) : obj[key]
    }
  }
  return result
}

const deepCloneObj = {
  a: 1,
  b: 2,
  c: {
    q: 1,
    w: 2,
    e: 3,
    r: [1, 2, 3]
  }
}

// 循环引用
deepCloneObj.c = deepCloneObj

const deepCloneRes = deepClone(deepCloneObj)
console.log('deepClone(deepCloneObj) =>', deepCloneRes)
deepCloneRes.a = 123
console.log('deepClone(deepCloneObj) =>', deepCloneRes)
console.log('deepCloneObj =>', deepCloneObj)

// 支持多种类型的深拷贝
const obj = {
  married: true,
  age: 10,
  name: '张三',
  girlFriend: null,
  boyFriend: undefined,
  flag: Symbol('man'),
  home: {
    name: '北京'
  },
  set: new Set(),
  map: new Map(),
  getName: function () { },
  hobbies: ['1', '2', '3'],
  error: new Error('error info'),
  pattern: /^reg$/,
  math: Math,
  json: JSON,
  // document: document,
  // window: window
}

obj.set.add(1)
obj.map.set('name', '张三')
obj.obj = obj

// 1. 获取数据类型
const getType = (source) => {
  return Object.prototype.toString.call(source)
}

/**
 * 2. 对数据类型进行分类
 * [ '[object Object]', '[object Array]', '[object Map]', '[object Set]', '[object Error]', '[object Date]', '[object RegExp]' ]
 */
const OBJECT_TYPES = [{}, [], new Map(), new Set(), new Error(), new Date(), /^$/].map(item => getType(item))

// 在这些类型中还有一些特殊的类型
const MAP_TYPE = getType(new Map())
const SET_TYPE = getType(new Set())
const SYMBOL_TYPE = getType(Symbol('1'))
const REGEXP_TYPE = getType(/^$/)
// 使用的时候需要 new 的
const CONSTRUCT_TYPES = [new Error(), new Date()].map(item => getType(item))

/**
 * 深拷贝
 * @param {any} source 被克隆的对象
 * @param {Map} _map 用来解决循环引用
 */
function clone(source, _map = new Map) {
  /**
   * 1. 获取 source 的类型
   *    如果不是引用类型则说明是基本类型， 直接将 source return
   */
  const type = getType(source)
  if (!OBJECT_TYPES.includes(type)) {
    return source
  }

  /**
   * 2. 解决循环引用的。
   *    1. 如果 source 的某一个 value 是一个对象的话， 则将这个对象进行深拷贝处理， 并将深拷贝之后的对象放到 _map 中， _map 的 key 就是原始对象(source)。
   *    2. 经过 1 的处理，如果 source 中的 value 是一个对象， 则可以先在 _map 中找一下，如果找到则直接返回(返回的是深拷贝之后的对象，不是原始对象。在 1 中存的就是深拷贝之后的)。
   */
  if (_map.get(source)) {
    return _map.get(source)
  }

  // 3. 如果是 new 出来的实例， 则根据这个实例创建一个新的实例
  if (CONSTRUCT_TYPES.includes(type)) {
    /**
     * source.constructor 获取到 source 实例的构造函数， 将 source 传进去是为了 new 一个和 source 一样的新的实例
     * new Date(oldDate);
     * new Error(oldError)
     */
    return new source.constructor(source)
  }

  // 4. 根据 source 的类型创建一个新的实例，这个 target 就是我们最终深拷贝之后要返回的对象
  const target = new source.constructor()
  // 5. 将 target 放到 _map 中， 也就是解决循环引用中的第 1 步。 这个 target 就是深拷贝之后的对象，拷贝之后的数据都会放到 target 中。
  _map.set(source, target)

  // 6. 如果是一个 symbol 类型的数据
  if (SYMBOL_TYPE === type) {
    /**
     * Symbol.prototype.valueOf.call(): 获取 source 的原始值，
     * 将原始值通过 Object() 转成一个对象之后 return。
     * eg:
     *  const sy = Symbol('a')
     *  const _sy = Symbol.prototype.valueOf.call(sy) // 获取 sy 的原始值
     *  sy === _sy // true
     *  // 因为 sy === _sy，但是由于是深拷贝，所以这样是不可以的。所以需要通过 Object() 创建一个新的 Symbol
     *  Object(_sy)
     *  // sy !== Object(_sy) // true
     */
    return Object(Symbol.prototype.valueOf.call(source))
  }

  // 6. 如果是正则
  if (REGEXP_TYPE === type) {
    /**
     * eg: 
     *  const reg = /\.jpg$/gi; // 模拟正则表达式
     *  const flags = /\w*$/; // 获取正则表达式中的 flag，对应到上边的正则就是 g 和 i
     *  reg.source // 得到的时候正则表达式中的内容，也就是两个 / 中的内容，对应到上边的正则就是 \.jpg$
     *  flags.exec(source); // 获取 source 中的 flag。也就是 g 和 i
     * 这里的 new source.constructor 等于 new RegExp(), 因为上边已经判断过了，只有正则才会进入到这里。
     */
    const flags = /\w*$/
    // 不可以直接 return，因为这个正则有可能被执行过了
    // return new RegExp(source.source, flags.exec(source))
    // 所以要重置 lastIndex
    const target = new RegExp(source.source, flags.exec(source))
    target.lastIndex = source.lastIndex
    return target
  }

  /**
   * 7. 如果是 set 类型: Set [ 1 ]
   *    遍历这个 set 进行深度克隆，将返回的结果添加到前边定义好的 target 中
   */
  if (SET_TYPE === type) {
    source.forEach(value => target.add(clone(value, _map)))
    return target
  }

  /**
   * 7. 如果是 map 类型: Map { 'name': '张三' }
   *    遍历这个 map 进行深度克隆，将返回的结果添加到前边定义好的 target 中
   */
  if (SET_TYPE === type) {
    for (const key in source) {
      if (Object.hasOwnProperty.call(source, key)) {
        const value = source[key];
        target.set(key, clone(value, _map))
      }
    }
    return target
  }

  // 8. 剩下的就是普通的引用类型了
  for (const key in source) {
    if (Object.hasOwnProperty.call(source, key)) {
      const element = source[key];
      target[key] = clone(element, _map)
    }
  }
  return target
}

const obj2 = clone(obj)
console.log(obj2)
