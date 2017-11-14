---
title: 使用 webpack 优化资源
date: 2017-10-20 15:23:36
tags: [webpack]
---
## 前言
在前端应用的优化中，对加载资源的大小控制极其的重要，大多数时候我们能做的是在打包编译的过程对资源进行大小控制、拆分与复用。

本片文章中主要是基于 webpack 打包，以 React、vue 等生态开发的单页面应用来举例说明如何从 webpack 打包的层面去处理资源以及缓存，其中主要我们需要做的是对 webpack 进行配置的优化，同时涉及少量的业务代码的更改。

同时对打包资源的分析可以使用 ([webpack-contrib/webpack-bundle-analyzer](http://link.zhihu.com/?target=https%3A//github.com/webpack-contrib/webpack-bundle-analyzer)) 插件，当然可选的分析插件还是很多的，在本文中主要以该插件来举例分析。
<!--more--->
TIP: webpack 版本 @3.6.0

## 打包环境与代码压缩
首先我们有一个最基本的 webpack 配置：
```ls
// webpack.config.js
const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const PROJECT_ROOT = path.resolve(__dirname, './');

module.exports = {
  entry: {
    index: './src/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[chunkhash:4].js'
  },
  module: {
    rules: [
      {
        test: /\.js[x]?$/,
        use: 'babel-loader',
        include: PROJECT_ROOT,
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new BundleAnalyzerPlugin()
  ],
  resolve: {
    extensions: ['.js', '.jsx']
  },
};
```
执行打包可以看到一个项目的 js 有 1M 以上：
```js
Hash: e51afc2635f08322670b
Version: webpack 3.6.0
Time: 2769ms
        Asset    Size  Chunks                    Chunk Names
index.caa7.js  1.3 MB       0  [emitted]  [big]  index
```
这时候只需要增加插件 `DefinePlugin` 与 `UglifyJSPlugin` 即可减少不少的体积，在 plugins 中添加：
```js
// webpack.config.js
...
{
  ...
  plugins: [
    new BundleAnalyzerPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
    }),
    new UglifyJSPlugin({
      uglifyOptions: {
        ie8: false,
        output: {
          comments: false,
          beautify: false,
        },
        mangle: {
          keep_fnames: true
        },
        compress: {
          warnings: false,
          drop_console: true
        },
      }
    })
  ]
  ...
}
```
可以看到这时候的打包输出：
```js
Hash: 84338998472a6d3c5c25
Version: webpack 3.6.0
Time: 9940ms
        Asset    Size  Chunks                    Chunk Names
index.89c2.js  346 kB       0  [emitted]  [big]  index
```
代码的大小从 1.3M 降到了 346K。

### （1）DefinePlugin

>DefinePlugin 允许创建一个在编译时可以配置的全局常量。这可能会对开发模式和发布模式的构建允许不同的行为非常有用。如果在开发构建中，而不在发布构建中执行日志记录，则可以使用全局常量来决定是否记录日志。这就是 DefinePlugin 的用处，设置它，就可以忘记开发和发布构建的规则。

在我们的业务代码和第三方包的代码中很多时候需要判断 `process.env.NODE_ENV` 来做不同处理，而在生产环境中我们显然不需要非 `production` 的处理部分。

在这里我们设置 `process.env.NODE_ENV` 为 `JSON.stringify('production')`，也就是表示讲打包环境设置为生产环境。之后配合 `UglifyJSPlugin` 插件就可以在给生产环境打包的时候去除部分的冗余代码。

### （2）UglifyJSPlugin

UglifyJSPlugin 主要是用于解析、压缩 js 代码，它基于 `uglify-es` 来对 js 代码进行处理，它有多种配置选项：[https://github.com/webpack-contrib/uglifyjs-webpack-plugin](http://link.zhihu.com/?target=https%3A//github.com/webpack-contrib/uglifyjs-webpack-plugin)

通过对代码的压缩处理以及去除冗余，大大减小了打包资源的体积大小。

## 代码拆分/按需加载
在如 React 或者 vue 构建的单页面应用中，对页面路由与视图的控制是由前端来实现的，其对应的业务逻辑都在 js 代码中。

当一个应用设计的页面和逻辑很多的时候，最终生成的 js 文件资源也会相当大。

然而当我们打开一个 url 对应的页面时，实际上需要的并非全部的 js 代码，所需要的仅是一个主的运行时代码与该视图对应的业务逻辑的代码，在加载下一个视图的时候再去加载那部分的代码。

因此，对这方面可做的优化就是对 js 代码进行按需加载。
>懒加载或者按需加载，是一种很好的优化网页或应用的方式。这种方式实际上是先把你的代码在一些逻辑断点处分离开，然后在一些代码块中完成某些操作后，立即引用或即将引用另外一些新的代码块。这样加快了应用的初始加载速度，减轻了它的总体体积，因为某些代码块可能永远不会被加载。

在 webpack 中提供了动态导入的技术来实现代码拆分，首先在 webpack 的配置中需要去配置拆分出来的每个子模块的配置：
```js
// webpack.config.js
const path = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const PROJECT_ROOT = path.resolve(__dirname, './');

module.exports = {
  entry: {
    index: './src/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[chunkhash:4].js',
    chunkFilename: '[name].[chunkhash:4].child.js',
  },
  module: {
    rules: [
      {
        test: /\.js[x]?$/,
        use: 'babel-loader',
        include: PROJECT_ROOT,
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new BundleAnalyzerPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
    }),
    new UglifyJSPlugin({
      uglifyOptions: {
        ie8: false,
        output: {
          comments: false,
          beautify: false,
        },
        mangle: {
          keep_fnames: true
        },
        compress: {
          warnings: false,
          drop_console: true
        },
      }
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx']
  },
};
```

其中主要需要定义的则是 `output` 中的 `chunkFilename`，它是导出的拆分代码的文件名，这里给它设置为 `[name].[chunkhash:4].child.js`，其中的 `name` 对应模块名称或者 id，`chunkhash` 是模块内容的 hash。

之后在业务代码中 webpack 提供了两种方式来动态导入：
- `import('path/to/module') -> Promise`，
- `require.ensure(dependencies: String[], callback: function(require), errorCallback: function(error), chunkName: String)`

对于最新版本的 webpack 主要推荐使用 `import()` 的方式<b>（注意：import 使用到了 Promise，因此需要确保代码中支持了 Promise 的 polyfill）</b>。

```js
// src/index.js
function getComponent() {
  return import(
    /* webpackChunkName: "lodash" */
    'lodash'
  ).then(_ => {
    var element = document.createElement('div');

    element.innerHTML = _.join(['Hello', 'webpack'], ' ');

    return element;

  }).catch(error => 'An error occurred while loading the component');
}

getComponent().then(component => {
  document.body.appendChild(component);
})
```
可以看到打包的信息：
```js
Hash: d6ba79fe5995bcf9fa4d
Version: webpack 3.6.0
Time: 7022ms
               Asset     Size  Chunks             Chunk Names
lodash.89f0.child.js  85.4 kB       0  [emitted]  lodash
       index.316e.js  1.96 kB       1  [emitted]  index
   [0] ./src/index.js 441 bytes {1} [built]
   [2] (webpack)/buildin/global.js 509 bytes {0} [built]
   [3] (webpack)/buildin/module.js 517 bytes {0} [built]
    + 1 hidden module
```

可以看到打包出来的代码生成了 `index.316e.js` 和 `lodash.89f0.child.js` 两个文件，后者则是通过 `import` 来实现拆分的。

`import` 它接收一个 `path` 参数，指的是该子模块对于的路径，同时还注意到其中可以添加一行注释 `/* webpackChunkName: "lodash" */`，该注释并非是无用的，它定义了该子模块的 name，其对应与 `output.chunkFilename` 中的 `[name]`。

`import` 函数返回一个 Promise，当异步加载到子模块代码是会执行后续操作，比如更新视图等。

### （1）React 中的按需加载

在 React 配合 React-Router 开发中，往往就需要代码根据路由按需加载的能力，下面是一个基于 webpack 代码动态导入技术实现的 React 动态载入的组件：
```js
import React, { Component } from 'react';

export default function lazyLoader (importComponent) {
  class AsyncComponent extends Component {
    state = { Component: null }

    async componentDidMount () {
      const { default: Component } = await importComponent();

      this.setState({
        Component: Component
      });
    }

    render () {
      const Component = this.state.Component;

      return Component
        ? <Component {...this.props} />
        : null;
    }
  }

  return AsyncComponent;
};
```
在 `Route` 中：
```js
<Switch>
  <Route exact path="/"
    component={lazyLoader(() => import('./Home'))}
  />
  <Route path="/about"
    component={lazyLoader(() => import('./About'))}
  />
  <Route
    component={lazyLoader(() => import('./NotFound'))}
  />
</Switch>
```
在 `Route` 中渲染的是 `lazyLoader` 函数返回的组件，该组件在 mount 之后会去执行 `importComponent` 函数（既：`() => import('./About')`）动态加载其对于的组件模块（被拆分出来的代码），待加载成功之后渲染该组件。

使用该方式打包出来的代码：
```js
Hash: 02a053d135a5653de985
Version: webpack 3.6.0
Time: 9399ms
          Asset     Size  Chunks                    Chunk Names
0.db22.child.js  5.82 kB       0  [emitted]
1.fcf5.child.js   4.4 kB       1  [emitted]
2.442d.child.js     3 kB       2  [emitted]
  index.1bbc.js   339 kB       3  [emitted]  [big]  index
```

## 抽离 Common 资源
### （1）第三方库的长缓存
首先对于一些比较大的第三方库，比如在 React 中用到的 react、react-dom、react-router 等等，我们不希望它们被重复打包，并且在每次版本更新的时候也不希望去改变这部分的资源导致在用户端重新加载。

在这里可以使用 webpack 的 CommonsChunkPlugin 来抽离这些公共资源；
>CommonsChunkPlugin 插件，是一个可选的用于建立一个独立文件(又称作 chunk)的功能，这个文件包括多个入口 chunk 的公共模块。通过将公共模块拆出来，最终合成的文件能够在最开始的时候加载一次，便存起来到缓存中供后续使用。这个带来速度上的提升，因为浏览器会迅速将公共的代码从缓存中取出来，而不是每次访问一个新页面时，再去加载一个更大的文件。

首先需要在 entry 中新增一个入口用来打包需要抽离出来的库，这里将 `'react', 'react-dom', 'react-router-dom', 'immutable'` 都给单独打包进 `vendor` 中；

之后在 plugins 中定义一个 `CommonsChunkPlugin` 插件，同时将其 `name` 设置为 `vendor` 是它们相关联，再将 `minChunks` 设置为 `Infinity` 防止其他代码被打包进来。

```js
// webpack.config.js
const path = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const PROJECT_ROOT = path.resolve(__dirname, './');

module.exports = {
  entry: {
    index: './src0/index.js',
    vendor: ['react', 'react-dom', 'react-router-dom', 'immutable']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[chunkhash:4].js',
    chunkFilename: '[name].[chunkhash:4].child.js',
  },
  module: {
    rules: [
      {
        test: /\.js[x]?$/,
        use: 'babel-loader',
        include: PROJECT_ROOT,
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new BundleAnalyzerPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
    }),
    new UglifyJSPlugin({
      uglifyOptions: {
        ie8: false,
        output: {
          comments: false,
          beautify: false,
        },
        mangle: {
          keep_fnames: true
        },
        compress: {
          warnings: false,
          drop_console: true
        },
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity,
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx']
  },
};
```

运行打包可以看到：
```js
Hash: 34a71fcfd9a24e810c21
Version: webpack 3.6.0
Time: 9618ms
          Asset     Size  Chunks                    Chunk Names
0.2c65.child.js  5.82 kB       0  [emitted]
1.6e26.child.js   4.4 kB       1  [emitted]
2.e4bc.child.js     3 kB       2  [emitted]
  index.4e2f.js  64.2 kB       3  [emitted]         index
 vendor.5fd1.js   276 kB       4  [emitted]  [big]  vendor
```

可以看到 `vendor` 被单独打包出来了。

当我们改变业务代码时再次打包：
```js
Hash: cd3f1bc16b28ac97e20a
Version: webpack 3.6.0
Time: 9750ms
          Asset     Size  Chunks                    Chunk Names
0.2c65.child.js  5.82 kB       0  [emitted]
1.6e26.child.js   4.4 kB       1  [emitted]
2.e4bc.child.js     3 kB       2  [emitted]
  index.4d45.js  64.2 kB       3  [emitted]         index
 vendor.bc85.js   276 kB       4  [emitted]  [big]  vendor
```
vendor 包同样被打包出来的，然而它的文件 hash 却发生了变化，这显然不符合我们长缓存的需求。

这是因为 webpack 在使用 CommoChunkPlugin 的时候会生成一段 runtime 代码（它主要用来处理代码模块的映射关系），而哪怕没有改变 vendor 里的代码，这个 runtime 仍然是会跟随着打包变化的并且打入 verdor 中，所以 hash 就会开始变化了。解决方案则是把这部分的 runtime 代码也单独抽离出来，修改之前的 `CommonsChunkPlugin` 为：

```js
// webpack.config.js
...
new webpack.optimize.CommonsChunkPlugin({
  name: ['vendor', 'runtime'],
  minChunks: Infinity,
}),
...
```
执行打包可以看到生成的代码中多了 `runtime` 文件，同时即使改变业务代码，vendor 的 hash 值也保持不变了。

当然这段 `runtime` 实际上非常短，我们可以直接 inline 在 html 中，如果使用的是 `html-webpack-plugin` 插件处理 html，则可以结合 [`html-webpack-inline-source-plugin`](http://link.zhihu.com/?target=https%3A//github.com/DustinJackson/html-webpack-inline-source-plugin) 插件自动处理其 inline。

### （2）公共资源抽离
在我们打包出来的 js 资源包括不同入口以及子模块的 js 资源包，然而它们之间也会重复载入相同的依赖模块或者代码，因此可以通过 CommonsChunkPlugin 插件将它们共同依赖的一些资源打包成一个公共的 js 资源。

```js
// webpack.config.js
plugins: [
  new BundleAnalyzerPlugin(),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
  }),
  new UglifyJSPlugin({
    uglifyOptions: {
      ie8: false,
      output: {
        comments: false,
        beautify: false,
      },
      mangle: {
        keep_fnames: true
      },
      compress: {
        warnings: false,
        drop_console: true
      },
    }
  }),
  new webpack.optimize.CommonsChunkPlugin({
    name: ['vendor', 'runtime'],
    minChunks: Infinity,
  }),
  new webpack.optimize.CommonsChunkPlugin({
    // ( 公共chunk(commnons chunk) 的名称)
    name: "commons",
    // ( 公共chunk 的文件名)
    filename: "commons.[chunkhash:4].js",
    // (模块必须被 3个 入口chunk 共享)
    minChunks: 3
  })
],
```

可以看到这里增加了 `commons` 的一个打包，当一个资源被三个以及以上 chunk 依赖时，这些资源会被单独抽离打包到 `commons.[chunkhash:4].js` 文件。

执行打包，看到结果如下：
```js
Hash: 2577e42dc5d8b94114c8
Version: webpack 3.6.0
Time: 24009ms
          Asset     Size  Chunks                    Chunk Names
0.2eee.child.js  90.8 kB       0  [emitted]
1.cfbc.child.js  89.4 kB       1  [emitted]
2.557a.child.js    88 kB       2  [emitted]
 vendor.66fd.js   275 kB       3  [emitted]  [big]  vendor
  index.688b.js  64.2 kB       4  [emitted]         index
commons.a61e.js  1.78 kB       5  [emitted]         commons
```
却发现这里的 `commons.[chunkhash].js` 基本没有实际内容，然而明明在每个子模块中也都依赖了一些相同的依赖。

借助 webpack-bundle-analyzer 来分析一波：
![](/images/page/webpack/2.jpg)

可以看到三个模块都依赖了 `lodash`，然而它并没有被抽离出来。

这是因为 CommonsChunkPlugin 中的 chunk 指的是 entry 中的每个入口，因此对于一个入口拆分出来的子模块（children chunk）是不生效的。

可以通过在 CommonsChunkPlugin 插件中配置 `children` 参数将拆分出来的子模块的公共依赖也打包进 `commons` 中：
```js
// webpack.config.js
plugins: [
  new BundleAnalyzerPlugin(),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
  }),
  new UglifyJSPlugin({
    uglifyOptions: {
      ie8: false,
      output: {
        comments: false,
        beautify: false,
      },
      mangle: {
        keep_fnames: true
      },
      compress: {
        warnings: false,
        drop_console: true
      },
    }
  }),
  new webpack.optimize.CommonsChunkPlugin({
    name: ['vendor', 'runtime'],
    minChunks: Infinity,
  }),
  new webpack.optimize.CommonsChunkPlugin({
    // ( 公共chunk(commnons chunk) 的名称)
    name: "commons",
    // ( 公共chunk 的文件名)
    filename: "commons.[chunkhash:4].js",
    // (模块必须被 3个 入口chunk 共享)
    minChunks: 3
  }),
  new webpack.optimize.CommonsChunkPlugin({
    // (选择所有被选 chunks 的子 chunks)
    children: true,
    // (在提取之前需要至少三个子 chunk 共享这个模块)
    minChunks: 3,
  })
],
```
查看打包效果:
![](/images/page/webpack/3.jpg)

其子模块的公共资源都被打包到 `index` 之中了，并没有理想地打包进 `commons` 之中，还是因为 `commons` 对于的是 entry 中的入口模块，而这里并未有 3 个 entry 模块共用资源；

在单入口的应用中可以选择去除 `commons`，而在子模块的 `CommonsChunkPlugin` 的配置中配置 `async` 为 `true`：

```js
// webpack.config.js
plugins: [
  new BundleAnalyzerPlugin(),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
  }),
  new UglifyJSPlugin({
    uglifyOptions: {
      ie8: false,
      output: {
        comments: false,
        beautify: false,
      },
      mangle: {
        keep_fnames: true
      },
      compress: {
        warnings: false,
        drop_console: true
      },
    }
  }),
  new webpack.optimize.CommonsChunkPlugin({
    name: ['vendor', 'runtime'],
    minChunks: Infinity,
  }),
  new webpack.optimize.CommonsChunkPlugin({
    // (选择所有被选 chunks 的子 chunks)
    children: true,
    // (异步加载)
    async: true,
    // (在提取之前需要至少三个子 chunk 共享这个模块)
    minChunks: 3,
  })
],
```
查看效果：
![](/images/page/webpack/4.jpg)
子模块的公共资源都被打包到 `0.9c90.child.js` 中了，该模块则是子模块的 commons。

## tree shaking
>tree shaking 是一个术语，通常用于描述移除 JavaScript 上下文中的未引用代码(dead-code)。它依赖于 ES2015 模块系统中的静态结构特性，例如 import 和 export。这个术语和概念实际上是兴起于 ES2015 模块打包工具 rollup。

在我们引入一个依赖的某个输出的时候，我们可能需要的仅仅是该依赖的某一部分代码，而另一部分代码则是 `unused` 的，如果能够去除这部分代码，那么最终打包出来的资源体积也是可以有可观的减小。

首先，webpack 中实现 tree shaking 是基于 webpack 内部支持的 es2015 的模块机制，在大部分时候我们使用 babel 来编译 js 代码，而 babel 会通过自己的模块加载机制处理一遍，这导致 webpack 中的 tree shaking 处理将会失效。因此在 babel 的配置中需要关闭对模块加载的处理：

```js
// .babelrc
{
  "presets": [
    [
      "env", {
        "modules": false,
      }
    ],
    "stage-0"
  ],
  ...
}
```
然后我们来看下 webpack 是如何处理打包的代码，举例有一个入口文件 `index.js` 和一个 `utils.js` 文件：
```js
// utils.js
export function square(x) {
  return x * x;
}

export function cube(x) {
  return x * x * x;
}
```

```js
// index.js
import { cube } from './utils.js';

console.log(cube(10));
```

打包出来的代码：

```js
// index.bundle.js
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export square */
/* harmony export (immutable) */ __webpack_exports__["a"] = cube;
function square(x) {
  return x * x;
}

function cube(x) {
  return x * x * x;
}
```
可以看到仅有 `cube` 函数被 `__webpack_exports__` 导出来，而 `square` 函数被标记为 `unused harmony export square`，然而在打包代码中既是 `square` 没有被导出但是它仍然存在与代码中，而如何去除其代码则可以通过添加 `UglifyjsWebpackPlugin` 插件来处理。


