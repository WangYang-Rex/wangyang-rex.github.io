---
title: 一些jquery小技巧
date: 2016-07-14 16:27:08
---

这篇文章总结了一些个人的jquery小知识

### 回到顶部的按钮
通过使用jQuery中的<code>animate</code> 与 <code>scrollTop</code> 方法可以创建一个非常简易的带有平滑滚动的回到顶部的按钮：
```
// Back to top
$('a.top').click(function (e) {
  e.preventDefault();
  $(document.body).animate({scrollTop: 0}, 800);
});
<!-- Create an anchor tag -->
<a class="top" href="#">Back to top</a>
```
通过修改 <code>scrollTop</code>的值可以设置滚动最终停止的位置，最终的效果就是在800毫秒的时间内文档会被滚动到指定的地方。

<!--more-->

### checkbox和radio的相关操作
判断是否选中
```
$('input.class').is(':checked');// true/false
```
让某个选中,使用 <code>prop</code> 而不是 <code>attr</code>
```
$('input.class').prop('checked',true/false);
```
取值
```
$('input[name=name]:checked').val();
```


### js replaceAll实现
<code>js</code> 没有 <code>java</code> 的 <code>replaceAll</code> 方法，这边有个方便的实现方法，利用正则
```
var aa = '1212121212'
aa.replace(/1/g,'2')
//"2222222222"
```



### 检查图片是否加载完成
有时候需要检查某个图片是否加载完成从而继续下面的操作：
```
$('img').load(function () {
  console.log('image load successful');
});
```
同样的，可以使用ID或者类选择器来判断某个特定的图片是否加载完成。



### 图片加载失败的处理
在页面上如果发生某些图片加载失败是一个非常常见并且恶心的事情，如下的一小段代码可以在某种程度上解决这个问题：
```
$('img').on('error', function () {
  $(this).prop('src', 'img/broken.png');
});
```
即使没有发现任何的坏链的情况，也是建议将这段代码添加到页面中。



### 使用Toggle
很多时候需要的响应是在用户悬浮在某个元素上时改变其的可见性或者状态，换言之，即是在用户将鼠标悬浮在某个元素上时修改其的类属性，而在用户停止悬浮时移除该类:
```
$('.btn').hover(function () {
  $(this).addClass('hover');
  }, function () {
    $(this).removeClass('hover');
  });
```
当然，更简单的就是利用 <code>toggleClass</code> 方法:
```
$('.btn').hover(function () {
  $(this).toggleClass('hover');
});
```
<b>Note</b>: CSS的hover伪类可能是更方便的做法，不过知晓这种用法也是值得的。


### 禁用输入框
很多情况下我们希望提交按钮能够在部分文本框未填入的情况下处于禁用状态直到用户执行了某个动作，此时我们就需要为这个按钮添加disabled属性：
```
$('input[type="submit"]').prop('disabled', true);
```
如果需要回复输入框的状态，那么就要再次使用 <code>prop</code>方法, 不过将 <code>disabled</code> 的值设置为<code>false</code>:
```
$('input[type="submit"]').prop('disabled', false);
```


### 阻止链接的加载
有时候你不希望用户在点击了某个链接之后跳转到新的页面或者重载当前页面：
```
$('a.no-link').click(function (e) {
  e.preventDefault();
});
```
或者
```
<a href="javascript:;"></a>
```


### 触发渐隐/滑动
滑动与渐隐是jQuery种最常见的动画之一，很多时候我们希望能在用户点击某个元素之后将其渐隐渐出或者滑动出现：

```
// Fade
$('.btn').click(function () {
  $('.element').fadeToggle('slow');
});
// Toggle
$('.btn').click(function () {
  $('.element').slideToggle('slow');
});
```


### 将两个DIV设置为统一高度
有时候希望无论两个DIV种包含怎样的内容都能保持统一高度：
```
$('.div').css('min-height', $('.main-div').height());
```


### 根据文本选择元素
通过使用 <code>contains()</code> 选择器可以根据内容搜索对应的元素，下述代码的作用就是在文本不存在的时候隐藏元素：
```
var search = $('#search').val();
$('div:not(:contains("'+search+'"))').hide();
```


### 可见性变化时候的触发
在某个Tab获得焦点或者失去焦点的时候：
```
$(document).on('visibilitychange', function(e){
  if (e.target.visibilityState === "visible") {
    console.log('Tab is now in view!');
  } else if (e.target.visibilityState === "hidden") {
    console.log('Tab is now hidden!');
  }
});
```

