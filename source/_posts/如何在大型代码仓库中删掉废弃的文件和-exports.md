---
title: 如何在大型代码仓库中删掉废弃的文件和 exports
date: 2022-09-07 16:28:09
tags:
---

## 前言

> CRM项目历史悠久，其中很多 文件或是 export 出去的变量 已经不再使用，非常影响维护迭代。举个例子来说，后端问你：“某某接口统计一下某接口是否还有使用？”你在项目里一搜，好家伙，还有好几处使用呢，结果那些定义或文件是从未被引入的，这就会误导你们去继续维护这个文件或接口，影响迭代效率。

## unimported

[unimported](https://github.com/smeijer/unimported) ： Find unused source files in javascript / typescript projects.

### 原理解析：
思路1：
- 与webpack打包类似，遍历整个项目的所有文件，找出所有的文件目录及依赖关系
- 找出没有被其他文件所引用的文件，就表示是unused source files

思路2：
- 与webpack打包类似，遍历整个项目的所有文件，找出所有的文件目录及依赖关系 treeA
- 通过入口文件 index.tsx 开始查找所有用到的文件及依赖关系 treeB
- 比较treeA 与 treeB，找出 unused source files

### 实践

![](/images/page/2022/0927/1.png)

1、当前文件是否被 imported，同理 引用当前文件的文件是否 被 imported
2、当前文件中 import 的文件 是否需要同时被 注释/删除？
3、确认当前文件 及 相关联的文件都处理完成之后，决定是否需要注释/删除

## deadfile

[deadfile](https://www.npmjs.com/package/deadfile)   Simple util to find deadcode and unused files in any JavaScript project (ES5, ES6, React, Vue, ...)


实际使用感受：没有正确找出 deadcode and unused files，可能是使用的姿势不对...有待研究...

## ts-unused-exports

[ts-unused-exports](https://www.npmjs.com/package/ts-unused-exports)   finds unused exported symbols in your Typescript project.

## no-unused-export 

[no-unused-export](https://www.npmjs.com/package/no-unused-export)  A CLI tool to check whether exported things in a module is used by other modules.

## ts-prune 

[ts-prune](https://github.com/nadeesha/ts-prune#readme)  Find potentially unused exports in your Typescript project with zero configuration.

## depcheck

[depcheck](https://www.npmjs.com/package/depcheck) Depcheck is a tool for analyzing the dependencies in a project to see: how each dependency is used, which dependencies are useless, and which dependencies are missing from package.json.

## 拓展：

写一个工具，能够自动甄别 unused source files 并进行注释 或者 删除

参考：[如何在大型代码仓库中删掉 6w 行废弃的文件和 exports？](https://juejin.cn/post/6995371411019710500#comment)