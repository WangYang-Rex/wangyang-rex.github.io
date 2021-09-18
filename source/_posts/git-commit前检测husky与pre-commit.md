---
title: git commit前检测husky与pre-commit
date: 2021-08-23 14:27:15
tags: [git, 前端工程化]
---

### 一、前言

现在最流行的版本管理工具非`git`莫属，而良好的代码规范有助于项目的维护，为了防止一些不规范的代码 `commit`并`push`到远端,我们可以在`git`命令执行前用一些钩子来检测并阻止。现在大前端主要有两种`git`钩子插件：`husky`（`jquery`与`next.js`都在用），`pre-commit`(antd在用)。
下面我将现介绍一个`git`钩子，再介绍下`husky`与`pre-commit`的用法

### 二、git钩子

用过`git`的小伙伴们都知道`git`有很多命令`commit`、`push`、`rebase`等等。那这些命令主要是在执行`.git`文件夹中的东西，那么`git` 钩子目录就是在`.git`文件夹的`hooks`下，如下所示：

```js
cd .git/hooks
ls -l
```

![](/images/page/husky/1.jpeg)

上图为各个钩子的案例脚本，可以把`sample`去掉，直接编写`shell`脚本来执行。
而前端的小伙伴们则可以用插件`husky`与`pre-commit`，来使钩子生效。
注意： 一般`.git`为隐藏文件，可以把项目拖入IDE中查看,`.git`文件里的内容一般不允许手动更改的。

<!--more-->

### 三、husky

`husky`能够防止不规范代码被`commit`、`push`、`merge`等等。

首先安装`husky`

```js
npm install husky --save-dev
```

编辑`package.json`文件，如：
```js
{
  "scripts": {
    "precommit": "webpack  --config ./web/webpack.config.js",
    "...": "..."
  }
}
```

当你`git commit`的时候，将会现现执行`precommit`里的脚本，没有问题了再提交。

![](/images/page/husky/2.jpeg)

具体案例可查看[https://link.zhihu.com/?target=https%3A//github.com/raoenhui/create-img](https://link.zhihu.com/?target=https%3A//github.com/raoenhui/create-img)

### 四、pre-commit

`pre-commit`能够防止不规范代码被`commit`，没有`husky`这么全面，但是你可以接着安装`pre-push`等插件来防止对应的git操作。下面以`pre-commit`为例：
首先安装`pre-commit`

```js
npm install pre-commit --save-dev
```

编辑`package.json`文件，如：

```js
"scripts": {
  "test": "echo \"Error: I SHOULD FAIL LOLOLOLOLOL \" && exit 1",
  "foo": "echo \"fooo\" && exit 0",
  "bar": "echo \"bar\" && exit 0"
},
"pre-commit": [
  "foo",
  "bar",
  "test"
]
```

`pre-commit`的配置项非常灵活，还可以下面这样写：

```js
{
  "precommit": "foo, bar, test"
  "pre-commit": "foo, bar, test"
  "pre-commit": ["foo", "bar", "test"]
  "precommit": ["foo", "bar", "test"],
  "precommit": {
    "run": "foo, bar, test",
  },
  "pre-commit": {
    "run": ["foo", "bar", "test"],
  },
  "precommit": {
    "run": ["foo", "bar", "test"],
  },
  "pre-commit": {
    "run": "foo, bar, test",
  }
}
```

你配置好后，执行`git commit`命令，它将会依次执行`foo`、`bar`、`test`来检测完善代码。

### 五、总结

我们已经怎么用`git`钩子插件了，那么我们一般用它来做什么呢。

`prevent commit`时，我们可以把`eslint`以及`test`命令加上，检测代码规范：

```js
"scripts": {
  "precommit": "lint-staged && npm run test"
}
```

`prevent publish` 主干分支时，我们可以把`tag`打上：

```js
"scripts": {
  "precommit": "npm run tag"
}
```

具体怎么自动化打tag标签，可以参考
[https://raoenhui.github.io/nodejs/git/2018/03/30/nodejs%E8%87%AA%E5%8A%A8%E7%94%9F%E6%88%90tag/](https://raoenhui.github.io/nodejs/git/2018/03/30/nodejs%E8%87%AA%E5%8A%A8%E7%94%9F%E6%88%90tag/)
