---
title: webpack前端模块加载工具
date: 2016-05-30 19:34:21
tags: [webpack,打包工具]
source: http://www.cnblogs.com/YikaJ/p/4586703.html?utm_source=tuicool&utm_medium=referral

---

最近在看许多React的资料，发现了大部分的项目都是用webpack行模块化管理的工具。这次也是借着写了一个React-Todos的小应用，对webPack最基本实用的功能体验了一番，顺带做个小记录。

### 为什么用webpack
### CommonJs与AMD
在一开始，我们先讲一下它和以往我们所用的模块管理工具有什么不一样。在最开始的阶段，Js并没有这些模块机制，各种Js到处飞，得不到有效妥善的管理。后来前端圈开始制定规范，最耳熟能详的是CommonJs和AMD。

CommonJs是应用在NodeJs，是一种同步的模块机制。它的写法大致如下：
```
var firstModule = require("firstModule");

//your code...

module.export = anotherModule
```

AMD的应用场景则是浏览器，异步加载的模块机制。require.js的写法大致如下：
```
define(['firstModule'], function(module){

  //your code...
  return anotherModule
})
```
<!--more-->

其实我们单比较写法，就知道CommonJs是更为优秀的。它是一种同步的写法，对Human友好，而且代码也不会繁琐臃肿。但更重要的原因是， 随着npm成为主流的JavaScript组件发布平台，越来越多的前端项目也依赖于npm上的项目，或者自身就会发布到npm平台。 所以我们对如何可以使用npm包中的模块是我们的一大需求。所以browserify工具就出现了，它支持我们直接使用 require() 的同步语法去加载npm模块。

当然我们这里不得不说的是，ES2015（ES6）里也有了自己的模块机制，也就是说ES6的模块机制是官方规定的，我们通过 <a href="https://babeljs.io/" rel="nofollow,noindex">babel</a> （一种6to5的编译器）可以使用比较多的新特性了，包括我们提到的模块机制，而它的写法大致如下：
```
import {someModule} from "someModule";

// your codes...

export anotherModule;
```
当然上面的写法只是最基本的，还有其他的不同加载模块的写法，可以看一下阮一峰老师的 <a href="http://es6.ruanyifeng.com/#docs/class" rel="nofollow,noindex">ECMAScript 6 入门</a> 或者babel的相关文档 <a href="https://babeljs.io/docs/learn-es2015/#modules" rel="nofollow,noindex">Learn ES2015</a> 。

### 功能特性
#### browserify的出现非常棒，但webpack更胜一筹
我们来看看webpack支持哪些功能特性：
- 支持CommonJs和AMD模块，意思也就是我们基本可以无痛迁移旧项目。
- 支持模块加载器和插件机制，可对模块灵活定制。特别是我最爱的babel-loader，有效支持ES6。
- 可以通过配置，打包成多个文件。有效利用浏览器的缓存功能提升性能。
- 将样式文件和图片等静态资源也可视为模块进行打包。配合loader加载器，可以支持sass，less等CSS预处理器。
- 内置有source map，即使打包在一起依旧方便调试。

看完上面这些，可以想象它就是一个前端工具，可以让我们进行各种模块加载，预处理后，再打包。之前我们对这些的处理是放在grunt或gulp等前端自动化工具中。有了webpack，我们无需借助自动化工具对模块进行各种处理，让我们工具的任务分的更加清晰。

我们看一下官方对webpack理解的图。
<img src="/images/page/webpack/1.jpg">
任何静态资源都可以视作模块，然后模块之间也可以相互依赖，通过webpack对模块进行处理后，可以打包成我们想要的静态资源。

既然已经大致知道为什么我们要使用webpack了，我们接下来就开始使用webpack吧！

### 开始使用webpack
首先新建一个webpack101的项目，我们将在webpack101这里开展我们接下来的各项学习
```
$ npm init // 用于初始化项目的package.json

//初始化文件目录：
webpack101
  --- src
    --- entry.js
    --- module1.js
  --- index.html
  --- package.json
  --- webpack.config.js
```
### 安装webpack
我们通过npm来将webpack安装到全局
```
$ npm install webpack -g
```
### 一个最简单的webpack
#### webpack配置
webpack是需要进行配置的，我们在使用webpack的时候，会默认 webpack.config.js 为我们的配置文件。所以接下来，我们新建这个js文件。
```
// webpack.config.js
var path = require("path");
module.exports = {
  entry: '../src/entry.js', //演示单入口文件
  output: {
    path: path.join(__dirname, 'out'),  //打包输出的路径
    filename: 'bundle.js',			  //打包后的名字
    publicPath: "./out/"				//html引用路径，在这里是本地地址。
  }
};

```
### 编写入口文件
接下来就编写我们的入口文件 entry.js 和第一个模块文件 module1.js 。我们一切从简，里面只用来加载一个Js模块。
```
// entry.js
require("./module1"); // 使用CommonJs来加载模块
```
下一个文件
```
// module1.js
console.log("Hello Webpack!");
```
### 启动webpack
一切准备好后，我们仅需要在项目根目录下，用命令行 webpack 执行一下即可。
```
// webpack 命令行的几种基本命令

$ webpack // 最基本的启动webpack方法
$ webpack -w // 提供watch方法，实时进行打包更新
$ webpack -p // 对打包后的文件进行压缩，提供production
$ webpack -d // 提供source map，方便调试。
```
webpack成功运行后，我们就可以看到根目录出现了out文件夹，里面有我们打包生成的 bundle.js 。我们最后通过在 index.html 里对这个文件引入就可以了。我们可以在控制台看到我们想要的结果， <b>Hello Webpack !</b>

### 多模块依赖

刚才的例子，我们仅仅是跑通了webpack通过 entry.js 入口文件进行打包的例子。下面我们就来看一下它是否真的支持CommonJs和AMD两种模块机制呢？下面我们新建多几个js文件吧！
```
// 修改module1.js
require(["./module3"], function(){
  console.log("Hello Webpack!");
});
```
下一个文件
```
// module2.js，使用的是CommonJs机制导出包
module.exports = function(a, b){
  return a + b;
}
```
下一个文件
```
// module3.js，使用AMD模块机制
define(['./module2.js'], function(sum){
  return console.log("1 + 2 = " + sum(1, 2));
})
```
其实像上面这样混用两种不同机制非常不好，这里仅仅是展示用的，在开发新项目时还是推荐CommonJs或ES2015的Module。当然我个人更倾向于ES2015的模块机制的～
### loader加载器
到了我最喜欢也是最激动人心的功能了！我们先想想应用场景，前端社区有许多预处理器供我们使用。我们可以使用这些预处理器做一些强大的事情，大家都听过的就是 CoffeeScript 和 Sass 了。我们以前要编译这些预处理器，就是用 gulp 进行编译。但是我们对这些文件处理其实也挺繁琐的，webpack可以一次性解决！

在这里我们用Sass和babel编译ES2015为例子，看一下loader是如何使用的。
### 安装loader
我们第一步就是先要安装好各个必须的loader，我们直接看看需要通过npm安装什么。
```
$ npm install style-loader css-loader url-loader babel-loader sass-loader file-loader --save-dev
```
### 配置loader
安装完各个loader后，我们就需要配置一下我们的 webpack.config.js ，载入我们的loader。
```
// webpack.config.js
module.exports = {
  entry: path.join(__dirname, 'src/entry.js'),
  output: {
    path: path.join(__dirname, 'out'),
    publicPath: "./out/",
    filename: 'bundle.js'
  },
  // 新添加的module属性
  module: {
    loaders: [
      {test: /\.js$/, loader: "babel"},
      {test: /\.css$/, loader: "style!css"},
      {test: /\.(jpg|png)$/, loader: "url?limit=8192"},
      {test: /\.scss$/, loader: "style!css!sass"}
    ]
  }
};

```

我们主要看看module的loaders。loaders是一个数组，里面的每一个对象都用正则表达式，对应着一种配对方案。比如匹配到js后缀名就用babel-loader，匹配到scss后缀名的就先用sass，再用css，最后用style处理，不同的处理器通过 ! 分隔并串联起来。这里的loader是可以省略掉 -loader 这样的，也就是原本应该写成 style-loader!css-loader!sass-loader ，当然我们必须惜字如金，所以都去掉后面的东东。

我们仅仅是配置一下，已经是可以直接用ES2015和SASS去写我们的前端代码了。在此之前，我们对src文件夹里再细分成js，css，image三个文件夹，处理好分层。话不多说，赶紧试试。

### 稍微复杂的webpack项目
### bebel-loader
```
// js/es6-module.js
class People{
  constructor(name){
    this.name = name;
  }
  sayhi(){
    console.log(`hi ${this.name} !`);
  }
}
exports.module = People;
```
写好模块后，我们直接在 entry.js 入口文件中引入该模块。
```
// entry.js

// javascript
require('./js/module1');
let People = require('./js/es6-module');
let p = new People("Yika");
p.sayHi();

// css
require('./css/main.scss');
```
哈哈哈，不能再爽！这下子我们可以使用很多优秀的ES6特性去构建大型的web了
### sass-loader
大家或许注意到了下方的css的require，那就是用来加载Sass样式的。我们通过启动style-loader会将css代码转化到 style 标签内，我们看一下里面的内容。
```
// css/main.scss
html, body{
  background: #dfdfdf;
}
```
最后我们打开 index.html 观察我们所有的结果，首先背景已经是淡灰色的，并且控制台也有我们想要的内容。我们通过查看DOM结构，可以发现 head 标签里多出了 style 标签，里面正是我们想要定制的样式

### 关于对图片的打包
我们之前也说，webpack对与静态资源来说，也是看作模块来加载的。CSS我们是已经看过了，那图片是怎么作为模块打包加载进来呢？这里我们可以想到，图片我们是用url-loader加载的。我们在css文件里的url属性，其实就是一种封装处理过require操作。当然我们还有一种方式就是直接对元素的src属性进行require赋值。

```
div.img{
  background: url(../image/xxx.jpg)
}

//或者
var img = document.createElement("img");
img.src = require("../image/xxx.jpg");
document.body.appendChild(img);
```
上述两种方法都会对符合要求的图片进行处理。而要求就是在url-loader后面通过query参数的方式实现的，这里就是说只有不大于8kb的图片才会打包处理成Base64的图片。关于query，请看文档： <a href="http://webpack.github.io/docs/using-loaders.html#query-parameters" rel="nofollow,noindex">Query parameters</a>
```
{test: /\.(jpg|png)$/, loader: "url?limit=8192"}
```
### 打包成多个资源文件
我们在开发多页面的站点的时候，还是需要希望能有多个资源文件的。这样我们就可以有效利用缓存提升性能，做到文件按需加载。如何写入口文件，这里就不再赘述了，我们直接看如何对 webpack.config.js 进行修改。
```
// webpack.config.js

entry: {
  page1: "entry.js",
  page2: "entry2.js"
},
output: {
  path: path.join(__dirname, 'out'),
    publicPath: "./out/",
    filename: '[name].js'
}
```
这里重点关注两个地方，entry属性可以是一个对象，而对象名也就是key会作为下面output的filename属性的 [name] 。当然entry也可以是一个数组，更多用法都可以去webpack的 <a href="https://webpack.github.io/docs/" rel="nofollow,noindex">官方文档</a> 进行查看。

当然webpack也考虑到公共模块的利用，我们利用插件就可以智能提取公共部分，以提供我们浏览器的缓存复用。我们只需要在 webpack.config.js 添加下面的代码即可。
```
// 修改添加，webpack.config.js
var webpack = require('webpack');
module.exports = {
  // ....省略各种代码
      plugins: [
        new webpack.optimize.CommonsChunkPlugin('common.js')
      ]
}
```
我们做个小测试，让第二个入口文件也加载我们之前的 es6-module.js 。然后我们用webpack进行打包，就发现生成的 common.js 里是有相应代码的。我们需要手动在html上去加载 common.js ，并且是<b> 必须要最先加载</b> 。

### 独立出css样式
如果我们希望样式通过 <link> 引入，而不是放在 style 标签内呢，即使这样做会多一个请求。这个时候我们就要配合插件一起使用啦，我们一起来看看。
```
$ npm install extract-text-webpack-plugin --save-dev
```
安装完插件就要配置 webpack.config.js 了。我们添加以下代码
```
var ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = {
  // ...省略各种代码
  module: {
    loaders: [
      {test: /\.js$/, loader: "babel"},
      {test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader")},
      {test: /\.(jpg|png|svg)$/, loader: "url?limit=8192"},
      {test: /\.scss$/, loader: "style!css!sass"}
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin('common.js'),
    new ExtractTextPlugin("[name].css")
  ]
}

```
为了区分开用 <link> 链接和用 style ，我们这里以CSS后缀结尾的模块用插件。我们重点关注一下使用了ExtractTextPlugin的模块，在ExtractTextPlugin的extract方法有两个参数，第一个参数是经过编译后通过style-loader单独提取出文件来，而第二个参数就是用来编译代码的loader。

当然，插件也支持所有独立样式打包成一个css文件。增加多一个参数即可。
```
new ExtractTextPlugin("style.css", {allChunks: true})
```
至于怎样加载样式是最佳实践，这个就要自己平时多思考了。多站点多样式的时候，是做到一次性打包加载呢，还是按需加载呢？我这里就建议一项，主页尽量做到最精简，毕竟决定用户存留时间。

### 总结

前端社区不断发展，越来越趋向于组件化的发展。通过webpack，我们就能体验到 one component one module 的开发感觉。当然如何更好的使用webpack还是要通过不断的思考总结，才能找到最优的方案。

#### 参考链接
http://webpackdoc.com/development.html
https://github.com/webpack/worker-loader









