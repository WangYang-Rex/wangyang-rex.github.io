---
title: window.location hash和search 掐架
date: 2016-06-17 11:01:03
tags: [window.location,search,hash]
---

### 发现问题的由来
首先有个需求，就是获取浏览器参数，也就是 window.location.href问号后面的参数值，就google了一个在江湖中流传的号称最好用的方法：
```
function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}

// 调用方法
alert(GetQueryString("参数名1"));
```
设置了一个全局方法，成功了，立马各个项目用起来~

这次有个需求，在页面加载时去获取参数时发现怎么都获取不到，于是去看代码，发现用到了window.location.search，调试发现window.location.search是空字符串。

<!--more-->

### 科普window.location
这段内容是W3C上找的，高手请跳过~
<img src="/images/page/location/2.jpg">
#### Location 对象
Location 对象包含有关当前 URL 的信息。

Location 对象是 Window 对象的一个部分，可通过 window.location 属性来访问。
<img src="/images/page/location/1.jpg">

### 定位问题
search:设置或返回从问号 (?) 开始的 URL（查询部分）。
感觉没问题啊，可是为什么window.location.search是空字符串？

请看下图调试结果：
<img src="/images/page/location/3.jpg">

<b>?id=1出现在了hash中，而没有出现在search中</b>，汗！！！

### 找到答案

继续google，在<a href="http://stackoverflow.com/questions/23789587/why-is-window-location-search-empty" target="_blick">stackoverflow</a>找到了解答：
<img src="/images/page/location/4.jpg">

window.location在解析url时，#后面的全都识别成了hash；

个人猜测url解析时,即使遇到?，后面也会去解析#;

相反，如解析时遇到#，后面却不会再去解析? 得找个相关的资料看下了~

一句话，慎用#,慎用#,慎用#，重要的话说三遍！

最后修改了获取浏览器参数的方法：
```
function GetQueryString(name)
{
     var search = window.location.search;
     if(!search){
        var hash = location.hash;
        search = hash?hash.substring(hash.indexOf('?')):'';
     }
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}
```

另外，根据我们的项目特征，可以把参数设置放在#之前
比如：
<img src="/images/page/location/5.jpg">
```
http://taeyxbak1.superboss.cc/index.html?id=18511#/zx/zdy/
```

当然这个场景设定在我们的框架初始化之前就要拿url参数，如果是框架初始化之后，那么可以用我们框架的方法，相应方法可以在pages里面找到~