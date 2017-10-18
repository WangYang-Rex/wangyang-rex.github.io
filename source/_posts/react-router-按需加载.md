---
title: react-router 按需加载
date: 2017-09-09 00:54:49
tags: [react, react-router]
---

>注：本文使用的 react-router 版本为 2.8.1

React Router 是一个非常出色的路由解决方案，同时也非常容易上手。但是当网站规模越来越大的时候，首先出现的问题是 Javascript 文件变得巨大，这导致首页渲染的时间让人难以忍受。实际上程序应当只加载当前渲染页所需的 JavaScript，也就是大家说的“代码分拆" — 将所有的代码分拆成多个小包，在用户浏览过程中按需加载。

效果：
以前是这样：
![](/images/page/reactRouter/01.png)

现在是这样：![](/images/page/reactRouter/02.png)

实际上就是将一个大 javascript 文件拆分成了若干个 chunk file。

下面是改造过程

## Webpack 配置
首先在 `webpack.config.js` 的 `output` 内加上 `chunkFilename`

```js
output: {
    path: path.join(__dirname, '/../dist/assets'),
    filename: 'app.js',
    publicPath: defaultSettings.publicPath,
    // 添加 chunkFilename
    chunkFilename: '[name].[chunkhash:5].chunk.js',
},
```

`name` 是在代码里为创建的 `chunk` 指定的名字，如果代码中没指定则 `webpack` 默认分配 `id` 作为 `name`。

`chunkhash` 是文件的 `hash` 码，这里只使用前五位。

## 添加首页
以前你的路由大概应该是这样的：（作为需要按需加载的大型应用，路由肯定是相当复杂，这里只列举部分路由举例）
```js
ReactDOM.render(
  (
    <Router history={browserHistory}>
      {/* 主页 */}
      <Route path="/" component={App}>
        {/* 默认 */}
        <IndexRoute component={HomePage} />

        {/* baidu */}
        <Route path="/baidu" component={BaiduPage}>
          <Route path="result" component={BaiduResultPage} />
          <Route path="frequency" component={BaiduFrequencyPage} />
        </Route>

        {/* 404 */}
        <Route path='/404' component={NotFoundPage} />
        
        {/* 其他重定向到 404 */}
        <Redirect from='*' to='/404' />
      </Route>
    </Router>
  ), document.getElementById('app')
);
```

按需加载之后，我们需要让路由动态加载组件，需要将 `component` 换成 `getComponent`。首先将路由拆出来（因为路由庞大之后全部写在一起会很难看），创建一个根路由 `rootRoute`：
```js
const rootRoute = {
  path: '/',
  indexRoute: {
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        cb(null, require('components/layer/HomePage'))
      }, 'HomePage')
    },
  },
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('components/Main'))
    }, 'Main')
  },
  childRoutes: [
    require('./routes/baidu'),
    require('./routes/404'),
    require('./routes/redirect')
  ]
}

ReactDOM.render(
  (
    <Router
      history={browserHistory}
      routes={rootRoute}
      />
  ), document.getElementById('app')
);
```

`history` 不变，在 `Router` 中添加 `routes` 属性，将创建的路由传递进去。

这里有四个属性：

### path
将匹配的路由，也就是以前的 path。

### getComponent
对应于以前的 component 属性，但是这个方法是异步的，也就是当路由匹配时，才会调用这个方法。

这里面有个 **require.ensure** 方法
```js
require.ensure(dependencies, callback, chunkName)
```
这是 `webpack` 提供的方法，这也是按需加载的核心方法。第一个参数是依赖，第二个是回调函数，第三个就是上面提到的 `chunkName`，用来指定这个 `chunk file` 的 `name`。

如果需要返回多个子组件，则使用 `getComponents` 方法，将多个组件作为一个对象的属性通过 `cb` 返回出去即可。这个在官方示例也有，但是我们这里并不需要，而且根组件是不能返回多个子组件的，所以使用 `getComponent`。

### indexRoute
用来设置主页，对应于以前的 `<IndexRoute>`。

注意这里的 `indexRoute` 写法， **这是个对象，在对象里面使用 getComponent**。

### childRoutes
这里面放置的就是子路由的配置，对应于以前的子路由们。我们将以前的 `/baidu`、`/404` 和 `*` 都拆了出来，接下来将分别为他们创建路由配置。

## 路由控制
上面的 `childRoutes` 里面，我们 `require` 了三个子路由，在目录下创建 `routes` 目录，将这三个路由放置进去。

```js
routes/
├── 404
│   └── index.js
├── baidu
│   ├── index.js
│   └── routes
│       ├── frequency
│       │   └── index.js
│       └── result
│           └── index.js
└── redirect
    └── index.js
```
和 rootRoute 类似，里面的每个 index.js 都是一个路由对象：

### /404/index.js
```js
module.exports = {
  path: '404',

  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('components/layer/NotFoundPage'))
    }, 'NotFoundPage')
  }
}
```
/baidu/index.js
```js
module.exports = {
  path: 'baidu',

  getChildRoutes(partialNextState, cb) {
    require.ensure([], (require) => {
      cb(null, [
        require('./routes/result'),
        require('./routes/frequency')
      ])
    })
  },

  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('components/layer/BaiduPage'))
    }, 'BaiduPage')
  }
}
```

### /baidu/routes/frequency/index.js

```js
module.exports = {
  path: 'frequency',

  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('components/layer/BaiduFrequencyPage'))
    }, 'BaiduFrequencyPage')
  }
}
```
举这几个例子应该就差不多了，其他都是一样的，稍微有点特别的是 redirect。

## 设置 Redirect
之前我们在根路由下是这么设置重定向的：
```js
<Router history={browserHistory}>
    <Route path="/" component={App}>
    {/* home */}
    <IndexRoute component={HomePage} />

    <Route path="/baidu" component={BaiduPage}>
        <Route path="result" component={BaiduResultPage} />
        <Route path="frequency" component={BaiduFrequencyPage} />
    </Route>

    <Route path='/404' component={NotFoundPage} />
    {/* 如果都不匹配，重定向到 404 */}
    <Redirect from='*' to='/404' />
    </Route>
</Router>
```

当改写之后，我们需要把这个重定向的路由单独拆出来，也就是 * 这个路由，我们上面已经为他创建了一个 `redirect` 目录。这里使用到 `onEnter` 方法，然后在这个方法里改变路由状态，调到另外的路由，实现 `redirect` ：

### /redirect/index.js
```js
module.exports = {
  path: '*',
  onEnter: (_, replaceState) => replaceState(null, "/404")
}
```

## The root route must render a single element
跟着官方示例和上面码出来之后，可能页面并没有渲染出来，而是报 **The root route must render a single element** 这个异常，这是因为 `module.exports` 和 ES6 里的 `export default` 有区别。

如果你是使用 `es6` 的写法，也就是你的组件都是通过 `export default` 导出的，那么在 `getComponent` 方法里面需要加入 `.default`。
```js
getComponent(nextState, cb) {
    require.ensure([], (require) => {
      // 在后面加 .default
      cb(null, require('components/layer/ReportPage')).default
    }, 'ReportPage')
}
```
如果你是使用 `CommonJS` 的写法，也就是通过 `module.exports` 导出的，那就无须加 `.default` 了。