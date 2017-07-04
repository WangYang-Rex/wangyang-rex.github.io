---
title: webpack入门
date: 2017-06-22 19:13:44
tags: [webpack]
---

在webpack看来，所有的资源文件都是模块，只是处理的方式不同。
webpack解决的需求点是：如何更好地加载前端模块。

### 使用webpack
只需要指定一个入口文件，webpack将自动识别项目所依赖的其它文件，不过需要注意的是如果webpack没有进行全局安装，那么在终端中使用此命令时，需要额外指定其在node_modules中的地址。

若webpack全局安装，使用webpack app/main.js public/bundle.js命令即可。
若webpack非全局安装，需使用node_modules\.bin\webpack app/main.js public/bundle.js命令。
注意：node_modules\.bin\webpack的路径需用右斜杠形式，用左斜杠形式会报错。
<!--more-->

### 通过配置文件来使用webpack
webpack拥有很多其它比较高级的功能，如`loaders`和`plugins`，这些功能其实都可以通过命令行模式实现，但这样不太方便且容易出错，一个更好的办法是定义一个配置文件，这个配置文件其实也是一个简单的`javascript`模块，可以把所有的与构建相关的信息放在里面。
以上面例子为例，在当根目录下新建一个名为`webpack.config.js`的文件，并进行配置，它包含入口文件路径和存放打包后文件的地方的路径。
```js
module.exports = {    
    entry: __dirname + "/app/main.js", // 唯一入口文件    
    output: {      
        path: __dirname + "/public",//打包后的文件存放的地方      
        filename: "bundle.js"//打包后输出文件的文件名  
    }  
}  
```
注：`__dirname`是`node.js`中的一个全局变量，它指向当前执行脚本所在的目录。
若`webpack`全局安装，使用`webpack`命令即可。
若`webpack`非全局安装，需使用`node_modules\.bin\webpack`命令。
这条命令会自动参考`webpack.config.js`文件中的配置选项打包项目，按照上面提到的结果查看方法即可查看结果。

### 更快捷的执行打包任务
执行类似于`node_modules\.bin\webpack`这样的命令其实是容易出错的，`npm`可以引导任务执行，对其进行配置后可以使用简单的`npm start`命令来代替这些繁琐的命令。在`package.json`中对`npm`的脚本部分进行相关设置即可：
默认的`test`直接删除，设置：
```js
"scripts": {  
    "start": "webpack"  
}  
```
注意：添加注释`//`或者`/**/`在`JSON`文件中是不允许的，若用`js`的方式添加注释会报错。
`package.json`中的脚本部分已经默认在命令前添加了`node_modules\.bin`路径，所以无论是全局还是局部安装的`webpack`，都不需要在前面指明详细的路径了。 
无论是全局安装还是非全局安装，都只需要使用`npm start`命令，按照上面提到的结果查看方法即可查看结果。


### 生成Source Maps（调试更容易）
打包后的文件往往不容易找到出错的源代码的位置，`Source Maps`可以解决这个问题。
通过简单的配置后，`webpack`在打包时可以生成`source maps`，提供一种对应编译文件和源文件的方法，使得编译后的代码可读性更高，也更容易调试。
在`webpack`的配置文件中配置`source maps`，需要配置`devtool`，它有以下四种不同的配置选项，各具优缺点，描述如下：
`devtool`选项  配置结果 
- source-map 在一个单独的文件中产生一个完整且功能完全的文件。这个文件具有最好的`source map`，但是它会减慢打包文件的构建速度。
- cheap-module-source-map 在一个单独的文件中生成一个不带列映射的`map`，不带列映射提高项目构建速度，但也使得浏览器开发者工具只能对应到具体的行，不能对应到具体的列（符号），会对调试造成不便。
- eval-source-map 使用`eval`打包源文件模块，在同一个文件中生成干净的完整的`source map`。这个选项可以在不影响构建速度的前提下生成完整的`sourcemap`，但是对打包后输出的`JS`文件的执行具有性能和安全的隐患。不过在开发阶段这是一个非常好的选项，但是在生产阶段一定不要用这个选项。
- cheap-module-eval-source-map 这是在打包文件时最快的生成`source map`的方法，生成的`Source map`会和打包后的`JS`文件同行显示，没有列映射，和`eval-source-map`选项具有相似的缺点。

上述选项由上到下打包速度越来越快，不过同时也具有越来越多的负面作用，较快的构建速度的后果就是对打包后的文件的的执行有一定影响。
在学习阶段以及在小到中性的项目上，`eval-source-map`是一个很好的选项，不过记得只在开发阶段使用它；`cheap-module-eval-source-map`方法构建速度更快，但是不利于调试，推荐在大型项目考虑da时间成本是使用。

以上述例子为例，继续配置webpack.config.js文件：
```js
module.exports = {  
    devtool: 'eval-source-map', // 配置生成Source Maps，选择合适的选项  
    entry:  __dirname + "/app/main.js", // 已多次提及的唯一入口文件  
    output: {  
        path: __dirname + "/public", // 打包后的文件存放的地方  
        filename: "bundle.js" // 打包后输出文件的文件名  
    }  
}  
```

### 使用webpack构建本地服务器
`webpack`提供一个可选的本地开发服务器，这个本地服务器基于`node.js`构建，可以实现浏览器监测代码的修改，并自动刷新修改后的结果，不过它是一个单独的组件，在`webpack`中进行配置之前需要单独安装它作为项目依赖，安装命令为`npm install --save-dev webpack-dev-server`。
`devserver`作为`webpack`配置选项中的一项，具有以下配置选项：
- contentBase 默认`webpack-dev-server`会为根文件夹提供本地服务器，如果想为另外一个目录下的文件提供本地服务器，应该在这里设置其所在目录
- port 设置默认监听端口，如果省略，默认为`8080`
- inline 设置为`true`，当源文件改变时会自动刷新页面
- colors 设置为`true`，使终端输出的文件为彩色的
- historyApiFallback 在开发单页应用时非常有用，它依赖于`HTML5 history API`，如果设置为`true`，所有的跳转将指向`index.html`

以上述例子为例，继续配置`webpack.config.js`文件：
```js
module.exports = {  
    devtool: 'eval-source-map', // 配置生成Source Maps，选择合适的选项  
    entry:  __dirname + "/app/main.js", // 已多次提及的唯一入口文件  
    output: {  
        path: __dirname + "/public", // 打包后的文件存放的地方  
        filename: "bundle.js" // 打包后输出文件的文件名  
    },  
    devServer: {  
        contentBase: "./public", // 本地服务器所加载的页面所在的目录  
        colors: true, // 终端中输出结果为彩色  
        historyApiFallback: true, // 不跳转  
        inline: true // 实时刷新  
    }     
}  
```
webpack有两个重要的功能：Loaders和Plugins。