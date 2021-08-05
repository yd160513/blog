# 加粗的代表当时不详细说，放到后边说



demo

```typescript
createApp({
  setup() {
    const data = reactive({
      a: 1111
    })
    return {
      ...toRefs(data)
    }
  }
}).mount('#app')
```

# createApp 函数：

在 createApp 函数从渲染器中获取到 createApp 函数并调用得到 app

从 app 中取出 mount 函数

**重写 app 中的 mount 函数**

将 app return

# 重写的 mount 函数

根据调用外部调用 mount 传入的 参数来获取到一个 container， 如果活获取到的不是 container 则 return

从 app 中取出对应的 component，component 就是用户调用 createApp 函数时传入的对象。判断这个 component 上有没有 template 属性，如果没有 template 属性也没有 render 属性则将 container 中的 innerHTML 赋值给 component 上的 template

**然后调用前边从 app 中取出的 mount 函数** 并有一个返回值定义为 proxy

mount 函数的返回值就是这个 proxy

# app 中的 mount 函数

这个函数因为是 app 中的，所以被定义在了 **createAppAPI 函数** 中。

这个函数仅用来做初始化挂载，所以在 一开始就有了这个判断

```typescript
if (!isMounted) {
	// ...
}
```

所有的操作都是在这个判断中做的

首先是根据传入的根组件和根 props 调用 createVNode 函数创建一个 vnode，vnode 形式如下

```typescript
vnode: {
  anchor: null
  children: null
  appContext: null
  dirs: null
  component: null
  dynamicProps: null
  dynamicChildren: null
  key: null
  patchFlag: 0
  props: null
  ref: null
  scopeId: null
  shapeFlag: 4
  slotScopeIds: null
  ssContent: null
  ssFallback: null
  suspense: null
  target: null
  targetAnchor: null
  transition: null
  el: null
  type: rootComponent // 调用 createVNode 的时候传入的 rootComponent
  __v_isVNode: true
  __v_skip: true
}
```

然后将调用 createAppContext 函数生成的上下文赋值给 app 的 appContext 属性。

hydrate 函数是做 SSR 相关的，这里不做解释。

**接着就是下边调用了 render 函数**。 

> render 函数是在一开始调用 createApp 函数时在 baseCreateRenderer 函数中进行定义的。
>
> baseCreateRenderer 函数主要就是定了一堆函数。

然后将 isMounted 赋值为 true，执行到这一步的时候 DOM 就已经渲染完成了。

然后将 rootContainer 赋值给 app._container。

最后 return **vnode.component.proxy** ，这里的 vnode.component.proxy 是什么呢，后边来回答

# baseCreateRenderer 函数中定义的 render 函数

render 函数的第一个参数是 vnode，如果 vnode 不存在则走卸载 unmount 的逻辑，反之走**更新 patch 的逻辑**。

# 更新逻辑调用的 patch 函数

> 这个 patch 函数和 render 函数定义的位置是一样的，都是在 baseCreateRenderer 函数中

patch 函数接受新旧节点 n1 和 n2 还有 container 还有一些其它参数

先从 n2 中取出了 type ref 和 shapeFlag，因为 n2 是新节点。

因为我们在调用 createApp 的时候传入的是一个对象所以这里会调用 processComponent 函数来当作组件处理

# processComponent 函数

> 这个函数还是在 baseCreateRenderer 中定义的

因为是初始化过程，在这个方法里就只是调用了 mountComponent 函数

# mountComponent 函数

> 这个函数接收的 initialVNode 就是新的 vnode，对应上边也就是 n2

调用 createComponentInstance 函数创建和当先 vnode 相关的组件实例并赋值给 initialVNode.component 并赋值给局部变量 instance。

后边再调用 **setupComponent** 并传入 instance 来给 instance 加工

后边再调用 **setupRenderEffect** 函数来将渲染函数创建为响应式的

# setupComponent 函数

调用 initProps 函数来初始化 props 

调用 initSlots 函数初始化 slots

调用 **setupStatefulComponent** 函数并将结果 return

## setupStatefulComponent 函数

创建渲染代理属性访问缓存

```typescript
instance.accessCache = Object.create(null) // create render proxy property access cache
```

对 instance 上的 ctx 进行代理并赋值给 instance.proxy 

```typescript
instance.proxy = markRaw(new Proxy(instance.ctx, PublicInstanceProxyHandlers))
```

从当前组件实例中取出组件，然后从组件中取出 setup 函数。

调用 createSetupContext 函数根据 instance 获取 setup 上下文，然后将 intance 赋值给 currentInstance。

通过 callWithErrorHandling 函数来调用 setup 函数，并在调用的时候传入了实例上的 props 和 setupContext

清空 currentInstance 

然后 demo 中 setup 函数的返回值 setupResult 不是 promise，所以会调用 handleSetupResult 函数

### handleSetupResult 函数

函数接收 setupResult 参数，如果它是 function 则会将其作为渲染函数绑定到 instance.render 上

反之如果是 object 则会将其通过 proxyRefs 转为一个代理赋值给 instance.setupState

> proxyRefs 的作用就是把 setupResult 对象做一层代理
>
> 方便用户直接访问 ref 类型的值
>
> 比如 setupResult 里面有个 count 是个 ref 类型的对象，用户使用的时候就可以直接使用 count 了，而不需要在 count.value
>
> 这里也就是官网里面说到的自动解构 Ref 类型

#### finishComponentSetup 函数

这个函数接收 instance，如果 instance 上不存在 render 且 instance.type 上也没有 render 函数则通过编译器编译一个，如果 instance.type 上有的话则将其赋值到 instance.render 函数上

下边还做了对 2.x 版本 options API 的兼容

# setupRenderEffect 函数

> setupComponent 函数也是定义在 baseCreateRenderer 函数中的

函数作用是将渲染函数创建为响应式的

在这个函数中调用了 effect 函数传入了 componentEffect 函数也传入了 scheduler 调度器，这样 componentEffect 函数就会交给调度器去执行，调度器就是将 componentEffect 事件循环中执行。

最终 effect 的返回值会赋值给 instance.update

>组件初始化的时候会执行这里
>
>为什么要在这里调用 render 函数呢
>
>是因为在 effect 内调用 render 才能触发依赖收集
>
>等到后面响应式的值变更后会再次触发这个函数

在 componentEffect 函数中获取了当前实例的子节点树 subTree，然后递归调用 path 转换 subTree 为 node 来进行渲染。

后边将 subTree.el 赋值给 initialVNode.el

最后将 instance.isMounted 设置为 true 标识当前实例已挂载。

# 过程中产生的问题

- vnode.component.proxy 是什么

  是 vnode.component.ctx

instance.type 是在哪里赋值的

instance 代表是组件实例，那 instance.type 是什么

