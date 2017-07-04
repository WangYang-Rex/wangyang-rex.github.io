---
title: 浅谈webpack模块引用的五种方法
date: 2017-06-23 09:24:54
tags: [node, webpack]
---

### commonjs格式的require同步语法
```js
const home = require('./Home');  
… // 使用  
```

### commonjs格式的require.ensure异步语法
```js
require.ensure([], require => {  
    const home = require('./Home');  
    … //使用  
});  
```
<!--more-->
Home.js会被打包成一个单独的chunk文件：1.fb874860b35831bc96a8.js，其名称不具有可读性，因此一般给require.ensure传递第三个参数。
```js
require.ensure([], require => {  
    const home = require('./Home');  
    … //使用  
}, bundle/home');  
```
Home.js会被打包成一个具有指定文件名称的chunk文件：home.fb874860b35831bc96a8.js，该文件在bundle目录下。
在webpack.config.js文件中配置：
```js
output: {  
    path: __dirname + '/public',  
    filename: '[name].js',  
    chunkFilename: '[name].bundle.js'  
}  
```
Home.js会被打包成一个具有指定文件名称的chunk文件：home.bundle.js，该文件在bundle目录下，而bundle目录又在/public目录下。
注意：如果在require.ensure的回调函数中引用了两个以上的模块，webpack会把它们打包在一起。
```js
require.ensure([], require => {  
    const a = require('./a');  
    … //使用  
    const b = require('./b');  
    … //使用  
}, bundle/a-b');  
```
a.js和b.js会被打包成一个具有指定文件名称的chunk文件：a-b.bundle.js，，该文件在bundle目录下。如果不希望打包在一起，只能写多个require.ensure分别引用每一个模块。
给require.ensure传递的第一个参数可以是空数组，其实也可以是模块，实现预加载懒执行。
```js
require.ensure(['./Home'], require => {  
    const home = require('./Home');  
    … //使用  
}, bundle/home');  
```
Home.js会被下载下来，即所谓的预加载，但不会执行Home.js模块中的代码，当执行到onsthome = require('./Home')一句时才执行，即所谓的懒执行。

### webpack自带的require.include
require.include是webpack自身提供的，它可以实现require.ensure中的预加载功能，而不用把模块写在数组中。
```js
require.ensure([],require => {  
    require.include('./Home');// 只加载不执行  
    … //使用  
});  
```
require.include的返回值是undefined，如果想使用模块，需要再通过require引入。
```js
require.ensure([],require => {  
    require.include('./Home');// 只加载不执行  
    const home = require('./Home'); // 执行  
    … //使用  
}, bundle/home');  
```

### AMD异步加载
webpack既支持commonjs规范也支持AMD规范。
```js
require(['./Home'], function(home){  
    … //使用  
});  
```
如果写了多个模块，那么这些模块都会被打包成一个文件。
```js
require(['./a', './b'], function(a, b){  
    … //使用  
});  
```
a.js和b.js会被打包在一起，但AMD的方式无法传入第三个参数来指定文件名称。
require AMD与require.ensure的区别：
- require AMD传递一个模块数组和回调函数，模块都被下载下来且都被执行后才执行回调函数；
- require.ensure也是传递一个模块数组和回调函数，但是模块只会被下载下来，不会被执行，只有在回调函数中执行到require(模块)一句时，该模块才会被执行。
在webpack.config.js文件中配置：
```js
module.exports = {  
    entry: 'index.js'  
    output: {  
            path: __dirname + '/public',  
            filename: '[name].js',  
            chunkFilename: '[name].bundle.js'  
    }  
}  
```

### ES6的import
import会被转化为commonjs格式或是AMD格式，所以它不是一种新的模块引用方式。babel默认会把ES6的模块转化为commonjs规范，因此不需要再把它转成AMD规范。
```js
import home from './Home'; 
```
等价于
```js
const home = require('./Home');   
```
