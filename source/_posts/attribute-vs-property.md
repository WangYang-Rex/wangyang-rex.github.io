---
title: JavaScript中的property和attribute的区别
date: 2016-05-05 19:02:45
tags: [javascript,attrbute,property]
---

## 1. 定义
<b>Property</b>：属性，所有的HTML元素都由HTMLElement类型表示，HTMLElement类型直接继承自Element并添加了一些属性，添加的这些属性别对应于每个HTML元素都有下面的这5个标准特性：id，title，lang，dir，className。DOM节点是一个对象，因此，他可以和其他的JavaScript对象一样添加自定义的属性以及方法。property的值可以是任何的数据类型，对大小写敏感，自定义的property不会出现
在html代码中，只存在js中。

<b>Attribute</b>：特性，区别于property，attribute只能是<b>字符串</b>，大小写不敏感，出现在
innerHTML中，通过类数组attributes可以罗列所有的attribute。
## 2. 相同之处
标准的 DOM properties 与 attributes 是同步的。公认的（非自定义的）特性会被以属性的形式添加到DOM对象中。如，id，align，style等，这时候操作property或者使用操作特性的DOM方法如getAttribute()都可以操作属性。不过传递给getAttribute()的特性名与实际的特性名相同。因此对于class的特性值获取的时候要传入“class”。
<!--more-->

## 3. 不同之处
- 对于有些标准的特性的操作，getAttribute与点号(.)获取的值存在差异性。如href，src，value，

   style，onclick等事件处理程序。
- href：getAttribute获取的是href的实际值，而点号获取的是完整的url，存在浏览器差异。

``` javascript
<a href="#"></a>
<script>
    var a  = document.body.children[0]
    a.href = '/'
    alert( 'attribute:' + a.getAttribute('href') ) // '/'
    alert( 'property:' + a.href )  // IE: '/', others: full URL
</script>
```

src的值的获取类似href，不过IE也会返回full URL；

value值同样存在一些 'one-way'（单向）同步的内置属性。

例如，input.value 从 attribute 中同步（即 property 从 attribute 中获得同步）


``` javascript
<input type="text" value="markup">
  <script>
       var input = document.body.children[0];
       input.setAttribute('value', 'new');
       alert( input.value ); // 'new', input.value changed
       alert( input.getAtrribute(value) ); // 'new'
  </script>
```

但是 attribute 不能从 property 中获得同步：
``` javascript
  <input type="text" value="markup">
   <script>
        var input = document.body.children[0];
        input.value = 'new';
        alert(input.getAttribute('value'));  // 'markup', not changed!
  </script>

```

getAttribute获取的是初始值，而点号获取的是初始值或者.value修改后的值,例如当访问者输入了某些字

符后，'value' attribute 在 property 更新后维持了原始值。原始值可以用来检验 input 是否变化，或

者重置它。

对于style和onclick等事件处理程序，getAttribute方法访问时会返回字符串，而点号返回的是相应的对

象和事件处理函数。

对于input中的checked属性，

```javascript
<input type="checkbox" checked>
<script>
    var input  = document.body.children[0]
    alert( input.checked ) // true
    alert( input.getAttribute('checked') ) // empty string
</script>
```

getAttribute获取的是你是实际设置的值。而点号返回的是布尔值。

### 浏览器兼容性上的差别
- 在IE<9的浏览器中，可以用点号和getAttribute在相互之间访问自定义属性。
- IE<8（包括IE8种的IE7兼容模式），property和attribute相同。因为attribute对大小写不敏感，在这

种情况下，用getAttribute访问特性的时候，浏览器会选择第一次出现的值。

```javascript
document.body.abba = 1 // assign property (now can read it by getAttribute)
document.body.ABBA = 5 // assign property with another case
// must get a property named 'ABba' in case-insensitive way.
alert( document.body.getAttribute('ABba') ) // 1
```

### 优先选择property
在实际应用中，98%的 DOM 操作都是使用 properties。

<b>只有两种情形需要使用attributes</b>
- 自定义 HTML attributes，因为它并不同步到DOM property。
- 访问内置的 HTML attributes，这些 attribute 不能从 property 同步过来。例如 INPUT标签的value

值。

<blockquote>
参考资料：
<a href="http://javascript.info/tutorial/attributes-and-custom-properties" target="_blank"

rel="nofollow">http://javascript.info/tutorial/attributes-and-custom-properties</a>
</blockquote>
