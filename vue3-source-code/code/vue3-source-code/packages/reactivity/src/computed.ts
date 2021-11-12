import { effect, ReactiveEffect, trigger, track } from './effect'
import { TriggerOpTypes, TrackOpTypes } from './operations'
import { Ref } from './ref'
import { isFunction, NOOP } from '@vue/shared'
import { ReactiveFlags, toRaw } from './reactive'

export interface ComputedRef<T = any> extends WritableComputedRef<T> {
  readonly value: T
}

export interface WritableComputedRef<T> extends Ref<T> {
  readonly effect: ReactiveEffect<T>
}

export type ComputedGetter<T> = (ctx?: any) => T
export type ComputedSetter<T> = (v: T) => void

export interface WritableComputedOptions<T> {
  get: ComputedGetter<T>
  set: ComputedSetter<T>
}

class ComputedRefImpl<T> {
  // 缓存计算的结果
  private _value!: T
  // 是否需要重新计算
  private _dirty = true

  public readonly effect: ReactiveEffect<T>

  public readonly __v_isRef = true;
  public readonly [ReactiveFlags.IS_READONLY]: boolean

  constructor(
    getter: ComputedGetter<T>,
    private readonly _setter: ComputedSetter<T>,
    isReadonly: boolean
  ) {
    /**
     * 这里传入的 lazy 为 true，则是惰性加载
     * 将 getter 进行封装，包装成为 reactiveEffect 函数
     */
    this.effect = effect(getter, {
      lazy: true,
      scheduler: () => {
        /**
         * 不需要重新计算时，
         * 加这个判断是为了解决一个问题：
         *  当在获取 computed.value 之前多次更改 computed 中依赖的值的时候，每次更改就会触发这里的 scheduler，
         *  第一次更改的时候就 this._dirty 为 false，会进入到判断中，将 this._dirty 赋值为 true 执行 trigger
         *  第二次更改的时候就不需要再次触发 trigger 了，因为设置 this._dirty 为 true 的原因就是为了能够在获取 computed.value 的时候再次触发 this.effect 求值
         *  所以当第一次更改值将 this._dirty 设置为 true，后续就不需要再重复设置这个值了，后边无论更改多少次都无所谓，后边再次获取 computed.value 的时候只要 self._dirty 为 true 就可以再次执行 this.effect 求值。
         */
        if (!this._dirty) {
          this._dirty = true
          /**
           * 这里是为了通知谁？
           *  这里是如果有依赖当前这个 computed 的就会去通知
           */
          trigger(toRaw(this), TriggerOpTypes.SET, 'value')
        }
      }
    })

    this[ReactiveFlags.IS_READONLY] = isReadonly
  }

  get value() {
    // the computed ref may get wrapped by other proxies e.g. readonly() #3376
    const self = toRaw(this)
    // 第一次计算完成之后会将 _dirty 置为 false，并将计算完成之后的值缓存至 _value，
    // 当计算属性内所依赖的属性没有发生变化的情况下再次获取计算属性的值时，_dirty 为 false，所以不会执行判断内的语句，而是直接 return 之前缓存的值
    if (self._dirty) {
      self._value = this.effect()
      self._dirty = false
    }
    // 收集当前 computed 的依赖，也就是谁依赖它
    track(self, TrackOpTypes.GET, 'value')
    return self._value
  }

  set value(newValue: T) {
    this._setter(newValue)
  }
}

export function computed<T>(getter: ComputedGetter<T>): ComputedRef<T>
export function computed<T>(
  options: WritableComputedOptions<T>
): WritableComputedRef<T>
export function computed<T>(
  getterOrOptions: ComputedGetter<T> | WritableComputedOptions<T>
) {
  let getter: ComputedGetter<T>
  let setter: ComputedSetter<T>

  /**
   * 调用 computed 的参数为函数
   * 如果是参数是函数的话，将不能进行 set
   */
  if (isFunction(getterOrOptions)) {
    getter = getterOrOptions
    setter = __DEV__
      ? () => {
          console.warn('Write operation failed: computed value is readonly')
        }
      : NOOP
  } 
  // 调用 computed 的参数为 handler
  else {
    getter = getterOrOptions.get
    setter = getterOrOptions.set
  }

  /**
   * 第三个参数为是否只读，function 类型和 handler 中没有 set，都是只读
   */
  return new ComputedRefImpl(
    getter,
    setter,
    isFunction(getterOrOptions) || !getterOrOptions.set
  ) as any
}
