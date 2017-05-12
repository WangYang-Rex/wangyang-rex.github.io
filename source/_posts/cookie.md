---
title: cookie
date: 2017-04-05 10:59:35
tags: [js, cookie]
---

> 咱们不搞一开始就一大堆理论知识介绍，怕把人讲懵了...... 咱们换一个思维方式——"从现象看本质"，先说说我们看到了什么，再从看到的现象中提出问题，最后深入寻找答案。


## 我们看到的 cookie
在 chrome 浏览器中打开一个网站，进入开发者模式，点击`Resources`栏 -> 选择`cookies`，我们会看到如下图所示的界面：
![](/images/page/cookie/1.png)
<!--more-->

解释一下：左边栏`Cookies`下方会列举当前网页中设置过`cookie`的域都有哪些。上图中只有一个域，即“ppsc.sankuai.com”。而右侧区域显示的就是某个域下具体的 `cookie` 列表，对应上图就是`roundtables.hz.taeapp.com`域下设置的7个`cookie`。

在这个网页中我发了一个 Ajax 请求，request header如下图所示：
![](/images/page/cookie/2.png)

从上图中我们会看到`request header`中自动添加了`Cookie`字段（通过设置`withCredentials: true`），`Cookie`字段的值其实就是我设置的那4个 `cookie`。这个请求最终会发送到这个服务器上，这个服务器就能从接收到的`request header`中提取那4个`cookie。`

上面两张图展示了`cookie`的基本通信流程：设置`cookie` => `cookie`被自动添加到`request header`中 => 服务端接收到`cookie`。这个流程中有几个问题需要好好研究：
1. 什么样的数据适合放在`cookie`中？
2. `cookie`是怎么设置的？
3. `cookie`怎么增删查改？

我们要带着这几个问题继续往下阅读。

## cookie 是怎么工作的？
首先必须明确一点，存储`cookie`是浏览器提供的功能。`cookie` 其实是存储在浏览器中的纯文本，浏览器的安装目录下会专门有一个 `cookie` 文件夹来存放各个域下设置的`cookie`。

当网页要发`http`请求时，浏览器会先检查是否有相应的`cookie`，有则自动添加在`request header`中的`cookie`字段中。这些是浏览器自动帮我们做的，而且每一次http请求浏览器都会自动帮我们做。这个特点很重要，因为这关系到“什么样的数据适合存储在`cookie`中”。

存储在`cookie`中的数据，每次都会被浏览器自动放在`http`请求中，如果这些数据并不是每个请求都需要发给服务端的数据，浏览器这设置自动处理无疑增加了网络开销；但如果这些数据是每个请求都需要发给服务端的数据（比如身份认证信息），浏览器这设置自动处理就大大免去了重复添加操作。所以对于那设置“每次请求都要携带的信息（最典型的就是身份认证信息）”就特别适合放在`cookie`中，其他类型的数据就不适合了。

但在 `localStorage` 出现之前，`cookie`被滥用当做了存储工具。什么数据都放在`cookie`中，即使这些数据只在页面中使用而不需要随请求传送到服务端。当然`cookie`标准还是做了一些限制的：每个域名下的`cookie` 的大小最大为4KB，每个域名下的`cookie`数量最多为20个（但很多浏览器厂商在具体实现时支持大于20个）。

## cookie 的格式
### document.cookie
JS 原生的 API提供了获取`cookie`的方法：`document.cookie`（注意，这个方法只能获取非 HttpOnly 类型的`cookie`）。在 console 中执行这段代码可以看到结果如下图：
![](/images/page/cookie/3.png)

打印出的结果是一个字符串类型，因为`cookie`本身就是存储在浏览器中的字符串。但这个字符串是有格式的，由键值对 `key=value`构成，键值对之间由一个`分号`和一个`空格`隔开。

### cookie 的属性选项
每个`cookie`都有一定的属性，如什么时候失效，要发送到哪个域名，哪个路径等等。这些属性是通过`cookie`选项来设置的，`cookie`选项包括：`expires`、`domain`、`path`、`secure`、`HttpOnly`。在设置任一个`cookie`时都可以设置相关的这些属性，当然也可以不设置，这时会使用这些属性的默认值。在设置这些属性时，属性之间由一个分号和一个空格隔开。代码示例如下：
```
"key=name; expires=Thu, 25 Feb 2016 04:18:00 GMT; domain=ppsc.sankuai.com; path=/; secure; HttpOnly"
```

### expires
`expires`选项用来设置“`cookie` 什么时间内有效”。`expires`其实是`cookie`失效日期，`expires`必须是 `GMT` 格式的时间（可以通过 `new Date().toGMTString()`或者 `new Date().toUTCString()` 来获得）。

如`expires=Thu, 25 Feb 2016 04:18:00 GMT`表示`cookie`讲在2016年2月25日4:18分之后失效，对于失效的`cookie`浏览器会清空。如果没有设置该选项，则默认有效期为`session`，即会话`cookie`。这种`cookie`在浏览器关闭后就没有了。

> `expires` 是 http/1.0协议中的选项，在新的http/1.1协议中`expires`已经由 `max-age` 选项代替，两者的作用都是限制`cookie` 的有效时间。`expires`的值是一个时间点（`cookie失效时刻= expires`），而`max-age` 的值是一个以秒为单位时间段（`cookie失效时刻= 创建时刻+ max-age`）。

### domain 和 path
`domain`是域名，`path`是路径，两者加起来就构成了 `URL`，`domain`和`path`一起来限制 `cookie` 能被哪些 `URL` 访问。

一句话概括：某`cookie`的 `domain`为`baidu.com`, `path`为“/ ”，若请求的URL(URL 可以是js/html/img/css资源请求，但不包括 XHR 请求)的域名是“baidu.com”或其子域如“api.baidu.com”、“dev.api.baidu.com”，且 URL 的路径是“/ ”或子路径“/home”、“/home/login”，则浏览器会将此 cookie 添加到该请求的 cookie 头部中。

所以`domain`和`path`2个选项共同决定了`cookie`何时被浏览器自动添加到请求头部中发送出去。如果没有设置这两个选项，则会使用默认值。`domain`的默认值为设置该`cookie`的网页所在的域名，`path`默认值为设置该`cookie`的网页所在的目录。

>特别说明1：
发生跨域xhr请求时，即使请求URL的域名和路径都满足 cookie 的 domain 和 path，默认情况下cookie也不会自动被添加到请求头部中。若想知道原因请阅读本文最后一节）
>
>特别说明2：
domain是可以设置为页面本身的域名（本域），或页面本身域名的父域，但不能是公共后缀 public suffix。举例说明下：如果页面域名为 www.baidu.com, domain可以设置为“www.baidu.com”，也可以设置为“baidu.com”，但不能设置为“.com”或“com”。

### secure
`secure`选项用来设置`cookie`只在确保安全的请求中才会发送。当请求是HTTPS或者其他安全协议时，包含 `secure` 选项的 `cookie` 才能被发送至服务器。

默认情况下，`cookie`不会带`secure`选项(即为空)。所以默认情况下，不管是`HTTPS`协议还是`HTTP`协议的请求，`cookie` 都会被发送至服务端。但要注意一点，secure选项只是限定了在安全情况下才可以传输给服务端，但并不代表你不能看到这个 `cookie`。

下面我们设置一个 `secure`类型的 `cookie`：
>document.cookie = "name=huang; secure";

之后你就能在控制台中看到这个 cookie 了，如下图所示：
![](/images/page/cookie/4.png)

>这里有个坑需要注意下：
如果想在客户端即网页中通过 js 去设置`secure`类型的 `cookie`，必须保证网页是`https`协议的。在`http`协议的网页中是无法设置`secure`类型cookie的。

### httpOnly
这个选项用来设置`cookie`是否能通过 `js` 去访问。默认情况下，`cookie`不会带`httpOnly`选项(即为空)，所以默认情况下，客户端是可以通过js代码去访问（包括读取、修改、删除等）这个`cookie`的。当`cookie`带`httpOnly`选项时，客户端则无法通过js代码去访问（包括读取、修改、删除等）这个`cookie`。

在客户端是不能通过`js`代码去设置一个`httpOnly`类型的`cookie`的，这种类型的`cookie`只能通过服务端来设置。

那我们在页面中怎么知道哪些`cookie`是`httpOnly`类型的呢？看下图：
![](/images/page/cookie/5.png)

凡是`httpOnly`类型的`cookie`，其 `HTTP` 一列都会打上√，如上图中的`PA_VTIME`。你通过`document.cookie`是不能获取的，也不能修改`PA_VTIME`的。

>——`httpOnly`与安全
>
>从上面介绍中，大家是否会有这样的疑问：为什么我们要限制客户端去访问`cookie`？其实这样做是为了保障安全。
>
>试想：如果任何` cookie` 都能被客户端通过`document.cookie`获取会发生什么可怕的事情。当我们的网页遭受了 `XSS `攻击，有一段恶意的`script`脚本插到了网页中。这段`script`脚本做的事情是：通过`document.cookie`读取了用户身份验证相关的 `cookie`，并将这些 `cookie` 发送到了攻击者的服务器。攻击者轻而易举就拿到了用户身份验证信息，于是就可以摇摇大摆地冒充此用户访问你的服务器了（因为攻击者有合法的用户身份验证信息，所以会通过你服务器的验证）。

## 如何设置 cookie？
知道了`cookie`的格式，`cookie`的属性选项，接下来我们就可以设置`cookie`了。首先得明确一点：`cookie`既可以由服务端来设置，也可以由客户端来设置。

###  服务端设置 cookie
不管你是请求一个资源文件（如 html/js/css/图片），还是发送一个`ajax`请求，服务端都会返回`response`。而`response header`中有一项叫`set-cookie`，是服务端专门用来设置`cookie`的。如下图所示，服务端返回的`response header`中有5个`set-cookie`字段，每个字段对应一个`cookie`（注意不能将多个`cookie`放在一个`set-cookie`字段中），`set-cookie`字段的值就是普通的字符串，每个`cookie`还设置了相关属性选项。
![](/images/page/cookie/6.png)

注意：
- 一个`set-Cookie`字段只能设置一个`cookie`，当你要想设置多个 `cookie`，需要添加同样多的`set-Cookie`字段。
- 服务端可以设置`cookie` 的所有选项：`expires`、`domain`、`path`、`secure`、`HttpOnly`

### 客户端设置 cookie
在网页即客户端中我们也可以通过`js`代码来设置`cookie`。如我当前打开的网址为`http://dxw.st.sankuai.com/mp/`，在控制台中我们执行了下面代码：
```
document.cookie = "name=Jonh; ";
```
查看浏览器 `cookie` 面板如下图所示，`cookie`确实设置成功了，而且属性选项 `domain`、`path`、`expires`都用了默认值。
![](/images/page/cookie/7.png)

再执行下面代码：
```
document.cookie="age=12; expires=Thu, 26 Feb 2116 11:50:25 GMT; domain=sankuai.com; path=/";
```
查看浏览器`cookie` 面板，如下图所示，新的`cookie`设置成功了，而且属性选项 `domain`、`path`、`expires`都变成了设定的值。
![](/images/page/cookie/8.png)

注意：
- 客户端可以设置`cookie` 的下列选项：`expires`、`domain`、`path`、`secure`（有条件：只有在`https`协议的网页中，客户端设置`secure`类型的 `cookie` 才能成功），但无法设置`HttpOnly`选项。

### 用 js 如何设置多个 cookie
当要设置多个`cookie`时， js 代码很自然地我们会这么写：
```
document.cookie = "name=Jonh; age=12; class=111";
```
但你会发现这样写只是添加了第一个`cookie`“name=John”，后面的所有`cookie`都没有添加成功。所以最简单的设置多个`cookie`的方法就在重复执行`document.cookie = "key=name"`，如下：
```
document.cookie = "name=Jonh";
document.cookie = "age=12";
document.cookie = "class=111";
```
## 如何修改、删除

### 修改 cookie
要想修改一个`cookie`，只需要重新赋值就行，旧的值会被新的值覆盖。但要注意一点，在设置新`cookie`时，`path/domain`这几个选项一定要旧`cookie` 保持一样。否则不会修改旧值，而是添加了一个新的` cookie`。

### 删除 cookie
删除一个`cookie` 也挺简单，也是重新赋值，只要将这个新`cookie`的`expires` 选项设置为一个过去的时间点就行了。但同样要注意，`path/domain/`这几个选项一定要旧`cookie` 保持一样。

## cookie 编码
`cookie`其实是个字符串，但这个字符串中逗号、分号、空格被当做了特殊符号。所以当`cookie`的 `key` 和 `value` 中含有这3个特殊字符时，需要对其进行额外编码，一般会用`escape`进行编码，读取时用`unescape`进行解码；当然也可以用`encodeURIComponent`/`decodeURIComponent`或者`encodeURI`/`decodeURI`（[三者的区别可以参考这篇文章](http://www.cnblogs.com/season-huang/p/3439277.html)）。

```
var key = escape("name;value");
var value = escape("this is a value contain , and ;");
document.cookie= key + "=" + value + "; expires=Thu, 26 Feb 2116 11:50:25 GMT; domain=sankuai.com; path=/";
```

## 跨域请求中 cookie
之前在介绍 XHR 的一篇文章里面提过：默认情况下，在发生跨域时，cookie 作为一种 credential 信息是不会被传送到服务端的。必须要进行额外设置才可以。具体原因和如何设置可以参考我的这篇文章：`你真的会使用XMLHttpRequest吗`？

另外，关于跨域资源共享 `CORS`极力推荐大家阅读阮一峰老师的这篇 `跨域资源共享 CORS 详解`。

## 其他补充
1. 什么时候 cookie 会被覆盖：name/domain/path 这3个字段都相同的时候；
2. 关于domain的补充说明（[参考1](https://tools.ietf.org/html/rfc6265#section-5.2.3)/[参考2](http://erik.io/blog/2014/03/04/definitive-guide-to-cookie-domains/)）：
	1. 如果显式设置了 domain，则设置成什么，浏览器就存成什么；但如果没有显式设置，则浏览器会自动取 url 的 host 作为 domain 值；
	2. 新的规范中，显式设置 domain 时，如果 value 最前面带点，则浏览器处理时会将这个点去掉，所以最后浏览器存的就是没有点的（注意：但目前大多数浏览器并未全部这么实现）
	3.  前面带点‘.’和不带点‘.’有啥区别：
		- 带点：任何 subdomain 都可以访问，包括父 domain
		- 不带点：只有完全一样的域名才能访问，subdomain 不能（但在 IE 下比较特殊，它支持 subdomain 访问）

