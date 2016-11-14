---
title: Git 推送和删除远程标签
date: 2016-09-18 14:34:41
tags: [git]
---

事实上Git 的推送和删除远程标签命令是相同的，删除操作实际上就是推送空的源标签refs：

```
git push origin 标签名
```
相当于
```
git push origin refs/tags/源标签名:refs/tags/目的标签名
```

推送标签：
```
git push origin 标签名
```

删除本地标签：
```
git tag -d 标签名
```

删除远程标签：
```
git push origin :refs/tags/标签名

git push origin :refs/tags/protobuf-2.5.0rc1
```
<!--more-->

其他本地操作：
```
#打标签
git tag -a v1.1.4 -m "tagging version 1.1.4"

#删除本地仓库标签
git tag -d v1.1.4

#列出标签
git tag
```