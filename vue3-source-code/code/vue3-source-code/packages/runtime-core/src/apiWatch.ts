import {
  effect,
  stop,
  isRef,
  Ref,
  ComputedRef,
  ReactiveEffectOptions,
  isReactive,
  ReactiveFlags
} from '@vue/reactivity'
import { SchedulerJob, queuePreFlushCb } from './scheduler'
import {
  EMPTY_OBJ,
  isObject,
  isArray,
  isFunction,
  isString,
  hasChanged,
  NOOP,
  remove,
  isMap,
  isSet,
  isPlainObject
} from '@vue/shared'
import {
  currentInstance,
  ComponentInternalInstance,
  isInSSRComponentSetup,
  recordInstanceBoundEffect
} from './component'
import {
  ErrorCodes,
  callWithErrorHandling,
  callWithAsyncErrorHandling
} from './errorHandling'
import { queuePostRenderEffect } from './renderer'
import { warn } from './warning'
import { DeprecationTypes } from './compat/compatConfig'
import { checkCompatEnabled, isCompatEnabled } from './compat/compatConfig'
import { ObjectWatchOptionItem } from './componentOptions'

export type WatchEffect = (onInvalidate: InvalidateCbRegistrator) => void

export type WatchSource<T = any> = Ref<T> | ComputedRef<T> | (() => T)

export type WatchCallback<V = any, OV = any> = (
  value: V,
  oldValue: OV,
  onInvalidate: InvalidateCbRegistrator
) => any

type MapSources<T, Immediate> = {
  [K in keyof T]: T[K] extends WatchSource<infer V>
    ? Immediate extends true ? (V | undefined) : V
    : T[K] extends object
      ? Immediate extends true ? (T[K] | undefined) : T[K]
      : never
}

type InvalidateCbRegistrator = (cb: () => void) => void

export interface WatchOptionsBase {
  flush?: 'pre' | 'post' | 'sync'
  onTrack?: ReactiveEffectOptions['onTrack']
  onTrigger?: ReactiveEffectOptions['onTrigger']
}

export interface WatchOptions<Immediate = boolean> extends WatchOptionsBase {
  immediate?: Immediate
  deep?: boolean
}

export type WatchStopHandle = () => void

// Simple effect.
export function watchEffect(
  effect: WatchEffect,
  options?: WatchOptionsBase
): WatchStopHandle {
  return doWatch(effect, null, options)
}

// initial value for watchers to trigger on undefined initial values
const INITIAL_WATCHER_VALUE = {}

type MultiWatchSources = (WatchSource<unknown> | object)[]

// overload: array of multiple sources + cb
export function watch<
  T extends MultiWatchSources,
  Immediate extends Readonly<boolean> = false
>(
  sources: [...T],
  cb: WatchCallback<MapSources<T, false>, MapSources<T, Immediate>>,
  options?: WatchOptions<Immediate>
): WatchStopHandle

// overload: multiple sources w/ `as const`
// watch([foo, bar] as const, () => {})
// somehow [...T] breaks when the type is readonly
export function watch<
  T extends Readonly<MultiWatchSources>,
  Immediate extends Readonly<boolean> = false
>(
  source: T,
  cb: WatchCallback<MapSources<T, false>, MapSources<T, Immediate>>,
  options?: WatchOptions<Immediate>
): WatchStopHandle

// overload: single source + cb
export function watch<T, Immediate extends Readonly<boolean> = false>(
  source: WatchSource<T>,
  cb: WatchCallback<T, Immediate extends true ? (T | undefined) : T>,
  options?: WatchOptions<Immediate>
): WatchStopHandle

// overload: watching reactive object w/ cb
export function watch<
  T extends object,
  Immediate extends Readonly<boolean> = false
>(
  source: T,
  cb: WatchCallback<T, Immediate extends true ? (T | undefined) : T>,
  options?: WatchOptions<Immediate>
): WatchStopHandle

// implementation
export function watch<T = any, Immediate extends Readonly<boolean> = false>(
  source: T | WatchSource<T>,
  cb: any,
  options?: WatchOptions<Immediate>
): WatchStopHandle {
  if (__DEV__ && !isFunction(cb)) {
    warn(
      `\`watch(fn, options?)\` signature has been moved to a separate API. ` +
        `Use \`watchEffect(fn, options?)\` instead. \`watch\` now only ` +
        `supports \`watch(source, cb, options?) signature.`
    )
  }
  return doWatch(source as any, cb, options)
}

function doWatch(
  source: WatchSource | WatchSource[] | WatchEffect | object,
  cb: WatchCallback | null,
  { immediate, deep, flush, onTrack, onTrigger }: WatchOptions = EMPTY_OBJ,
  instance = currentInstance
): WatchStopHandle {
  // 警告处理
  if (__DEV__ && !cb) {
    if (immediate !== undefined) {
      warn(
        `watch() "immediate" option is only respected when using the ` +
          `watch(source, callback, options?) signature.`
      )
    }
    if (deep !== undefined) {
      warn(
        `watch() "deep" option is only respected when using the ` +
          `watch(source, callback, options?) signature.`
      )
    }
  }

  const warnInvalidSource = (s: unknown) => {
    warn(
      `Invalid watch source: `,
      s,
      `A watch source can only be a getter/effect function, a ref, ` +
        `a reactive object, or an array of these types.`
    )
  }

  let getter: () => any
  let forceTrigger = false
  let isMultiSource = false
debugger
  // 由 watch 调用
  if (isRef(source)) {
    /**
     * const refVal = ref(0)
     * watch(ref, (newVal, oldVal) => {}, {})
     */
    getter = () => source.value
    forceTrigger = !!source._shallow
  } 
  // 由 watch 调用
  else if (isReactive(source)) {
    /**
     * const data = reactive({
     *  a: 1
     * })
     * watch(data, (newVal, oldVal) => {}, {})
     */
    getter = () => source
    deep = true
  } 
  // 由 watch 调用
  else if (isArray(source)) {
    /**
     * const refVal = ref(0)
     * const data = reactive({})
     * const fun = () => 0
     * const arr = [
     *  refVal,
     *  data,
     *  fun
     * ]
     */
    isMultiSource = true
    forceTrigger = source.some(isReactive)
    // 求值
    getter = () =>
      source.map(s => {
        if (isRef(s)) {
          // 对 ref 求值
          return s.value
        } else if (isReactive(s)) {
          // 对 reactive 对象求值
          return traverse(s)
        } else if (isFunction(s)) {
          // 调用传入的函数，并对该函数有异常处理。
          return callWithErrorHandling(s, instance, ErrorCodes.WATCH_GETTER)
        } else {
          __DEV__ && warnInvalidSource(s)
        }
      })
  } else if (isFunction(source)) {
    // 由 watch 调用
    if (cb) {
      /**
       *  求值
       * const data = reactive({
       *  a: 1
       * })
       * watch(() => data.a, () => {}, {})
       */
      // getter with cb
      getter = () =>
        callWithErrorHandling(source, instance, ErrorCodes.WATCH_GETTER)
    } 
    // 由 watchEffect 调用
    else {
      /**
       * 求值
       * watchEffect(() => {
       *  // ...
       * })
       */
      // no cb -> simple effect
      getter = () => {
        // 当前组件内部实例被卸载时 return
        if (instance && instance.isUnmounted) {
          return
        }
        // 清除 effect 的依赖
        if (cleanup) {
          cleanup()
        }
        // 这里传入的 callWithAsyncErrorHandling 的第四个参数，所以在调用 watchEffect 时传入的函数中会有一个参数 => onInvalidate
        return callWithAsyncErrorHandling(
          source,
          instance,
          ErrorCodes.WATCH_CALLBACK,
          [onInvalidate]
        )
      }
    }
  } 
  // 上边的情况都不属于说明使用方式有错
  else {
    getter = NOOP
    __DEV__ && warnInvalidSource(source)
  }

  // 对 2.x 版本数组的兼容
  // 2.x array mutation watch compat
  if (__COMPAT__ && cb && !deep) {
    // 暂存 getter 方法
    const baseGetter = getter
    // 重写
    getter = () => {
      // 执行暂存的 getter 方法
      const val = baseGetter()
      if (
        isArray(val) &&
        checkCompatEnabled(DeprecationTypes.WATCH_ARRAY, instance)
      ) {
        traverse(val)
      }
      return val
    }
  }

  // 由 watch 调用并且 deep 属性为 true，进行深度监听。
  if (cb && deep) {
    const baseGetter = getter
    getter = () => traverse(baseGetter())
  }

  let cleanup: () => void
  let onInvalidate: InvalidateCbRegistrator = (fn: () => void) => {
    // 在 effect 上的 onStop 方法上注册 fn 并将 onStop 函数赋值给 cleanup ，这样在调用 cleanup 的时候也就可以调用 fn 了
    cleanup = runner.options.onStop = () => {
      // 这里会调用 fn
      callWithErrorHandling(fn, instance, ErrorCodes.WATCH_CLEANUP)
    }
  }

  // 服务端渲染的处理
  // in SSR there is no need to setup an actual effect, and it should be noop
  // unless it's eager
  if (__NODE_JS__ && isInSSRComponentSetup) {
    // we will also not call the invalidate callback (+ runner is not set up)
    onInvalidate = NOOP
    // 由 watchEffect 调用
    if (!cb) {
      getter()
    }
    // 由 watch 调用并且 immediate 为 ture 则立刻调用 callback 并 return
    else if (immediate) {
      callWithAsyncErrorHandling(cb, instance, ErrorCodes.WATCH_CALLBACK, [
        getter(),
        undefined,
        onInvalidate
      ])
    }
    return NOOP
  }

  let oldValue = isMultiSource ? [] : INITIAL_WATCHER_VALUE
  // 对 watch 调用的，则执行 cb
  // 对 watchEffect 则执行 effect
  const job: SchedulerJob = () => {
    if (!runner.active) {
      return
    }

    /**
     * 由 watch 调用
     * watch(source, cb)
     */
    if (cb) {
      // 获取 newValue
      const newValue = runner()
      // 如果 newValue 和 oldValue 有变化
      if (
        deep ||
        forceTrigger ||
        (isMultiSource
          ? (newValue as any[]).some((v, i) =>
              hasChanged(v, (oldValue as any[])[i])
            )
          : hasChanged(newValue, oldValue)) ||
        (__COMPAT__ &&
          isArray(newValue) &&
          isCompatEnabled(DeprecationTypes.WATCH_ARRAY, instance))
      ) {
        // cleanup before running cb again
        if (cleanup) {
          cleanup()
        }
        // 将第四个参数传入 cb 并调用
        callWithAsyncErrorHandling(cb, instance, ErrorCodes.WATCH_CALLBACK, [
          newValue,
          // pass undefined as the old value when it's changed for the first time
          oldValue === INITIAL_WATCHER_VALUE ? undefined : oldValue,
          onInvalidate
        ])
        // 上边已经调用过了，这次的 newValue 赋值给 oldValue 以便下次做比对
        oldValue = newValue
      }
    } 
    // watchEffect
    else {
      // 对于 watchEffect 直接调用传入的函数
      runner()
    }
  }

  /**
   * important: mark the job as a watcher callback so that scheduler knows it is allowed to self-trigger (#1727)
   * 允许递归调用 => 允许 watch 的 callback 中修改正在监听的值，使当前这个 watch 可以监听到正在监听的这个值被改变了
   * const num = ref(0)
   * watch(num, (newVal, oldVal) => {
   *  if (newVal < 10) {
   *    num.value = newVal + 1
   *  }
   * })
   */
  job.allowRecurse = !!cb

  /**
   * 调度器，当 effect 被 trigger 触发的时候，会判断有没有调度器，如果有就不会直接调用 effect 本身，而是调用这个调度器
   * 根据 flush 来判断更新时机：
   *  sync: 同步调用
   *  pre、post: 异步调用，将 job 放到微任务队列中，调用时机交给事件循环
   * 但是 instance 存在但是还没有挂载，这个时候需要直接执行 job
   * 这里的 job 就是根据是 watch 调用还是 watchEffect 调用来执行对应操作
   */
  let scheduler: ReactiveEffectOptions['scheduler']
  // 同步直接 job
  if (flush === 'sync') {
    scheduler = job as any // the scheduler function gets called directly
  } else if (flush === 'post') {
    scheduler = () => queuePostRenderEffect(job, instance && instance.suspense)
  } else {
    // default: 'pre'
    scheduler = () => {
      if (!instance || instance.isMounted) {
        queuePreFlushCb(job)
      } else {
        // with 'pre' option, the first call must happen before
        // the component is mounted so it is called synchronously.
        // instance 存在但是实例还没有挂载，这个时候需要直接执行 job
        job()
      }
    }
  }

  // runner 中包含调度器，调度器中有 job 方法，job 方法中处理了 watch 和 watchEffect 两种传入不同参数的调用。
  const runner = effect(getter, {
    lazy: true,
    onTrack,
    onTrigger,
    scheduler
  })

  // 将当前的 effect 和当前组件实例绑定，以便在销毁组件的时候销毁这些 effect
  recordInstanceBoundEffect(runner, instance)

  // initial run
  if (cb) {
    // watch 默认是惰性的，所以如果用户传入 immediate 为 true 则会立即调用 job
    if (immediate) {
      job()
    } 
    // 反之收集依赖， runner 的返回值赋值给 oldValue 以便后期新值和旧值做比对
    else {
      oldValue = runner()
    }
  } 
  // 不是 watch 且 flush 为 post 则将 effect 放在事件循环中，等待下一个 tick 去执行
  else if (flush === 'post') {
    queuePostRenderEffect(runner, instance && instance.suspense)
  } 
  // 默认直接执行 effect
  else {
    runner()
  }

  // watchEffect 会返回一个函数去停止当前这个 watchEffect
  return () => {
    stop(runner) // 停止当前 effect 的响应
    if (instance) {
      // 删除当前组件实例上 effects 中的当前 effect
      remove(instance.effects!, runner)
    }
  }
}

// this.$watch
export function instanceWatch(
  this: ComponentInternalInstance,
  source: string | Function,
  value: WatchCallback | ObjectWatchOptionItem,
  options?: WatchOptions
): WatchStopHandle {
  const publicThis = this.proxy as any
  const getter = isString(source)
    ? source.includes('.')
      ? createPathGetter(publicThis, source)
      : () => publicThis[source]
    : source.bind(publicThis, publicThis)
  let cb
  if (isFunction(value)) {
    cb = value
  } else {
    cb = value.handler as Function
    options = value
  }
  return doWatch(getter, cb.bind(publicThis), options, this)
}

export function createPathGetter(ctx: any, path: string) {
  const segments = path.split('.')
  return () => {
    let cur = ctx
    for (let i = 0; i < segments.length && cur; i++) {
      cur = cur[segments[i]]
    }
    return cur
  }
}

/**
 * 对 value 求值
 * @param value 被求值对象
 * @param seen 将 value add 到 seen 中
 * @returns 
 */
function traverse(value: unknown, seen: Set<unknown> = new Set()) {
  if (
    !isObject(value) ||
    seen.has(value) ||
    (value as any)[ReactiveFlags.SKIP]
  ) {
    return value
  }
  seen.add(value)
  if (isRef(value)) {
    traverse(value.value, seen)
  } else if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      traverse(value[i], seen)
    }
  } else if (isSet(value) || isMap(value)) {
    value.forEach((v: any) => {
      traverse(v, seen)
    })
  } else if (isPlainObject(value)) {
    for (const key in value) {
      traverse((value as any)[key], seen)
    }
  }
  return value
}
