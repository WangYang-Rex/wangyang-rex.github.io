---
title: webpack1升2踩坑记
date: 2018-06-14 16:56:44
tags: [webpack]
---
### webpack 从 v1 升级到 v2
从 v1 升级到 v2，总体来讲比较简单，跟着官方升级文档做就行了，主要是 `module` 和 `ExtractTextWebpackPlugin` 变化比较大
- http://www.css88.com/doc/webpack2/guides/migrating/


### 升级后 模块热替换(HMR)失效
直接看文档
- http://www.css88.com/doc/webpack2/guides/hmr-react/
- https://github.com/gaearon/react-hot-loader
- https://www.jianshu.com/p/07c0666e87c7
- https://segmentfault.com/a/1190000009244530
- https://github.com/gaearon/react-hot-loader/issues/249  这个issue非常有用！！！！