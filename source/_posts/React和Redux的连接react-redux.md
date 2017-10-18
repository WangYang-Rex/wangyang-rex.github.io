---
title: React和Redux的连接react-redux
date: 2017-09-02 10:45:57
tags: [react, redux]
---

> 原文地址：[http://leozdgao.me/reacthe-reduxde-qiao-jie-react-redux/](http://leozdgao.me/reacthe-reduxde-qiao-jie-react-redux/)

Redux本身和React并没有之间的关联，它是一个通用Javscript App模块，用做App State的管理。要在React的项目中使用Redux，比较好的方式是借助react-redux这个库来做连接，这里的意思是，并不是没有react-redux，这两个库就不弄一起用了，而是说react-redux提供了一些封装，一种更科学的代码组织方式，让我们更舒服地在React的代码中使用Redux。

之前仅通过Redux文档来了解react-redux，在一段时间的实践后准备翻一翻源代码，顺便做些相关的总结。我看的代码的npm版本为`v4.0.0`，也就是说使用的React版本是`v0.14.x`。

react-redux提供两个关键模块：Provider和connect。

### Provider
Provider这个模块是作为整个App的容器，在你原有的App Container的基础上再包上一层，它的工作很简单，就是接受Redux的store作为props，并将其声明为context的属性之一，子组件可以在声明了`contextTypes`之后可以方便的通过`this.context.store`访问到store。不过我们的组件通常不需要这么做，将store放在context里，是为了给下面的connect用的。

这个是Provider的使用示例：
```js
// config app root
const history = createHistory()  
const root = (  
  <Provider store={store} key="provider">
    <Router history={history} routes={routes} />
  </Provider>
)

// render
ReactDOM.render(  
  root,
  document.getElementById('root')
)
```

### connect
这个模块是算是真正意义上连接了Redux和React，正好它的名字也叫connect。

先考虑Redux是怎么运作的：首先store中维护了一个state，我们dispatch一个action，接下来reducer根据这个action更新state。

映射到我们的React应用中，store中维护的state就是我们的app state，一个React组件作为View层，做两件事：render和响应用户操作。于是connect就是将store中的必要数据作为props传递给React组件来render，并包装action creator用于在响应用户操作时dispatch一个action。

好了，详细看看connect这个模块做了什么。先从它的使用来说，它的API如下：
```js
connect([mapStateToProps], [mapDispatchToProps], [mergeProps], [options])  
```
mapStateToProps是一个函数，返回值表示的是需要merge进props的state。默认值为`() => ({})`，即什么都不传。
```js
(state, props) => ({  }) // 通常会省略第二个参数
```
`mapDispatchToProps`是可以是一个函数，返回值表示的是需要`merge`仅`props`的`actionCreators`，这里的`actionCreator`应该是已经被包装了`dispatch`了的，推荐使用`redux`的`bindActionCreators`函数。

```js
(dispatch, props) => ({ // 通常会省略第二个参数
 ...bindActionCreators({
   ...ResourceActions
 }, dispatch)
})
```

更方便的是可以直接接受一个对象，此时`connect`函数内部会将其转变为函数，这个函数和上面那个例子是一模一样的。

`mergeProps`用于自定义`merge`流程，下面这个是默认流程，`parentProps`值的就是组件自身的`props`，可以发现如果组件的`props`上出现同名，会被覆盖。
```js
(stateProps, dispatchProps, parentProps) => ({
  ...parentProps,
  ...stateProps,
  ...dispatchProps
})
```
`options`共有两个开关：`pure`代表是否打开优化，详细内容下面会提，默认为`true`，`withRef`用来给包装在里面的组件一个`ref`，可以通过`getWrappedInstance`方法来获取这个`ref`，默认为`false`。

`connect`返回一个函数，它接受一个`React`组件的构造函数作为连接对象，最终返回连接好的组件构造函数。

然后几个问题：
- React组件如何响应store的变化？
- 为什么connect选择性的merge一些props，而不是直接将整个state传入？
- pure优化的是什么？

我们把`connect`返回的函数叫做`Connector`，它返回的是内部的一个叫`Connect`的组件，它在包装原有组件的基础上，还在内部监听了`Redux`的`store`的变化，为了让被它包装的组件可以响应`store`的变化:
```js
trySubscribe() {  
  if (shouldSubscribe && !this.unsubscribe) {
    this.unsubscribe = this.store.subscribe(::this.handleChange)
    this.handleChange()
  }
}

handleChange () {  
  this.setState({
    storeState: this.store.getState()
  })
}
```

但是通常，我们`connect`的是某个`Container`组件，它并不承载所有`App state`，然而我们的`handler`是响应所有`state`变化的，于是我们需要优化的是：当`storeState`变化的时候，仅在我们真正依赖那部分`state`变化时，才重新`render`相应的`React`组件，那么什么是我们真正依赖的部分？就是通过`mapStateToProps`和`mapDispatchToProps`得到的。

具体优化的方式就是在`shouldComponentUpdate`中做检查，如果只有在组件自身的`props`改变，或者`mapStateToProps`的结果改变，或者是`mapDispatchToProps`的结果改变时`shouldComponentUpdate`才会返回`true`，检查的方式是进行`shallowEqual`的比较。

所以对于某个reducer来说：
```js
export default (state = {}, action) => {  
  return { ...state } // 返回的是一个新的对象，可能会使组件reRender
  // return state // 可能不会使得组件reRender
}
```

另外在`connect`的时候，要谨慎`map`真正需要的`state`或者`actionCreators`到`props`中，以避免不必要的性能损失。

最后，根据`connect`的`API`我们发现可以使用`ES7 decorator`功能来配合`React ES6`的写法：
```js
@connect(
  state => ({
    user: state.user,
    resource: state.resource
  }),
  dispatch => ({
    ...bindActionCreators({
      loadResource: ResourceActions.load
    }, dispatch)
  })
)
export default class Main extends Component {

}
```
OK，结束了。