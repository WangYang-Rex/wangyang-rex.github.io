---
title: webpack最强大的功能———Loaders
date: 2017-06-23 10:06:43
tags: [node, webpack]
---

### Loaders
`Loaders`是`webpack`中最强大的功能之一了。通过使用不同的`loader`，`webpack`通过调用外部的脚本或工具可以对各种各样的格式的文件进行处理，如分析`JSON`文件并把它转换为`JavaScript`文件；或把下一代的`js`文件（`ES6，ES7`)转换为现代浏览器可以识别的`JS`文件；或对`React`的开发而言，合适的`Loaders`可以把`react`的`JSX`文件转换为`JS`文件。

`Loaders`需要单独安装并且需要在`webpack.config.js`下的`modules`关键字下进行配置。安装命令为`npm install --save-dev json-loader`，`Loaders`的配置选项包括以下几方面：
- test  一个匹配loaders所处理的文件的拓展名的正则表达式（必须）
- loader  loader的名称（必须）
- include/exclude  手动添加必须处理的文件（文件夹）或屏蔽不需要处理的文件（文件夹）（可选）
- query  为loaders提供额外的设置选项（可选）
<!--more-->

### Babel
`Loaders`很好，不过有的`Loaders`使用起来比较复杂，如`Babel`。
`Babel`其实是一个编译`javascript`的平台，它的强大之处表现在可以通过编译达到以下目的：
- 1) 下一代的`JavaScript`标准（`ES6，ES7`），这些标准目前并未被当前的浏览器完全的支持；
- 2) 使用基于`JavaScript`进行了拓展的语言，如`React`的`JSX`。
`Babel`其实是几个模块化的包，其核心功能位于称为`babel-core`的`npm`包中，不过`webpack`把它们整合在一起使用，但是对于每一个需要的功能或拓展，都需要安装单独的包（用得最多的是解析Es6的`babel-preset-es2015`包和解析`JSX`的`babel-preset-react`包）。
一次性安装这些依赖包（npm一次性安装多个依赖模块，模块之间用空格隔开）：
```js
npm install --save-dev babel-core babel-loader babel-preset-es2015 babel-preset-react
```
在`webpack`中配置`Babel`的方法如下（在`webpack.config.js`的`module`部分的`loaders`里进行配置即可）：
```js
module.exports = {  
    devtool: 'eval-source-map',//配置生成Source Maps，选择合适的选项  
    entry:  __dirname + "/app/main.js",//已多次提及的唯一入口文件  
    output: {  
        path: __dirname + "/public",//打包后的文件存放的地方  
        filename: "bundle.js"//打包后输出文件的文件名  
    },  
    module: {  
        loaders: [  
            {  
                test: /\.json$/,  
                loader: "json-loader"  
            },  
            {  
                test: /\.js$/,  
                exclude: /node_modules/,  
                loader: 'babel',  
                query: {  
                    presets: ['es2015','react']  
                }  
            }  
        ]  
    },  
    devServer: {  
        contentBase: "./public", // 本地服务器所加载的页面所在的目录  
        colors: true, // 终端中输出结果为彩色  
        historyApiFallback: true, // 不跳转  
        inline: true // 实时刷新  
    }  
}  
```
`webpack`进行以上配置后，允许使用`ES6`以及`JSX`的语法。

**Babel的配置选项：**
`Babel`其实可以完全在`webpack.config.js`中进行配置，但考虑到`babel`具有非常多的配置选项，在单一的`webpack.config.js`文件中进行配置往往使得这个文件显得太复杂，因此一些开发者支持把`babel`的配置选项放在一个单独的名为 `".babelrc"` 的配置文件中。现在的`babel`的配置并不算复杂，不过之后会再加一些东西，因此现在就提取出相关部分，分两个配置文件进行配置（`webpack`会自动调用`.babelrc`里的`babel`配置选项），如下：
```js
module.exports = {  
    devtool: 'eval-source-map',//配置生成Source Maps，选择合适的选项  
    entry:  __dirname + "/app/main.js",//已多次提及的唯一入口文件  
    output: {  
        path: __dirname + "/public",//打包后的文件存放的地方  
        filename: "bundle.js"//打包后输出文件的文件名  
    },  
    module: {  
        loaders: [  
            {  
                test: /\.json$/,  
                loader: "json-loader"  
            },  
            {  
                test: /\.js$/,  
                exclude: /node_modules/,  
                loader: 'babel'  
            }  
        ]  
    },  
    devServer: {  
        contentBase: "./public", // 本地服务器所加载的页面所在的目录  
        colors: true, // 终端中输出结果为彩色  
        historyApiFallback: true, // 不跳转  
        inline: true // 实时刷新  
    }  
}  
```
.babelrc：
```js
{  
    "presets": ["react", "es2015"]  
}  
```

### 模块
`webpack`的优点：把所有的文件都可以当做模块处理，包括`JavaScript`代码，也包括`CSS`和`fonts`以及图片等，通过合适的`loaders`，它们都可以被当做模块被处理。
**1）CSS**
`webpack`提供两个工具处理样式表，`css-loader` 和 `style-loader`，二者处理的任务不同，`css-loader`使得能够使用类似`@import` 和 `url(...)`的方法实现 `require()`的功能，`style-loader`将所有的计算后的样式加入页面中，二者组合在一起能够把样式表嵌入`webpack`打包后的JS文件中。
安装命令：`npm install --save-dev style-loader css-loader`
```js
module.exports = {  
    devtool: 'eval-source-map',//配置生成Source Maps，选择合适的选项  
    entry:  __dirname + "/app/main.js",//已多次提及的唯一入口文件  
    output: {  
        path: __dirname + "/public",//打包后的文件存放的地方  
        filename: "bundle.js"//打包后输出文件的文件名  
    },  
    module: {  
        loaders: [  
            {  
                test: /\.json$/,  
                loader: "json-loader"  
            },  
            {  
                test: /\.js$/,  
                exclude: /node_modules/,  
                loader: 'babel',  
                query: {  
                    presets: ['es2015','react']  
                }  
            },  
            {  
                test: /\.css$/,  
                loader: 'style!css'  
            }  
        ]  
    },  
    devServer: {  
        contentBase: "./public", // 本地服务器所加载的页面所在的目录  
        colors: true, // 终端中输出结果为彩色  
        historyApiFallback: true, // 不跳转  
        inline: true // 实时刷新  
    }  
}  
```
注：感叹号的作用在于使同一文件能够使用不同类型的`loader`。

**2）CSS modules**
`CSS modules` 的技术就意在把`JS`的模块化思想带入`CSS`中来，通过`CSS`模块，所有的类名，动画名默认都只作用于当前模块。`Webpack`从一开始就对`CSS`模块化提供了支持，在`CSS loader`中进行配置后，所需要做的一切就是把`modules`传递都所需要的地方，然后就可以直接把`CSS`的类名传递到组件的代码中，且这样做只对当前组件有效，不必担心在不同的模块中具有相同的类名可能会造成的问题。具体的代码如下：
```js
module.exports = {  
    devtool: 'eval-source-map',//配置生成Source Maps，选择合适的选项  
    entry:  __dirname + "/app/main.js",//已多次提及的唯一入口文件  
    output: {  
        path: __dirname + "/public",//打包后的文件存放的地方  
        filename: "bundle.js"//打包后输出文件的文件名  
    },  
    module: {  
        loaders: [  
            {  
                test: /\.json$/,  
                loader: "json-loader"  
            },  
            {  
                test: /\.js$/,  
                exclude: /node_modules/,  
                loader: 'babel',  
                query: {  
                    presets: ['es2015','react']  
                }  
            },  
            {  
                test: /\.css$/,  
                loader: 'style!css?modules'  
            }  
        ]  
    },  
    devServer: {  
        contentBase: "./public", // 本地服务器所加载的页面所在的目录  
        colors: true, // 终端中输出结果为彩色  
        historyApiFallback: true, // 不跳转  
        inline: true // 实时刷新  
    }  
}  
```

### CSS预处理器
有关`Less Loader`、`Sass Loader`、`Stylus Loader`的介绍请见：[http://blog.csdn.net/zhouziyu2011/article/details/67646875。](http://blog.csdn.net/zhouziyu2011/article/details/67646875。)
还有一个`CSS`的处理平台-`PostCSS`，可以帮助`CSS`实现更多的功能，使用`PostCSS`来为`CSS`代码自动添加适应不同浏览器的CSS前缀。
安装`postcss-loader` 和 `autoprefixer`（自动添加前缀的插件）：
```js
npm install --save-dev postcss-loader autoprefixer。
```
在`webpack.config.js`中进行设置，只需要新建一个`postcss`关键字，并在里面申明依赖的插件，`css`会自动根据数据添加不同前缀了。
```js
module.exports = {  
    devtool: 'eval-source-map',//配置生成Source Maps，选择合适的选项  
    entry:  __dirname + "/app/main.js",//已多次提及的唯一入口文件  
    output: {  
        path: __dirname + "/public",//打包后的文件存放的地方  
        filename: "bundle.js"//打包后输出文件的文件名  
    },  
    module: {  
        loaders: [  
            {  
                test: /\.json$/,  
                loader: "json-loader"  
            },  
            {  
                test: /\.js$/,  
                exclude: /node_modules/,  
                loader: 'babel',  
                query: {  
                    presets: ['es2015','react']  
                }  
            },  
            {  
                test: /\.css$/,  
                loader: 'style!css?modules!postcss'  
            }  
        ]  
    },  
    postcss: [  
        require('autoprefixer')//调用autoprefixer插件  
    ],  
    devServer: {  
        contentBase: "./public", // 本地服务器所加载的页面所在的目录  
        colors: true, // 终端中输出结果为彩色  
        historyApiFallback: true, // 不跳转  
        inline: true // 实时刷新  
    }  
}  
```
处理`JS`的`Babel`和处理`CSS`的`PostCSS`其实也是两个单独的平台，配合`Webpack`可以很好的发挥它们的作用。