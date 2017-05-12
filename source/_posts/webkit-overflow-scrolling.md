---
title: -webkit-overflow-scrolling:touch移动设备滚动回弹效果
date: 2017-04-11 20:25:13
tags: [css, 移动开发, mobile]
---

### 概述
-webkit-overflow-scrolling 属性控制元素在移动设备上是否使用滚动回弹效果.

### 值


- auto: 使用普通滚动, 当手指从触摸屏上移开，滚动会立即停止。
- touch: 使用具有回弹效果的滚动, 当手指从触摸屏上移开，内容会继续保持一段时间的滚动效果。继续滚动的速度和持续的时间和滚动手势的强烈程度成正比。同时也会创建一个新的堆栈上下文。

### 示例

```
-webkit-overflow-scrolling: touch; /* 当手指从触摸屏上移开，会保持一段时间的滚动 */

-webkit-overflow-scrolling: auto; /* 当手指从触摸屏上移开，滚动会立即停止 */
```
