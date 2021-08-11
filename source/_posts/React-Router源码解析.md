---
title: React Router源码解析
date: 2021-08-10 17:06:00
tags: [react, react-router]
---

我一直认为，会用框架和用好框架是有很大的区别的，当用框架到一定程度的时候，就需要看看框架对应生态中那些不可获取的库，这样能加深在不同框架中同样的功能的优秀实现方案。

>了解React Router的实现原理
>如何监听路有变化以及渲染对应的组件


### React Router是什么？

React Router是React团队开发的基于React框架架构所实现的路由库。

[react-router](https://link.zhihu.com/?target=https%3A//github.com/ReactTraining/react-router)

React Router有多个版本。

![](/images/page/reactRouter2/1.png)

`react-router-dom`是基于`react-router`再封装的一个带有`React DOM`组件的库，其中包括了`Link`、`HashRouter`、`BrowserRouter`等组件提供给开发者通过使用标签的方式控制路由跳转。

<!--more-->

### 阅读须知

- 源码阅读基于react-router和react-router-dom 5.2.1版本

### React Router如何监听路由变化的？

`react-router`使用了一个`history`的库来监听不同的路由变化，`react-router`支持我们使用`hash`和`bowser`两种路由规则，所以`history`这个库可以根据调用的`api`不同，来区分当前是监听不同的路由方式。

[history](https://github.com/ReactTraining/history)

`history`这个库的内容并不在本文章的阅读范围内，有兴趣的可以自行查看。

### 源码解读

我们开始逐步开始阅读源码。我们使用`React Router`的时候第一个了解的就是`BrowserRouter`和`HashRouter`这两个内置的组件。通过源码发现其实两个组件的实现是完全一样的，只是内部调用创建`history`实例的方式不一样，一个调用`createHashHistory`，另一个调用`createBrowserHistory`。

### 官方demo

```js
export default class App extends React.Component {
  render () {
    return (
      <Router>
        <div>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
          </ul>
          <hr />
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/dashboard">
            <Dashboard />
          </Route>
        </div>
      </Router>
    );
  }
}
```

### BrowserRouter

<!-- ![](/images/page/reactRouter2/2.jpeg) -->
```js
// https://github.com/ReactTraining/react-router/blob/master/packages/react-router-dom/modules/BrowserRouter.js
import React from "react";
import { Router } from "react-router";
import { createBrowserHistory as createHistory } from "history";
import PropTypes from "prop-types";
import warning from "tiny-warning";

/**
 * The public API for a <Router> that uses HTML5 history.
 */
class BrowserRouter extends React.Component {
  history = createHistory(this.props);

  render() {
    return <Router history={this.history} children={this.props.children} />;
  }
}

export default BrowserRouter;
```

### HashRouter

<!-- ![](/images/page/reactRouter2/3.jpeg) -->
```js
// https://github.com/ReactTraining/react-router/blob/master/packages/react-router-dom/modules/HashRouter.js
import React from "react";
import { Router } from "react-router";
import { createHashHistory as createHistory } from "history";
import PropTypes from "prop-types";
import warning from "tiny-warning";

/**
 * The public API for a <Router> that uses window.location.hash.
 */
class HashRouter extends React.Component {
  history = createHistory(this.props);

  render() {
    return <Router history={this.history} children={this.props.children} />;
  }
}

export default HashRouter;
```

本篇文章是基于`HashRouter`进行阅读，实际上只是监听的事件不一样而已。

通过源码发现，`HashRouter`实例化了一个`history`的实例，并且将`history`实例通过`props`和`children`一起传入的`Router`组件当中。

### Router 组件

<!-- ![](/images/page/reactRouter2/4.jpeg) -->
```js
// https://github.com/ReactTraining/react-router/blob/master/packages/react-router/modules/Router.js
import React from "react";
import PropTypes from "prop-types";
import warning from "tiny-warning";

import HistoryContext from "./HistoryContext.js";
import RouterContext from "./RouterContext.js";

/**
 * The public API for putting history on context.
 */
class Router extends React.Component {
  static computeRootMatch(pathname) {
    return { path: "/", url: "/", params: {}, isExact: pathname === "/" };
  }

  constructor(props) {
    super(props);

    this.state = {
      location: props.history.location
    };

    // This is a bit of a hack. We have to start listening for location
    // changes here in the constructor in case there are any <Redirect>s
    // on the initial render. If there are, they will replace/push when
    // they mount and since cDM fires in children before parents, we may
    // get a new location before the <Router> is mounted.
    this._isMounted = false;
    this._pendingLocation = null;

    if (!props.staticContext) {
      this.unlisten = props.history.listen(location => {
        if (this._isMounted) {
          this.setState({ location });
        } else {
          this._pendingLocation = location;
        }
      });
    }
  }

  componentDidMount() {
    this._isMounted = true;

    if (this._pendingLocation) {
      this.setState({ location: this._pendingLocation });
    }
  }

  componentWillUnmount() {
    if (this.unlisten) {
      this.unlisten();
      this._isMounted = false;
      this._pendingLocation = null;
    }
  }

  render() {
    return (
      <RouterContext.Provider
        value={{
          history: this.props.history,
          location: this.state.location,
          match: Router.computeRootMatch(this.state.location.pathname),
          staticContext: this.props.staticContext
        }}
      >
        <HistoryContext.Provider
          children={this.props.children || null}
          value={this.props.history}
        />
      </RouterContext.Provider>
    );
  }
}

export default Router;
```

> computeRootMatch函数中，如果pathname !== "/"的下，isExact会为false，后续会用到

### Route 组件

<!-- ![](/images/page/reactRouter2/5.jpeg) -->
```js
// https://github.com/ReactTraining/react-router/blob/master/packages/react-router/modules/Route.js
import React from "react";
import { isValidElementType } from "react-is";
import PropTypes from "prop-types";
import invariant from "tiny-invariant";
import warning from "tiny-warning";

import RouterContext from "./RouterContext.js";
import matchPath from "./matchPath.js";

function isEmptyChildren(children) {
  return React.Children.count(children) === 0;
}

function evalChildrenDev(children, props, path) {
  const value = children(props);

  warning(
    value !== undefined,
    "You returned `undefined` from the `children` function of " +
      `<Route${path ? ` path="${path}"` : ""}>, but you ` +
      "should have returned a React element or `null`"
  );

  return value || null;
}

/**
 * The public API for matching a single path and rendering.
 */
class Route extends React.Component {
  render() {
    return (
      <RouterContext.Consumer>
        {context => {
          invariant(context, "You should not use <Route> outside a <Router>");

          const location = this.props.location || context.location;
          const match = this.props.computedMatch
            ? this.props.computedMatch // <Switch> already computed the match for us
            : this.props.path
            ? matchPath(location.pathname, this.props)
            : context.match;

          const props = { ...context, location, match };

          let { children, component, render } = this.props;

          // Preact uses an empty array as children by
          // default, so use null if that's the case.
          if (Array.isArray(children) && isEmptyChildren(children)) {
            children = null;
          }

          return (
            <RouterContext.Provider value={props}>
              {props.match
                ? children
                  ? typeof children === "function"
                    ? __DEV__
                      ? evalChildrenDev(children, props, this.props.path)
                      : children(props)
                    : children
                  : component
                  ? React.createElement(component, props)
                  : render
                  ? render(props)
                  : null
                : typeof children === "function"
                ? __DEV__
                  ? evalChildrenDev(children, props, this.props.path)
                  : children(props)
                : null}
            </RouterContext.Provider>
          );
        }}
      </RouterContext.Consumer>
    );
  }
}

export default Route;
```

接下来我们看看`matchPath`函数是如何判断当前的`url`是否命中当前`Route`组件的`path`的。

![](/images/page/reactRouter2/6.jpeg)

到这里，就是大概整体渲染的时候React Router做了什么事情。

总结：

- HashRouter
- - 实例化history，调用createHashHistory
- - 将children和history传入Router组件
- Router
- - constructor周期内监听history的路由事件，将新的location存到Router的state中
- - componentWillUnmount移除监听
- - 使用Context包裹子组件（Provider），存入history、location、match(默认的命中对象)等。
- Route
- - 使用Context，声明为Consumer，接收Router传入的值。
- - 调用matchPath函数来判断当前Route的path是否命中当前url。
- - 使用Context包裹子组件（Provider），将Router传递进来的参数以及命中结果等传入给Route包裹的子组件
- - 渲染循序如下：
- - 当前Route是否命中url
- - - 是
- - - - 判断当前Route是否有子组件，有那么将渲染子组件，否则进入下一条
- - - - 判断当前Route是否有component参数，有就执行React.createElement创建component，否则进入下一条
- - - - 判断当前Route是否有render参数（函数），有就执行render函数，否则进入下一条。
- - - - 返回null
- - - 否
- - - - 返回null

当我们的路由发生变化时，`Router`中所监听的`history`函数将会触发，返回新的`location`对象，这是将会触发`Router`的`setState`，然后对应所有绑定`Router`的`Route`都将会重新渲染判断是否命中路由来进行重新渲染。

### Switch 组件

如果我们只是单纯的使用`Route`组件来设置路由，当我们的当前的`url`满足多条路由规则的情况下，会出现多个`Route`的子组件进行渲染，这个时候如果当我们使用`Switch`包裹多个`Route`组件的话，那么只会渲染首先命中当前`url`的`Route`组件，具体是如何实现的呢？

<!-- ![](/images/page/reactRouter2/7.jpeg) -->
```js
import React from "react";
import PropTypes from "prop-types";
import invariant from "tiny-invariant";
import warning from "tiny-warning";

import RouterContext from "./RouterContext.js";
import matchPath from "./matchPath.js";

/**
 * The public API for rendering the first <Route> that matches.
 */
class Switch extends React.Component {
  render() {
    return (
      <RouterContext.Consumer>
        {context => {
          invariant(context, "You should not use <Switch> outside a <Router>");

          const location = this.props.location || context.location;

          let element, match;

          // We use React.Children.forEach instead of React.Children.toArray().find()
          // here because toArray adds keys to all child elements and we do not want
          // to trigger an unmount/remount for two <Route>s that render the same
          // component at different URLs.
          React.Children.forEach(this.props.children, child => {
            if (match == null && React.isValidElement(child)) {
              element = child;

              const path = child.props.path || child.props.from;

              match = path
                ? matchPath(location.pathname, { ...child.props, path })
                : context.match;
            }
          });

          return match
            ? React.cloneElement(element, { location, computedMatch: match })
            : null;
        }}
      </RouterContext.Consumer>
    );
  }
}

export default Switch;
```

所以`Switch`和`Route`的区别是在于，`Switch`只会渲染满足的条件的`Route`，而`Route`会根据传入的`path`来判断如果满足当前`url`的情况下，就会渲染`Route`的子组件。`Switch`就是从而实现`Route`同时只会命中一个的功能。

### Link 组件

Link组件也是相当简单的一个组件，内部主要做了以下事情：

- 判断传入参数replace，是使用replace还是push进行跳转
- 执行传入的onClick事件
- 判断一些参数，例如（传入_blank参数，将交由浏览器处理）
- 触发内部点击事件，使用history库实例后的push或replace来控制前端路由跳转
- 禁止默认事件

以下是Link组件的点击处理逻辑：

![](/images/page/reactRouter2/8.jpeg)

`Link`组件是如何获取到`history`的那，我们使用的时候并没有传递进去当前的`history`实例呀，实际上还记得之前看`Route`组件的时候，在`return`的时候，又包裹了一层`Context`吗，其实实际上就是给`Link`这类型的标签方便获取到`history`实例的，而`Link`组件也是使用`Context`。

![](/images/page/reactRouter2/9.jpeg)

### 结语

`React Router`的代码其实很好理解，主要涉及到的是`history`这个库是核心点，整个路由的触发事件的封装，抹平了浏览器差异。其次就是`React Router`实际是基于`context`来实现`Router`、`Route`、`Link`等组件中，`history`，`location`等值的传递。

https://zhuanlan.zhihu.com/p/106042913
