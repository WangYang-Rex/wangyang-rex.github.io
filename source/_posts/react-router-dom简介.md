---
title: react-router-dom简介
date: 2021-08-05 13:47:32
tags: [react, react-router]
---

<https://codesandbox.io/s/misty-haze-eq546?file=/example.js>

react-router-dom
> react-router-dom文档地址： <https://reactrouter.com/web/guides/quick-start/>

### 1.安装

> react-router提供多个包可以单独使用

| package | description |
| :------: | :------: |
| react-router | 路由核心功能 |
| react-router-dom | 基于react-router提供在浏览器运行环境下功能 |
| react-router-native | for React Native |
| react-router-config | static route congif helpers |

在浏览器中运行只需要安装react-router-dom，reac-router-dom依赖react-router会自动安装依赖，所以不需要再手动安装react-router

```js
npm install react-router-dom -S
// 或者
yarn add react-router-dom  
```

<!--more-->

### 2.路由组件

react-router包含三种类型的组件：路由组件、路由匹配组件 、导航组件。在你使用这些组件的时候，都必须先从react-router-dom引入。

```js
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
```

#### 2.1路由组件

react-router提供了两种路由组件: `BrowserRouter`, `HashRouter` 其中 `BrowserRouter` 是基于HTML5 history API (`pushState`, `replaceState`, `popstate`)事件
当然与之对应的还有 `HashRouter` 是基于 `window.location.hash` 。

#### 2.2 路由匹配组件

路由匹配组件有两种: `Route` 和 `Switch`, `Switch` 把多个路由组合在一起。
对于一个 `<Route>` 组件，可以设置三种属性：`component`、`render`、`children`来渲染出对应的内容。
当组件已存在时，一般使用`component`属性当需要传递参数变量给组件时，需要使用`render`属性

#### 2.3 导航组件

有三种常用的导航组件，分别是:`<Link>`、`<NavLink>`、`<Redirect>`。`<NavLink>`是一种特殊的Link组件，匹配路径时，渲染的a标签带有active。

### 3. 使用

在需要使用router的地方引入react-router-dom

#### 3.1 基本使用

以下是路由的基本使用例子

```js
import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
// import logo from './logo.svg';
import './App.css';
import About from './views/About'
import Home from './views/Home'
import Person from './views/Person'

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/person">Person</Link>
            </li>
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/person">
            <Person />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;

```

当然此处路由也可以有其他写法,比如

```js
<Switch>
  <Route exact path="/" component={Home}></Route>
  <Route path="/about" component={About}></Route>
  <Route path="/person/:id" component={Person}></Route>
  <Route component={NotFind}></Route>
</Switch>
```

其中的`exact`表示的是精确匹配，比如上面

```js
<Route exact path="/" component={Home}></Route>
```

如果没有写精确匹配的化，那么后面的所有路径都可以匹配到首页,解决方式就是增加exact或者将此路由放置最后面。

#### 3.2 Route动态传参

在一个路由匹配组件上设置参数，比如说上面的Person组件

```js
<Route path="/person/:id" component={Person}></Route>
```

设置是以:开始然后紧跟key值，然后我们在Person组件中就可以通过获取props获取这个参数值

```js
import React from 'react';
export default class Person extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props.match.params.id)
  }
  render() {
    const id = this.props.match.params.id
    return (
      <div>
        <h2>个人中心页面</h2>
        <p>个人id是:{id}</p>
      </div>
    )
  }
}
```

以上为传统class组件的写法，现在可以使用hooks，可以使用`useParams`，代码如下：

```js
import React from 'react';
import { useParams } from 'react-router-dom'
const Person = () => {
    const { id } = useParams();
    return (
      <div>
        <h2>个人中心页面</h2>
        <p>个人id是:{id}</p>
      </div>
    )
}
```

#### 3.3 嵌套路由

在About页面有一个嵌套路由代码示例：

```js
import React from 'react';
import { Link, Switch, Route } from 'react-router-dom'
import Tshirt from './product/Tshirt';
import Jeans from './product/Jeans'
export default class About extends React.Component {
  constructor(props) {
    super(props)
    console.log(this.props.match)
  }
  render() {
    const match = this.props.match;
    return (
      <>
    <nav>
      <Link to={`${match.url}/tshirt`}>Tshirt</Link>| 
      <Link to={`${match.url}/jeans`}>Jeans</Link>
    </nav>
    <Switch>
      <Route path={`${match.path}/tshirt`} component={Tshirt}></Route>
      <Route path={`${match.path}/jeans`} exact component={Jeans}></Route>
    </Switch>
  </>
    )
  }
}
```

此处如果换成Function的话可以直接使用另一个钩子函数`useRouteMatch`，获取当前匹配的路径和路由

```js
import { useRouteMatch } from 'react-router-dom'
const About = () => {
    const { path, url }  = useRouteMatch();
    ...省略
}
```

#### 3.4 路由重定向

`Redirect`路由重定向，使路由重定向到某个页面，比如我们经常会做的没有登录重定向到登录页面

```js
<Route exact path="/">
  {loggedIn ? <Redirect to="/dashboard" /> : <PublicHomePage />}</Route>
```

#### 3.5 滚动还原

大部分情况下，我们需要的是每次导航到某个新页面的的时候，滚动条都是在顶部,这种比较好实现

hooks版本

```js

import { useEffect } from "react";import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

```

class版本

```js

import React from "react";import { withRouter } from "react-router-dom";

class ScrollToTop extends React.Component {
  componentDidUpdate(prevProps) {
    if (
      this.props.location.pathname !== prevProps.location.pathname
    ) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    return null;
  }}
}

```

我们需要把`ScrollToTop`组件放在Router里面eg:

```js
function App() {
  return (
    <Router>
      <ScrollToTop />
      <App />
    </Router>
  );
}
```

而对于某些情况下比如一些tab我们希望切换回我们浏览过的tab页时我们希望滚动条滚动到我们之前浏览的位置，此处自行去实现。

#### 3.6 路由守卫

有时候我们在某个表单页面填好了表单，然后点击跳转到另外一个页面。
这时候我们就需要提醒用户有未提交的表单。当然这一步其实也是在实际的业务代码中实现。

```js
import React, { useState } from "react";
import {
  Prompt
} from "react-router-dom";
 const BlockingForm = ()=>{
  let [isBlocking, setIsBlocking] = useState(false);
  return (
    <form
      onSubmit={event => {
        event.preventDefault();
        event.target.reset();
        setIsBlocking(false);
      }}
    >
      <Prompt
        when={isBlocking}
        message={location =>
          `你是否要跳转到 ${location.pathname}`
        }
      />
      <p>
        Blocking?{" "}
        {isBlocking ? "Yes, click a link or the back button" : "Nope"}
      </p>
      <p>
        <input
          size="50"
          placeholder="输入值测试路由拦截"
          onChange={event => {
            setIsBlocking(event.target.value.length > 0);
          }}
        />
      </p>
      <p>
        <button>提交表单模拟接触拦截</button>
      </p>
    </form>
  );
}
export default BlockingForm;
```

#### 3.7代码分割

有时候为了避免文件过大加快加载速度，我们需要将代码分割，将某些路由对应的组件只有在点击的时候再加载js，就是组件的懒加载。
我们使用`webpack`, `@babel/plugin-syntax-dynamic-import`,`loadable-components`实现代码分割。

- 1.首先在.babelrc文件中增加配置

```js
{
  "presets": ["@babel/preset-react"],
  "plugins": ["@babel/plugin-syntax-dynamic-import"]
}
```

- 2.在我们需要懒加载的组件使用loadabel

```js
import React from 'react';
import loadable from '@loadable/component';
const BlockForm = loadable(() => import('../pages/BlockForm/index'), {
  fallback: <Loading />
})
```

其中BlockForm为懒加载得组件
`loadable`参考文档地址 [跳转](https://github.com/gregberge/loadable-components)

#### 3.8 withRouter

您可以通过withRouter高阶组件访问history属性和匹配的Route,
withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.

#### 3.9 其他hooks

之前使用了`useParams`和`useRouteMatch`两个hook,还有另外两个hook
`useHistory`和`useLocation`
`useHistory`
可以访问到history实例，我们可以通过这个实例访问某个路由
`useLocation`
返回location对象
