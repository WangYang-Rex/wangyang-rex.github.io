---
title: mobile reset.css
date: 2016-06-08 15:15:32
tags: [css,reset.css]
---

### 介绍
手机端页面开发有很多未知的问题，android和ios又有所不同，所以有个reset.css会避免掉很多的问题、bug

```
/* css reset author wangyang */
*{
	cursor: pointer; //为所有dom添加手势，解决IOS下不能点击的对象上绑定点击事件失效的问题
}
html {
  font-family: "Helvetica Neue", Helvetica, STHeiTi, sans-serif;//设置通用字体
  -webkit-text-size-adjust: 100%;//chrome字体禁止缩放
  font-size: 20px;//设置初始rem基准值
  overflow-y: scroll;
}
body,div,dl,dt,dd,ul,ol,li,h1,h2,h3,h4,h5,h6,pre,code,form,fieldset,legend,input,button,textarea,p,blockquote,th,td { margin:0; padding:0; }
body { background:#fff; color:#555; font-size:14px; font-family: Verdana, Arial, Helvetica, sans-serif; }
td,th,caption { font-size:14px; }
h1, h2, h3, h4, h5, h6 { font-weight:normal; font-size:100%; }
address, caption, cite, code, dfn, em, strong, th, var { font-style:normal; font-weight:normal;}
a,input,textarea,select,button{
  outline: 0;//去除外框
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);//去除聚焦时的阴影
  -webkit-tap-highlight-color: transparent;
}
a {text-decoration:none;} //去除下划线
a:hover { text-decoration:underline; }
a:active{
	outline: 0;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    -webkit-tap-highlight-color: transparent;
}
img, input, button { border:none; }//去除边框
ol,ul,li { list-style:none; } //去除默认圆点
input, textarea, select, button { font:14px Verdana,Helvetica,Arial,sans-serif;border-radius: 0; }
table {
	border-collapse:collapse;  //把表格边框显示为一条单独的边框
	border-spacing: 0; //设置相邻单元格的边框间的距离为0
}


```

<!--more-->
