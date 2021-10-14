---
title: git放弃本地文件修改
date: 2021-10-09 16:07:50
tags: [git]
---

### 1. 未使用git add 缓存代码

使用git checkout – filename，注意中间有–

```js
git checkout -- filename
```

放弃所有文件修改 git checkout .

```js
git checkout .
```

此命令用来放弃掉所有还没有加入到缓存区（就是 git add 命令）的修改：内容修改与整个文件删除
此命令不会删除新建的文件，因为新建的文件还没加入git管理系统中，所以对git来说是未知，只需手动删除即可

### 2. 已使用git add 缓存代码，未使用git commit

使用 git reset HEAD filename

```js
git reset HEAD filename
```

放弃所有文件修改 git reset HEAD

```js
git reset HEAD
```

此命令用来清除 git 对于文件修改的缓存。相当于撤销 git add 命令所在的工作。在使用本命令后，本地的修改并不会消失，而是回到了第一步1. 未使用git add 缓存代码，继续使用用git checkout – filename，就可以放弃本地修改

### 3. 已经用 git commit 提交了代码

使用 git reset --hard HEAD^ 来回退到上一次commit的状态

```js
git reset --hard HEAD^
```

或者回退到任意版本git reset --hard commit id ，使用git log命令查看git提交历史和commit id

```js
git reset --hard commit id
```
