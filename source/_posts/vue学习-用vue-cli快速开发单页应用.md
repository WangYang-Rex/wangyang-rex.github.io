---
title: vue学习-用vue-cli快速开发单页应用
date: 2016-09-29 10:42:00
tags:
---

> 最近正在学习vue，看了遍api和新手教程，打算动手做个单页面应用练手，在此记录一下

开发一个单页面应用涉及的点很多，路由，模块打包，资源请求等，我们用`vue-cli`来帮助快速构建一个单页面应用，`vue-cli` 可以生成一套提前定义好的构建文件，和相应的文件。

## vue-cli
`vue-cli`有5个对应的项目结构。我们使用的是[vue-webpack-boilerplate](https://github.com/vuejs-templates/webpack)。
<!--more-->

```
$ npm install -g vue-cli
$ vue init webpack my-project
$ cd my-project
$ npm install
$ npm run dev
```
执行上面命令后，我们将生成下面的文件结构，并开一个服务，你可以打开[http://localhost:8080](http://localhost:8080)看看。
![](/images/page/vue-cli/1.png)

## 项目结构

![](/images/page/vue-cli/2.png)
大致的项目结构，搭配vue-router、vuex.

> 后面会用cnode的接口api来做个小项目练手，静待后续....