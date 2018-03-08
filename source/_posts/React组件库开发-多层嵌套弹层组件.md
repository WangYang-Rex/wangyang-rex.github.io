---
title: 'React组件库开发:多层嵌套弹层组件'
date: 2018-03-08 14:52:00
tags: [react]
---

### 引言
UI 组件中有很多弹出式组件，常见的如 `Dialog`，`Tooltip` 以及 `Select` 等。这些组件都有一个特点，它们的弹出层通常不是渲染在当前的 `DOM` 树中，而是直接插入在 `body` （或者其它类似的地方）上的。这么做的主要目的是方便控制这些弹出层的 `z-index` ，确保它们能够处于合适的层级上，不至于被遮挡。

我们都知道 React App 的顶层某个地方肯定有这么一行代码：`ReactDOM.render(<App />, mountNode)`，这个 API 调用的作用是在 `mountNode` 的位置创建一棵 React 的渲染树，React 会接管 `mountNode` 开始的这棵 DOM 树。

在 React 的这种管理模式下，会发现使用弹层似乎不太方便，因为组件树是逐层往下生长的，但React 的 API 中并没有直接提供跳出这棵组件树的方法。

所以，为了实现弹层组件，我们需要先实现一个 `Portal` 组件，这个组件只做一件事：将组件树中某些节点移出当前的DOM 树，并且渲染到指定的 DOM 节点中, 并且可以维持组件的上下文和事件冒泡。

### 那么问题是什么呢？
别急，我们先聊点别的。

相信大部分 React 开发者都用过 `redux`（至少听过吧），`react-redux` 这个 `binding` 库提供了连接 `React` 和 `redux` 的一个桥梁。`react-redux` 的实现依赖 `React` 很有用的一个功能`Context`，简单来说 `context` 就是提供了一个方便的跨越层级往下传递数据的方式。
`ReactDOM.render` 的问题正是在于这个 `context` 的功能，它无法连接两棵 `React` 组件树的 `context`。
`ReactDOM.render` 的函数原型中并没有当前组件树的信息，而 `context` 是跟组件树有关的。
```js
ReactDOM.render(
  element,
  container,
  [callback]
)
```

### 解决方案一 ReactDOM.unstable_renderSubtreeIntoContainer
React 提供了另一个非公开 API：`ReactDOM.unstable_renderSubtreeIntoContainer`。这个 API 多了一个参数，这个参数就是用来指定新的 React 组件树根节点的父组件的，有了这个参数，两棵本来互不相干的 React 组件树就被联系起来了，同时它们的 `context` 也连接了起来。

```js
ReactDOM.unstable_renderSubtreeIntoContainer(
  parentComponent,
  element,
  container,
  [callback]
)
```

### 解决方案二 ReactDOM.createPortal
Portals是reactjs16提供的官方解决方案，使得组件可以脱离父组件层级挂载在DOM树的任何位置。
用法：
```js
import DemoComponent from './DemoComponent';

render() {
  // react会将DemoComponent组件直接挂载在真真实实的 dom 节点 domNode 上，生命周期还和16版本之前相同。
  return ReactDOM.createPortal(
    <DemoComponent />,
    domNode,
  );
}
```
组件的挂载点虽然可以脱离父组件，但组件的事件通过冒泡机制仍可以传给父组件。
[官网portals](https://reactjs.org/docs/portals.html#___gatsby)


### 例子：rc-dialog
https://github.com/react-component/dialog

DialogWrap.jsx
```js
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Dialog from './Dialog';
import ContainerRender from 'rc-util/lib/ContainerRender';
import Portal from 'rc-util/lib/Portal';
import IDialogPropTypes from './IDialogPropTypes';

const IS_REACT_16 = !!ReactDOM.createPortal;

class DialogWrap extends React.Component<IDialogPropTypes, any> {
  static defaultProps = {
    visible: false,
  };

  _component: React.ReactElement<any>;

  renderComponent: (props: any) => void;

  removeContainer: () => void;

  shouldComponentUpdate({ visible }: { visible: boolean }) {
    return !!(this.props.visible || visible);
  }

  componentWillUnmount() {
    if (IS_REACT_16) {
      return;
    }
    if (this.props.visible) {
      this.renderComponent({
        afterClose: this.removeContainer,
        onClose() {
        },
        visible: false,
      });
    } else {
      this.removeContainer();
    }
  }

  saveDialog = (node: any) => {
    this._component = node;
  }

  getComponent = (extra = {}) => {
    return (
      <Dialog
        ref={this.saveDialog}
        {...this.props}
        {...extra}
        key="dialog"
      />
    );
  }

  getContainer = () => {
    if (this.props.getContainer) {
      return this.props.getContainer();
    }
    const container = document.createElement('div');
    document.body.appendChild(container);
    return container;
  }

  render() {
    const { visible } = this.props;

    let portal: any = null;

    if (!IS_REACT_16) {
      return (
        <ContainerRender
          parent={this}
          visible={visible}
          autoDestroy={false}
          getComponent={this.getComponent}
          getContainer={this.getContainer}
        >
          {({ renderComponent, removeContainer }: { renderComponent: any, removeContainer: any }) => {
            this.renderComponent = renderComponent;
            this.removeContainer = removeContainer;
            return null;
          }}
        </ContainerRender>
      );
    }

    if (visible || this._component) {
      portal = (
        <Portal getContainer={this.getContainer}>
          {this.getComponent()}
        </Portal>
      );
    }

    return portal;
  }
}

export default DialogWrap;
```
ContainerRender.js
```js
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

export default class ContainerRender extends React.Component {
  static propTypes = {
    autoMount: PropTypes.bool,
    autoDestroy: PropTypes.bool,
    visible: PropTypes.bool,
    forceRender: PropTypes.bool,
    parent: PropTypes.any,
    getComponent: PropTypes.func.isRequired,
    getContainer: PropTypes.func.isRequired,
    children: PropTypes.func.isRequired,
  }

  static defaultProps = {
    autoMount: true,
    autoDestroy: true,
    forceRender: false,
  }

  componentDidMount() {
    if (this.props.autoMount) {
      this.renderComponent();
    }
  }

  componentDidUpdate() {
    if (this.props.autoMount) {
      this.renderComponent();
    }
  }

  componentWillUnmount() {
    if (this.props.autoDestroy) {
      this.removeContainer();
    }
  }

  removeContainer = () => {
    if (this.container) {
      ReactDOM.unmountComponentAtNode(this.container);
      this.container.parentNode.removeChild(this.container);
      this.container = null;
    }
  }

  renderComponent = (props, ready) => {
    const { visible, getComponent, forceRender, getContainer, parent } = this.props;
    if (visible || parent._component || forceRender) {
      if (!this.container) {
        this.container = getContainer();
      }
      ReactDOM.unstable_renderSubtreeIntoContainer(
        parent,
        getComponent(props),
        this.container,
        function callback() {
          if (ready) {
            ready.call(this);
          }
        }
      );
    }
  }

  render() {
    return this.props.children({
      renderComponent: this.renderComponent,
      removeContainer: this.removeContainer,
    });
  }
}
```
Portal.js
```js
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

export default class Portal extends React.Component {
  static propTypes = {
    getContainer: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
    didUpdate: PropTypes.func,
  }

  componentDidMount() {
    this.createContainer();
  }

  componentDidUpdate(prevProps) {
    const { didUpdate } = this.props;
    if (didUpdate) {
      didUpdate(prevProps);
    }
  }

  componentWillUnmount() {
    this.removeContainer();
  }

  createContainer() {
    this._container = this.props.getContainer();
    this.forceUpdate();
  }

  removeContainer() {
    if (this._container) {
      this._container.parentNode.removeChild(this._container);
    }
  }

  render() {
    if (this._container) {
      return ReactDOM.createPortal(this.props.children, this._container);
    }
    return null;
  }
}
```

参考链接：
https://github.com/react-component/dialog/blob/master/src/DialogWrap.tsx
https://github.com/react-component/util/blob/master/src/ContainerRender.js
https://github.com/react-component/util/blob/master/src/Portal.js
