---
title: webpack的重要功能——Plugins
date: 2017-06-23 14:57:18
tags: [webpack, node]
---

`webpack`中另一个非常重要的功能是`Plugins`。
插件（`Plugins`）是用来拓展`webpack`功能的，它们会在整个构建过程中生效，执行相关的任务。
`Loaders`和`Plugins`常常被弄混，但是他们其实是完全不同的东西：`Loaders`是在打包构建过程中用来处理源文件的（`JSX，Scss，Less..`），一次处理一个;插件并不直接操作单个文件，它直接对整个构建过程其作用。
`webpack`有很多内置插件，同时也有很多第三方插件，可以让我们完成更加丰富的功能。

<!--more-->

## 使用插件的方法
要使用某个插件，需要通过`npm`安装它，然后在`webpack.config.js`中的`plugins`关键字部分添加该插件的一个实例（`plugins`是一个数组，`new`一个插件即可）。
如添加一个实现版权声明的插件：
```js
module.exports = {  
        devtool: 'eval-source-map',  
        entry:  __dirname + "/app/main.js",  
        output: {...},  
    module: {  
                loaders: [  
                    { test: /\.json$/, loader: "json" },  
                    { test: /\.js$/, exclude: /node_modules/, loader: 'babel' },  
                    { test: /\.css$/, loader: 'style!css?modules!postcss' }//这里添加PostCSS  
                ]  
    },  
        postcss: [  
                require('autoprefixer')  
        ],  
        plugins: [  
                new webpack.BannerPlugin("Copyright Flying Unicorns inc.")    
    ],  
    devServer: {...}  
}  
```
## 几个常用的插件
### HtmlWebpackPlugin
这个插件的作用是依据一个简单的模板，帮助生成最终的`HTML5`文件，这个文件中自动引用了打包后的`JS`文件。每次编译都在文件名中插入一个不同的哈希值。
安装命令：
```js
npm install --save-dev html-webpack-plugin
```
这个插件自动完成了之前手动做的一些事情，在正式使用之前需要对项目结构做一些改变：

1. 移除public文件夹，利用此插件，html5文件会自动生成，此外CSS已经通过前面的操作打包到JS中了。
2. 在app目录下，创建一个HTML文件模板index.tmpl.html，这个模板包含title等其它需要的元素，在编译过程中，本插件会依据此模板生成最终的HTML页面，会自动添加所依赖的 css, js，favicon等文件，模板源代码如下：
```js
<!DOCTYPE html>  
<html lang="en">  
    <head>  
    </head>  
    <body>  
            <div id='root'>  
            </div>  
    </body>  
</html>  	
```
3. 更新webpack的配置文件，方法同上，新建一个build文件夹用来存放最终的输出文件。
```js
var webpack = require('webpack');var HtmlWebpackPlugin = require('html-webpack-plugin');  
module.exports = {  
        devtool: 'eval-source-map',  
        entry:  __dirname + "/app/main.js",  
        output: {  
                path: __dirname + "/build",  
                filename: "bundle.js"  
        },  
    module: {  
                loaders: [  
                    { test: /\.json$/, loader: "json" },  
                    { test: /\.js$/, exclude: /node_modules/, loader: 'babel' },  
                { test: /\.css$/, loader: 'style!css?modules!postcss' }  
            ]  
        },  
        postcss: [  
                require('autoprefixer')  
        ],  
        plugins: [  
                new HtmlWebpackPlugin({  
                    template: __dirname + "/app/index.tmpl.html"//new 一个这个插件的实例，并传入相关的参数  
                })  
        ],  
    devServer: {  
                colors: true,  
                historyApiFallback: true,  
                inline: true  
        }  
}  
```

### Hot Module Replacement
`Hot Module Replacement（HMR）`也是`webpack`里很有用的一个插件，它允许在修改组件代码后，自动刷新实时预览修改后的效果。
在`webpack`中实现`HMR`也很简单，只需要做两项配置

1. 在webpack配置文件中添加HMR插件；
2. 在Webpack Dev Server中添加“hot”参数。

不过配置完这些后，JS模块其实还是不能自动热加载的，还需要在JS模块中执行一个`Webpack`提供的`API`才能实现热加载，虽然这个`API`不难使用，但是如果是`React`模块，使用已经熟悉的`Babel`可以更方便的实现功能热加载。
具体实现方法如下：

1. Babel和webpack是独立的工具；
2. 二者可以一起工作；
3. 二者都可以通过插件拓展功能；
4. HMR是一个webpack插件，它让你能浏览器中实时观察模块修改后的效果，但是如果你想让它工作，需要对模块进行额外的配额；
5. Babel有一个叫做react-transform-hrm的插件，可以在不对React模块进行额外的配置的前提下让HMR正常工作。
```js
var webpack = require('webpack');  
var HtmlWebpackPlugin = require('html-webpack-plugin');  
module.exports = {  
        devtool: 'eval-source-map',  
        entry: __dirname + "/app/main.js",  
        output: {  
                path: __dirname + "/build",  
                filename: "bundle.js"  
        },  
        module: {  
                loaders: [  
                    { test: /\.json$/, loader: "json" },  
                    { test: /\.js$/, exclude: /node_modules/, loader: 'babel' },  
                    { test: /\.css$/, loader: 'style!css?modules!postcss' }  
                ]     
        },  
        postcss: [  
                require('autoprefixer')  
        ],  
    plugins: [  
                new HtmlWebpackPlugin({  
                    template: __dirname + "/app/index.tmpl.html"  
                }),  
                new webpack.HotModuleReplacementPlugin()//热加载插件  
        ],  
    devServer: {  
                colors: true,  
                historyApiFallback: true,  
                inline: true,  
            hot: true  
        }  
}  
```
安装react-transform-hmr：
```js
npm install --save-dev babel-plugin-react-transform react-transform-hmr
```
配置Babel
```js
{  
        "presets": ["react", "es2015"],  
        "env": {  
                "development": {  
                    "plugins": [["react-transform", {  
                    "transforms": [{  
                            "transform": "react-transform-hmr",  
                    "imports": ["react"],  
                    "locals": ["module"]  
                    }]  
                    }]]  
        }  
            }  
}  
```
使用React时，可以热加载模块了