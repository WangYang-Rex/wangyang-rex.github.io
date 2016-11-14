---
title: 自己实现lazyload
date: 2016-06-28 09:31:12
tags: [lazyload,js]
---

### 前言
心血来潮，自己花了一个小时实现了一个简易版的lazyload插件。

<a href="/file/lazyload/index.html" target="_blank">例子</a>，
<a href="https://github.com/WangYang-Rex/lazyload" target="_blank">源代码</a>

### 设计思路
插件初始化时对匹配的img元素进行遍历，如果在可是区域之内，那么就赋值src，然后监听scroll事件，直到匹配的img数组为空。

主要用到了getBoundingClientRect()函数，兼容ie，作用是获取元素距离视窗上下左右的距离
<img src="/images/page/lazyload/1.jpg">

<!--more-->

<a href="/file/lazyload/index.html" target="_blank">例子</a>，
<a href="https://github.com/WangYang-Rex/lazyload" target="_blank">源代码</a>