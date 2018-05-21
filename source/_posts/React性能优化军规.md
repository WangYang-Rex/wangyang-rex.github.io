---
title: React性能优化军规
date: 2018-05-21 17:54:21
tags: [react]
---

我们在开发的过程中，将上面所论述的内容，总结成一个基本的军规，铭记于心，就可以保证React应用的性能不至于太差。

### 渲染相关
- 提升级项目性能，请使用immutable(props、state、store)
- 请pure-render-decorator与immutablejs搭配使用
- 请慎用setState，因其容易导致重新渲染
- 谨慎将component当作props传入
- 请将方法的bind一律置于constructor
- 请只传递component需要的props，避免其它props变化导致重新渲染（慎用spread attributes）
- 请在你希望发生重新渲染的dom上设置可被react识别的同级唯一key，否则react在某些情况可能不会重新渲染。
- 请尽量使用const element

### tap事件
- 简单的tap事件，请使用react-tap-event-plugin
开发环境时，最好引入webpack的环境变量（仅在开发环境中初始化），在container中初始化。生产环境的时候，请将plugin跟react打包到一起（需要打包在一起才能正常使用，因为plugin对react有好多依赖），外链引入。

目前参考了这个项目的打包方案：
https://github.com/hartmamt/react-with-tap-events
Facebook官方issue: https://github.com/facebook/react/blob/bef45b0b1a98ea9b472ba664d955a039cf2f8068/src/renderers/dom/client/eventPlugins/TapEventPlugin.js
React-tap-event-plugin github:
https://github.com/zilverline/react-tap-event-plugin

- 复杂的tap事件，建议使用tap component
家校群列表页的每个作业的tap交互都比较复杂，出了普通的tap之外，还需要long tap和swipe。因此我们只好自己封装了一个tap component

### Debug相关
- 移动端请慎用redux-devtools，易造成卡顿
- Webpack慎用devtools的inline-source-map模式
使用此模式会内联一大段便于定位bug的字符串，查错时可以开启，不是查错时建议关闭，否则开发时加载的包会非常大。