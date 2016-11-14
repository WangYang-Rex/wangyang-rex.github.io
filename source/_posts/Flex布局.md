---
title: Flex布局
date: 2016-05-10 17:31:17
tags: [flex,css布局]
---
<a href="/file/flexbox-playground/index.html" target="_blank">flex测试工具</a>

### 前言
之前分享过Flex布局，一段时间没有用，忘得差不多了，恰逢我们的前端博客的诞生，在此记录并再次学习下；

### 布局方式
首先,我们有<b>表格布局</b>。当不考虑语义并且利用一些适当的嵌套和其他技巧,我们可以用table建立具有一定功能的布局。

然后是现在大多数人都在使用的<b>浮动布局</b>。我们可以使用任何我们想用的元素,但浮动并不适用于初学者。表面上它看起来很基础,但背后复杂的功能可以使经验丰富的开发者看着自己的屏幕不知所措。另外,浮动布局有一个缺点就是需要通过额外的元素清除浮动,或者更好一点,可以清除CSS浮动而不添加额外的标签。

这些缺点使得浮动布局不是很容易掌握，因为没有一个默认的方法可以建立起浮动与元素之间的关系，所以我们还需要更多的方法来实现<b>多栏等高布局</b>

然后有些人开始使用<b>display: table，display: table-cell</b>等,但由于直到IE8 Internet Explorer浏览器才支持,人们似乎放弃了而只是接受float作为实际解决方案。

### 弹性布局（Flex）的优势
- 独立的高度控制与对齐
- 独立的元素顺序。
- 指定元素之间的关系。
- 灵活的尺寸和对齐方式。
<!--more-->

## Flex布局
### 概念
采用Flex布局的元素，称为Flex容器（flex container），简称"容器"。它的所有子元素自动成为容器成员，称为Flex项目（flex item），简称"项目"。

容器默认存在两根轴：水平的主轴（main axis）和垂直的交叉轴（cross axis）。主轴的开始位置（与边框的交叉点）叫做main start，结束位置叫做main end；交叉轴的开始位置叫做cross start，结束位置叫做cross end。
项目默认沿主轴排列。单个项目占据的主轴空间叫做main size，占据的交叉轴空间叫做cross size。
<img width="571" height="341" src="http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071004.png" alt="Down arrow">

### 属性
```
display:flex | inline-flex; 定义弹性盒容器
.box{
	display: -webkit-flex; /* Safari */
	display: flex;
}
```
### 定义弹性盒容器
```
display:flex | inline-flex;
flex-direction:row | row-reverse | column | column-reverse 定义主轴方向
flex-wrap:nowrap | wrap | wrap-reverse 定义侧轴方向单行或多行
flex-flow ‘flex-direction’ 和 ‘flex-wrap’的组合简写
```

### 定义主轴上子元素的排列方式
```
justify-content:flex-start | flex-end | center | space-between | space-around
```
<img width="500" height="320" src="http://cdn.css-tricks.com/wp-content/uploads/2011/08/justify-contetnt.png">


### 定义侧轴上子元素高度的伸缩
```
align-items:flex-start | flex-end | center | baseline | stretch
```
<img width="500" height="320" src="http://cdn.css-tricks.com/wp-content/uploads/2011/08/align-items.png" alt="Down arrow">


### 定义侧轴上子元素的排列方式
```
align-content:flex-start | flex-end | center | space-between | space-around | stretch
```
<img width="500" height="320" src="http://cdn.css-tricks.com/wp-content/uploads/2011/08/align-content.png" alt="Down arrow">

```
order 子元素的显示顺序
flex-grow 父元素拉伸时子元素的拉伸比例值
flex-shrink 父元素缩小时子元素的收缩比例值
flex-basis 子元素的初始显示比例值
flex flex-grow [，flex-shrink，flex-basis]的简写形式
align-self:auto | flex-start | flex-end | center | baseline | stretch 提供给单个子元素覆盖父元素align-items值的能力
```
以上的CSS成为“新”的弹性盒模式,事实上，只有最近的几个Chrome内核（包括桌面版Chrome+、Android版Chrome、Opera 15+）支持这种写法，Firefox的支持还不够完善(详细信息点击这里)。更多的现代浏览器从几年前开始支持一种“老的”弹性盒模型语法，除了IE10。IE10似乎支持一种介于老语法与新语法之间的新语法。

<img  height="600" src="/images/page/333.jpg" alt="Down arrow">

### 如果你将Flexbox多版本混合在一起使用，可以得到以下浏览器的支持：
- Chrome any
- Firefox any (android 上面好像有问题？)
- Safari any
- Opera 12.1+
- IE 10+
- iOS any
- Android any

## 总结
虽然老版本的flex语法难以匹敌新版语法，但是仍然有很多支持广泛并且有用的特性。
像下面这样写CSS，可以方便的应用flex带来的排版上的方便。

```
.f-f{display: -webkit-box;display: -webkit-flex;}
.f-vc{-webkit-box-align:center;-webkit-align-items:center;}/*垂直居中*/
.f-hc{-webkit-box-pack:center;-webkit-justify-content:center;}/*水平居中*/
.f-hr{-webkit-box-pack:end;-webkit-justify-content:flex-end;}/*向右靠拢*/
.f-hl{-webkit-box-pack:start;-webkit-justify-content:flex-start;}/*向左靠拢*/
```

### 将各种flex语法写成Sass：
```
@mixin flexbox() {
	display: -webkit-box;
	display: -moz-box;
	display: -ms-flexbox;
	display: -webkit-flex;
	display: flex;
}

@mixin flex($values) {
	-webkit-box-flex: $values;
	-moz-box-flex:  $values;
	-webkit-flex:  $values;
	-ms-flex:  $values;
	flex:  $values;
}

@mixin order($val) {
	-webkit-box-ordinal-group: $val;
	-moz-box-ordinal-group: $val;
	-ms-flex-order: $val;
	-webkit-order: $val;
	order: $val;
}
```

### 参考链接
<a href="https://css-tricks.com/snippets/css/a-guide-to-flexbox/">A Complete Guide to Flexbox</a>

<a href="http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html?utm_source=tuicool">阮一峰-Flex 布局教程：语法篇</a>

<a href="http://my.oschina.net/yinyongcom666/blog/151085?p={{currentPage-1}}#OSC_h2_1">Flex弹性布局在移动设备上的应用</a>