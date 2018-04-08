---
title: pm2实现负载均衡
date: 2018-04-08 11:16:03
tags: [node]
---

### 前言
源码：[https://github.com/Unitech/pm2](https://github.com/Unitech/pm2)
>这里的pm2并不是大气污染物啊

事实上，pm2 是一个带有负载均衡功能的Node应用的进程管理器，Node实现进程管理的库有很多，forever也是其中一个很强大但是也相对较老的进程管理器。

### 为什么要使用pm2
对于这个问题，先说说我的看法，最基本的原因是因为node本身是一个单线程应用，它的特点就是所有方法都是串行一次执行，并且node并没有能力像Java一样独自去创建一个新的线程来实现异步操作，如果在执行I/O中遇到了阻塞就会降低整个应用的执行效率，导致CPU使用率高等不利原因。

因此在这种模式下，一个线程只能处理一个任务，要想提高吞吐量必须通过多线程。虽然单线程的好处有很多比如避免了线程同步或者死锁、状态同步等等之类的问题，但是在应用和计算能力要求日益倍增的今天，单线程最大的弊端就是无法利用多核CPU带来的优势来提升运行效率。

我们知道node可以利用异步I/O来避免线程阻塞，提高利用率等优点:
![](/images/page/pm2/1.png)

同时为了弥补单线程无法利用多核CPU的问题，提供了“子进程”这个概念，Node.js 实际上是 Javascript 执行线程的单线程，真正的的 I/O 操作，底层 API 调用都是通过多线程执行的。当然在这里我只是指出了这一背景，那么为什么我们要用pm2？

我总结了两个比较简洁的答案：1、pm2可以把你的应用部署到服务器所有的CPU上（$ pm2 start app.js -i max），有效的解决了之前背景里提出的问题。 2、同样是进程管理器，为什么不用forever？我认为最大的区别是在监控欠缺，进程和集群管理有限。在监控以及log方面可以认为forever完败于pm2，为什么，一张图你就知道答案。
![](/images/page/pm2/2.png)

这是pm2官网给出的Demo，我们可以清晰地看见整个集群的模式、状态，CPU利用率甚至是内存大小，而forever给出的是什么呢？null

如果我要实时监控所有的进程状态呢？
![](/images/page/pm2/3.png)

这就是pm2的强大之处，多进程管理、监控、负载均衡……

### pm2主要特点
- 内建负载均衡（使用Node cluster 集群模块、子进程，可以参考朴灵的《深入浅出node.js》一书第九章）
- 线程守护，keep alive
- 0秒停机重载，维护升级的时候不需要停机.
- 现在 Linux (stable) & MacOSx (stable) & Windows (stable).多平台支持
- 停止不稳定的进程（避免无限循环）
- 控制台检测
- 提供 HTTP API
- 远程控制和实时的接口API ( Nodejs 模块,允许和PM2进程管理器交互 )

### 用法
```js
$ npm install pm2 -g     # 命令行安装 pm2
$ pm2 start app.js -i 4  #后台运行pm2，启动4个app.js
                         # 也可以把'max' 参数传递给 start
                         # 正确的进程数目依赖于Cpu的核心数目
$ pm2 start app.js --name my-api # 命名进程
$ pm2 list               # 显示所有进程状态
$ pm2 monit              # 监视所有进程
$ pm2 logs               #  显示所有进程日志
$ pm2 stop all           # 停止所有进程
$ pm2 restart all        # 重启所有进程
$ pm2 reload all         # 0秒停机重载进程 (用于 NETWORKED 进程)
$ pm2 stop 0             # 停止指定的进程
$ pm2 restart 0          # 重启指定的进程
$ pm2 startup            # 产生 init 脚本 保持进程活着
$ pm2 web                # 运行健壮的 computer API endpoint (http://localhost:9615)
$ pm2 delete 0           # 杀死指定的进程
$ pm2 delete all         # 杀死全部进程

运行进程的不同方式：
$ pm2 start app.js -i max  # 根据有效CPU数目启动最大进程数目
$ pm2 start app.js -i 3      # 启动3个进程
$ pm2 start app.js -x        #用fork模式启动 app.js 而不是使用 cluster
$ pm2 start app.js -x -- -a 23   # 用fork模式启动 app.js 并且传递参数 (-a 23)
$ pm2 start app.js --name serverone  # 启动一个进程并把它命名为 serverone
$ pm2 stop serverone       # 停止 serverone 进程
$ pm2 start app.json        # 启动进程, 在 app.json里设置选项
$ pm2 start app.js -i max -- -a 23                   #在--之后给 app.js 传递参数
$ pm2 start app.js -i max -e err.log -o out.log  # 启动 并 生成一个配置文件
你也可以执行用其他语言编写的app  ( fork 模式):
$ pm2 start my-bash-script.sh    -x --interpreter bash
$ pm2 start my-python-script.py -x --interpreter python
```

### 附上keymetrics实时监控
地址：[https://app.keymetrics.io/#/register](https://app.keymetrics.io/#/register)

pm2官方也结合pm2管理提供了一套可视化在线监控平台，有多牛？上图：
![](/images/page/pm2/4.png)

注册完毕后创建自己的第一个项目工程成功后会得到如图所示口令：
![](/images/page/pm2/5.jpeg)

系统分配的public key 和secret key。然后，在安装有pm2的服务器端输入以下命令
```js
pm2 interact your-secret-key your-public-key
```
接下来的事情就交给可视化去做吧。