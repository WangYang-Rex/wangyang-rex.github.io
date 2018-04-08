---
title: React框架精髓
date: 2018-04-08 14:19:28
tags: [react]
---
## React diff 算法
React的`diff`算法是`Virtual DOM`之所以任性的最大依仗，大家知道页面的性能 一般是由渲染速度和渲染次数决定，如何最大程度地利用`diff`算法进行开发？我们先看看它的原理。

### 传统 diff 算法
计算一棵树形结构转换成另一棵树形结构的最少操作，传统 `diff` 算法通过循环递归对节点进行依次对比，效率低下，算法复杂度达到 `O(n^3)`，其中 `n` 是树中节点的总数。也就是说如果要展示1000个节点，就要依次执行上十亿次的比较。这个性能消耗对对于前端项目来说是不可接受的。

### 核心算法
如上所见，传统 `diff` 算法的复杂度为 `O(n^3)`，显然这是无法满足性能要求的。而`React`通过制定大胆的策略，将 `O(n^3)` 复杂度的问题转换成 `O(n)` 复杂度的问题。他是怎么做到的？

### tree diff
Web UI 中 DOM 节点跨层级的移动操作特别少，可以忽略不计。React 对树的算法进行了简洁明了的优化，即对树进行分层比较，两棵树只会对同一层次的节点进行比较。如下图所示：

![](/images/page/react/2.png)

>React 通过 updateDepth 对 Virtual DOM 树进行层级控制，只会对相同颜色方框内的 DOM 节点进行比较，即同一个父节点下的所有子节点。当发现节点已经不存在，则该节点及其子节点会被完全删除掉，不会用于进一步的比较。这样只需要对树进行一次遍历，便能完成整个 DOM 树的比较。
```js
// tree diff算法实现
updateChildren: function(nextNestedChildrenElements, transaction, context) {
  updateDepth++;
  var errorThrown = true;
  try {
    this._updateChildren(nextNestedChildrenElements, transaction, context);
    errorThrown = false;
  } finally {
    updateDepth--;
    if (!updateDepth) {
      if (errorThrown) {
        clearQueue();
      } else {
        processQueue();
      }
    }
  }
}
```
### 为什么要减少DOM节点的跨层级操作？
如下图，A 节点（包括其子节点）整个被移动到 D 节点下，由于 React 只会简单的考虑同层级节点的位置变换，而对于不同层级的节点，只有创建和删除操作。当根节点发现子节点中 A 消失了，就会直接销毁 A；当 D 发现多了一个子节点 A，则会创建新的 A（包括子节点）作为其子节点。此时，`React diff` 的执行情况：create A -> create B -> create C -> delete A。

![](/images/page/react/3.png)

由此可发现，当出现节点跨层级移动时，并不会出现想象中的移动操作，而是以 A 为根节点的树被整个重新创建，这是一种影响 `React` 性能的操作。

### component diff
拥有相同类的两个组件将会生成相似的树形结构，拥有不同类的两个组件将会生成不同的树形结构。

- 如果是同一类型的组件，按照原策略继续比较 `virtual DOM tree`。
- 如果不是，则将该组件判断为 `dirty component`，从而替换整个组件下的所有子节点。
- 对于同一类型的组件，有可能其 `Virtual DOM` 没有任何变化，如果能够确切的知道这点那可以节省大量的 diff 运算时间，因此 `React` 允许用户通过 `shouldComponentUpdate()` 来判断该组件是否需要进行 diff。

![](/images/page/react/4.png)

如上图，当 `component D` 改变为 `component G` 时，即使这两个 `component` 结构相似，一旦 `React` 判断 D 和 G 是不同类型的组件，就不会比较二者的结构，而是直接删除 `component D`，重新创建 `component G` 以及其子节点。虽然当两个 `component` 是不同类型但结构相似时，`React diff` 会影响性能，但正如 `React` 官方博客所言：不同类型的 `component` 是很少存在相似 `DOM tree` 的机会，因此这种极端因素很难在实现开发过程中造成重大影响的。

### element diff
对于同一层级的一组子节点，它们可以通过唯一 id 进行区分。React 提出优化策略：允许开发者对同一层级的同组子节点，添加唯一 key 进行区分，虽然只是小小的改动，性能上却发生了翻天覆地的变化！

新老集合所包含的节点，如下图所示，新老集合进行 diff 差异化对比，通过 key 发现新老集合中的节点都是相同的节点，因此无需进行节点删除和创建，只需要将老集合中节点的位置进行移动，更新为新集合中节点的位置，此时 React 给出的 diff 结果为：B、D 不做任何操作，A、C 进行移动操作，即可。

![](/images/page/react/5.png)

### 开发建议
（1）<b>[基于tree diff]</b> 开发组件时，保持稳定的DOM结构有助于维持整体的性能。换而言之，尽可能少地动态操作DOM结构，尤其是移动操作。当节点数过大或者页面更新次数过多时，页面卡顿的现象比较明显。可以通过 CSS 隐藏或显示节点，而不是真的移除或添加 DOM 节点。

（2）<b>[基于component diff]</b> 开发组件时，注意使用 `shouldComponentUpdate()` 来减少组件不必要的更新。除此之外，对于类似的结构应该尽量封装成组件，既减少代码量，又能减少`component diff`的性能消耗。

（3）<b>[基于element diff]</b> 对于列表结构，尽量减少类似将最后一个节点移动到列表首部的操作，当节点数量过大或更新操作过于频繁时，在一定程度上会影响 React 的渲染性能。

## React Lifecycle
React的生命周期具体可分为四种情况：
![](/images/page/react/6.png)

- 当首次装载组件时，按顺序执行 `getDefaultProps`、`getInitialState`、`componentWillMount``、render` 和 `componentDidMount；`

- 当卸载组件时，执行 `componentWillUnmount`；

- 当重新装载组件时，此时按顺序执行 `getInitialState`、`componentWillMount``、render` 和 `componentDidMount`，但并不执行 `getDefaultProps`；

- 当再次渲染组件时，组件接受到更新状态，此时按顺序执行 `componentWillReceiveProps`、`shouldComponentUpdate`、`componentWillUpdate`、`render` 和 `componentDidUpdate`。

## React组件的3种状态
### 状态一：MOUNTING
`mountComponent` 负责管理生命周期中的 `getInitialState`、`componentWillMount``、render` 和 `componentDidMount`。
![](/images/page/react/7.png)

### 状态二：RECEIVE_PROPS
`updateComponent` 负责管理生命周期中的 `componentWillReceiveProps`、`shouldComponentUpdate`、`componentWillUpdate`、`render` 和 `componentDidUpdate`。
![](/images/page/react/8.png)

### 状态三：UNMOUNTING
`unmountComponent` 负责管理生命周期中的 `componentWillUnmount`。

首先将状态设置为 `UNMOUNTING`，若存在 `componentWillUnmount`，则执行；如果此时在 `componentWillUnmount` 中调用 `setState`，是不会触发 `reRender`。更新状态为 `NULL`，完成组件卸载操作。实现代码如下：
```js
// 卸载组件
unmountComponent: function() {
  // 设置状态为 UNMOUNTING
  this._compositeLifeCycleState = CompositeLifeCycle.UNMOUNTING;

  // 如果存在 componentWillUnmount，则触发
  if (this.componentWillUnmount) {
    this.componentWillUnmount();
  }

  // 更新状态为 null
  this._compositeLifeCycleState = null;
  this._renderedComponent.unmountComponent();
  this._renderedComponent = null;

  ReactComponent.Mixin.unmountComponent.call(this);
}
```

## React生命周期总结

![](/images/page/react/9.png)

![](/images/page/react/10.png)

## setState实现机制
`setState`是`React`框架的核心方法之一，下面介绍一下它的原理：
![](/images/page/react/11.png)
```js
// 更新 state
setState: function(partialState, callback) {
  // 合并 _pendingState
  this.replaceState(
    assign({}, this._pendingState || this.state, partialState),
    callback
  );
},
```
当调用 `setState` 时，会对 `state` 以及 `_pendingState` 更新队列进行合并操作，但其实真正更新 `state` 的幕后黑手是`replaceState`。

```js
// 更新 state
replaceState: function(completeState, callback) {
  validateLifeCycleOnReplaceState(this);

  // 更新队列
  this._pendingState = completeState;

  // 判断状态是否为 MOUNTING，如果不是，即可执行更新
  if (this._compositeLifeCycleState !== CompositeLifeCycle.MOUNTING) {
    ReactUpdates.enqueueUpdate(this, callback);
  }
},
```
`replaceState` 会先判断当前状态是否为 MOUNTING，如果不是即会调用 `ReactUpdates.enqueueUpdate` 执行更新。

当状态不为 `MOUNTING` 或 `RECEIVING_PROPS` `时，performUpdateIfNecessary` 会获取 `_pendingElement`、`_pendingState`、`_pendingForceUpdate`，并调用 `updateComponent` 进行组件更新。

```js
// 如果存在 _pendingElement、_pendingState、_pendingForceUpdate，则更新组件
performUpdateIfNecessary: function(transaction) {
  var compositeLifeCycleState = this._compositeLifeCycleState;

  // 当状态为 MOUNTING 或 RECEIVING_PROPS时，则不更新
  if (compositeLifeCycleState === CompositeLifeCycle.MOUNTING ||
      compositeLifeCycleState === CompositeLifeCycle.RECEIVING_PROPS) {
    return;
  }

  var prevElement = this._currentElement;
  var nextElement = prevElement;
  if (this._pendingElement != null) {
    nextElement = this._pendingElement;
    this._pendingElement = null;
  }

  // 调用 updateComponent
  this.updateComponent(
    transaction,
    prevElement,
    nextElement
  );
}
```

>如果在 `shouldComponentUpdate` 或 `componentWillUpdate` 中调用 `setState`，此时的状态已经从 `RECEIVING_PROPS -> NULL`，则 `performUpdateIfNecessary` 就会调用 `updateComponent` 进行组件更新，但 `updateComponent` 又会调用 `shouldComponentUpdate` 和 `componentWillUpdate`，因此造成循环调用，使得浏览器内存占满后崩溃。

### 开发建议
不建议在 `getDefaultProps`、`getInitialState`、`shouldComponentUpdate`、`componentWillUpdate`、`render` 和 `componentWillUnmount` 中调用 `setState`，特别注意：不能在 `shouldComponentUpdate` 和 `componentWillUpdate`中调用 `setState`，会导致循环调用。
