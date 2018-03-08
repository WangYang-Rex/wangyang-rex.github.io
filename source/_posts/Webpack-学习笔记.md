---
title: Webpack 学习笔记[精华]
date: 2017-11-29 19:21:34
tags: [webpack]
---

webpack 是模块打包系统, 代码分割, 加载器, 聪明的解析, 以及插件系统是它的特色
https://webpack.github.io/docs/configuration.html //config配置

### cli 参数
- --hot 代码热更新
- --progress 有tab栏
- --watch 实时监控
- -debug 调试

### loaders
加载器的使用, 加载器可以配置query参数并可以链式调用, 本质上是纯函数, 遵循单一职责原则
https://webpack.github.io/docs/list-of-loaders.html
https://webpack.github.io/docs/loader-conventions.html

### devTools
webpack-dev-server / webpack-dev-middleware / koa-webpack-dev

### codeSplitting 代码分割
定义分割点
CommonJS: require.ensure
AMD: require

```js
require.ensure(["./file"], function(require) {
  require("./file2");
});

// is equal to

require.ensure([], function(require) {
  require.include("./file");
  require("./file2");
});

```
## 一些优化

### 最小化
new webpack.optimize.UglifyJsPlugin() // 压缩
new webpack.optimize.OccurrenceOrderPlugin() //排序输出

### 删除重复数据
new webpack.optimize.DedupePlugin()

### 设置分块传输大小和数目
new webpack.optimize.LimitChunkCountPlugin({maxChunks: 15})
new webpack.optimize.MinChunkSizePlugin({minChunkSize: 10000})

### 增量更新
webpack-dev-server/webpack-dev-middleware/webpack –watch or watch: true

### 不解析
noParse

### SourceMap (使调试更容易）

- devtool: "source-map" 在一个单独的文件中产生一个完整且功能完全的文件。这个文件具有最好的`source map`，但是它会减慢打包速度；
- devtool: "cheap-module-source-map" 在一个单独的文件中生成一个不带列映射的`map`，不带列映射提高了打包速度，但是也使得浏览器开发者工具只能对应到具体的行，不能对应到具体的列（符号），会对调试造成不便；
- devtool: "eval-source-map" 使用`eval`打包源文件模块，在同一个文件中生成干净的完整的`source map`。这个选项可以在不影响构建速度的前提下生成完整的`sourcemap`，但是对打包后输出的JS文件的执行具有性能和安全的隐患。在开发阶段这是一个非常好的选项，在生产阶段则一定不要启用这个选项；
- devtool: "cheap-module-eval-source-map" 这是在打包文件时最快的生成`source map`的方法，生成的`Source Map` 会和打包后的`JavaScript`文件同行显示，没有列映射，和`eval-source-map`选项具有相似的缺点；

正如上表所述，上述选项由上到下打包速度越来越快，不过同时也具有越来越多的负面作用，较快的打包速度的后果就是对打包后的文件的的执行有一定影响。

>`cheap-module-eval-source-map`方法构建速度更快，但是不利于调试，推荐在大型项目考虑时间成本时使用。

对小到中型的项目中，eval-source-map是一个很好的选项，再次强调你只应该开发阶段使用它

### 模块 和 依赖位置
RESOLVE.ROOT VS RESOLVE.MODULESDIRECTORIES

### 单页应用
初始加载的应该是路由和首页, 然后再加载其他页
```js
<script src="entry-chunk.js" type="text/javascript" charset="utf-8"></script>
<script src="3.chunk.js" type="text/javascript" charset="utf-8"></script>
```

### 多页应用
```js
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
module.exports = {
    entry: {
        p1: "./page1",
        p2: "./page2",
        p3: "./page3",
        ap1: "./admin/page1",
        ap2: "./admin/page2"
    },
    output: {
        filename: "[name].js"
    },
    plugins: [
        new CommonsChunkPlugin("admin-commons.js", ["ap1", "ap2"]),
        new CommonsChunkPlugin("commons.js", ["p1", "p2", "admin-commons.js"])
    ]
};
```
或
```js
//  commons chunk
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
module.exports = {
    entry: {
        p1: "./page1",
        p2: "./page2",
        commons: "./entry-for-the-commons-chunk"
    },
    plugins: [
        new CommonsChunkPlugin("commons", "commons.js")
    ]
};
```

## 官方建议场景
### 应用性能
- 尽量使用`UglifyJsPlugin`减少文件体积
- 使用代码分割, 使首次加载尽可能快速
- 对于`React`, 使用 `react-proxy-loader`
- 添加 `hash` 到文件, 并尽可能长时间缓存
- 使 `module/chunk` 的ID尽可能保持一致
- 如果有静态页面, 使用 `html-webpack-plugin`
- 不要立即删除无用的资源(等待数周), 以免长时间保持浏览器窗口打开的用户 404
- 使用`DefinePlugin`来配置应用(是否内联, 各种条件配置)
- 使用`EnvironmentPlugin`来传递`process.env`到应用
- 使用包分析工具来检查问题, 减小下载时间, 改进内聚性
- 使用`stats-webpack-plugin`获取状态
- 使用配置文件`option`来获取更多性能数据
- 提取通用模块到单独的`script`文件(多页应用)
- 使用`DedupePlugin`来删除与`NPM`重复的数据
- 对`CSS`做处理
- 对静态资源做处理(`font/image`)
- 内联静态资源`url-loader`,减少加载时间
- 用`extract-text-webpack-plugin`来分割CSS资源(有很多css资源的应用)
- `LimitChunkCountPlugin` `MinChunkSizePlugin` `AggressiveMergingPlugin`来改善`chunk`传输
- 通过添加`script`标签来异步`chunk`的加载


### 开发性能
- 使用 `webpack.config.js` 代替 `CLi`
- 不要重写不兼容的`JS`, 使用 `imports-loader/exports-loader` 使之兼容, 并且更易升级
- 使用 `webpack devtools` 来在浏览器调试
- 尽可能使用 `ES6` 模块加载方式, 这更易于未来的优化(`webpack2`支持)
- 使用 `output.library` 来声明依赖
- 使用 `externals` 来对外声明依赖
- 使用 `HMR` 代码热更新
- 对于 `React` 使用 `react-hot-loader` 或 `react-transform`
- 自定义路由, 最好在路由级别更新
- 使用`Javascript`来书写配置文件
- 使用`resolve.root`来配置应用模块的路径, 允许较短的引用关系
- 使用`karma` 通过 `karma-webpack`来在浏览器测试模块
- 面向环境构建, 而不是面向浏览器构建
- 使用`BannerPlugin`来放置`Licensing`
- 通过`debug`来获取更多的出错信息
- 在`module.loaders`中使用`include`而不是`exclude`, 这样更不容易出错更加清晰

### 构建性能
- 使用增量备份 如果 `watch` 网络或`VM`内部的代码,请使用 `watchOptions.poll`
- 使用 `web-dev-server` 可以快速构建发布
- 使用多个 入口点 , 而不是多次运行 `webpack`(多页应用)
- 通过配置一个数组配置, 使`webpack`可以并行编译(大型配置复杂的应用)
- 大型无依赖的模块要配置`module.noParse`, 可以更快构建

## 应用
### 分割App中的共有模块和代码模块
```js
var webpack = require("webpack");

module.exports = {
  entry: {
    app: "./app.js",
    vendor: ["jquery", "underscore", ...],
  },
  output: {
    filename: "bundle.js"
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin(/* chunkName= */"vendor", /* filename= */"vendor.bundle.js")
  ]
};
```
```js
<script src="vendor.bundle.js"></script>
<script src="bundle.js"></script>
```

### 多入口文件分割
```js
var webpack = require("webpack");
module.exports = {
    entry: { a: "./a", b: "./b" },
    output: { filename: "[name].js" },
    plugins: [ new webpack.optimize.CommonsChunkPlugin("init.js") ]
}
```
```js
<script src="init.js"></script>
<script src="a.js"></script>
<script src="b.js"></script>
```
### CSS样式单独切成独立文件
```js
// webpack.config.js
var ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = {
    // The standard entry point and output config
    entry: {
        posts: "./posts",
        post: "./post",
        about: "./about"
    },
    output: {
        filename: "[name].js",
        chunkFilename: "[id].js"
    },
    module: {
        loaders: [
            // Extract css files
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader")
            },
            // Optionally extract less files
            // or any other compile-to-css language
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader")
            }
            // You could also use other loaders the same way. I. e. the autoprefixer-loader
        ]
    },
    // Use the plugin to specify the resulting filename (and add needed behavior to the compiler)
    plugins: [
        new ExtractTextPlugin("[name].css")
    ]
}

// posts.js posts.css
// post.js post.css
// about.js about.css
// 1.js 2.js (包含嵌入式的样式)
```
### 所有的CSS文件合并成1个文件, allChunks设置成true
```js
module.exports = {
    // ...
    plugins: [
        new ExtractTextPlugin("style.css", {
            allChunks: true
        })
    ]
}
// You’ll get these output files:

// posts.js
// post.js
// about.js
// 1.js 2.js (don’t contain embedded styles)
// style.css
```
### 公共样式会被抽出来
```js
module.exports = {
    // ...
    plugins: [
        new webpack.optimize.CommonsChunkPlugin("commons", "commons.js"),
        new ExtractTextPlugin("[name].css")
    ]
}
// You’ll get these output files:

// commons.js commons.css
// posts.js posts.css
// post.js post.css
// about.js about.css
// 1.js 2.js (包含内置样式)

// 如果 allChunks: true
// 1.js 2.js (不含内置样式)

```
## 场景
### 文件过大
```js
entry: {
    topic:'./src/components/app/topic.js'
    activity: './src/components/app/activity.js',
    react: ['react'],
    jquery: ['jquery']
},
plugins:[
    new CommonsChunkPlugin({
        name: ['jquery', 'react'], //提取公共模块
        minChunks: Infinity //提取所有entry依赖模块
        }),
    new webpack.optimize.UglifyJSPlugin({
        compress: {
            warinings: false
        }
        })
]
```
### 文件缓存
```js
output: {
    path: __dirname + '/release/',
    filename: '[chunkFilename:8].[name].js',
    chunkFilename: '[name].[chunkFilename:8].js'
}
```

### 自动生成页面
使用 HtmlWebpackPlugin 和 ExtractTextPlugin 插件可以解决此问题。
```js
plugins: [
    new HtmlWebpackPlugin({
        filename: 'topic.html',
        template: __dirname + '/src/app.html',
        inject: true,
        chunks: ['react', 'jquery', 'topic'],
        //排序
        chunksSortModel: function (a, b) {
            var index = {'topic': 1, 'react': 3, 'jquery': 2},
              aI = index[a.origins[0].name],
              bI = index[b.origins[0].name];
            return aI && bI ? bI - aI : 1;
        }
    }),
    new ExtractTextPlugin('comm.[contenthash:8].css')
]
```
### 异步加载
```js
require.ensure([], function()){
    var dialog = require('../../widget/dialog'),
    $ = require('jquery')
}
```