---
title: AntD Modal组件的实现原理
date: 2018-03-08 14:06:23
tags: [react]
---

Ant Design(AntD)是React的一种UI组件。开发中使用AntD的Modal,在处理用户处理事务,在当前页面弹出一个对话框,承载相应的操作。现在来看看AntD的实现原理

先写列出部分Modal基本用法:

```js
render() {
    return (
      <div>
        <Button type="primary" onClick={this.showModal}>Open a modal dialog</Button>
        <Modal title="Basic Modal" visible={this.state.visible}
          onOk={this.handleOk} onCancel={this.handleCancel}
        >
          <p>some contents...</p>
          <p>some contents...</p>
          <p>some contents...</p>
        </Modal>
      </div>
    );
  }
//----------------
ReactDOM.render(<App />,mountNode)
```

这样即可使用模态对话框组件。
打开浏览器的开发者功能可以看到对话框的div始终在body内层中，而不是在mountNode内部。当然模态对话框本就应该存在body内存中，而不是任意其他组件元素内部,否则嵌套效果不好，添加动画会招来性能问题。
这是为什么？
从AntD的Modal组件源码中(components/modal/index.tsx)，可以看到如下代码：

```js
import confirm from './confirm';
Modal.success = function (props: ModalFuncProps) {
  const config = assign({}, {
    type: 'success',
    iconType: 'check-circle',
    okCancel: false,
  }, props);
  return confirm(config);
};
```

当Modal加载成功后，还需要进一步从confirm(config)获取组件。
我们进一步查看confirm,在confirm.tsx(components/modal/confirm.tsx)可以看到如下源码

```js
let div = document.createElement('div');
document.body.appendChild(div);
//......
ReactDOM.render(
  <Dialog
    className={classString}
    onCancel={close.bind(this, { triggerCancel: true })}
    visible
    title=""
    transitionName="zoom"
    footer=""
    maskTransitionName="fade"
    maskClosable={maskClosable}
    style={style}
    width={width}
  >
    <div className={`${prefixCls}-body-wrapper`}>
      {body} {footer}
    </div>
  </Dialog>
, div);
```

最后再次使用ReactDOM.render()在创建的div内部添加对话框。
同时这是说明,ReactDOM.render()并不是只有在顶层要嵌入的div中使用。内部同样可以再次使用。

！！！但是，ReactDOM.render()方法，虽然可以实现组件的挂载点脱离父组件，但是组件的事件无法通过冒泡机制传递给父组件，也就是说如果挂载点div脱离了顶层root组件(`<App />`)，那么挂载在div上面的组件也没办法使用redux。

那么为什么Antd-Modal到底是怎么实现的呢？ 原因是Antd-Modal里面使用了[rc-dialog](https://github.com/react-component/dialog) 组件，里面的`DialogWrap`组件使用了[rc-util](https://github.com/react-component/util)这个库的[ContainerRender.js](https://github.com/react-component/util/blob/master/src/ContainerRender.js)和[Portal.js](https://github.com/react-component/util/blob/master/src/Portal.js)方法，这个库解决了 '组件的挂载点虽然可以脱离父组件，但组件的事件通过冒泡机制仍可以传给父组件' 问题

详情请看下一篇博客>>