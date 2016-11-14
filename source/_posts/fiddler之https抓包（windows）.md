---
title: fiddler之https抓包（windows）
date: 2016-09-12 19:13:36
tags: [工具]
---

> 最近因为fiddler升级，引发的一系列血案，花了整整2个小时才解决，必须记录一下

## 安装并设置
下载fiddler最新版本，官网地址：[http://www.telerik.com/fiddler](http://www.telerik.com/fiddler)

### 设置

1.打开Fiddler，然后点击菜单栏的Tools > Fiddler Options，打开“Fiddler Options”对话框。
![](/images/page/fiddler/1.jpg)

2.在打开的对话框中切换到“HTTPS”选项卡
![](/images/page/fiddler/2.jpg)

3.在打开的“HTTPS”选项卡中，勾选“Capture HTTPS  CONNECTs”和“Decrypt HTTPS traffic”前面的复选框，然后点击“OK”。
![](/images/page/fiddler/3.jpg)

4.现在Fiddler就是在监听https的请求和响应了。
<!--more-->

## 可能遇到的问题
### 证书问题，需要重新安装
1. 导出证书：fiddler->tools->fiddler options->https tab->action->Export Root Certificate to Desktop
2. 安装证书：
- IE：Internet选项->内容 tab->证书->删除所有颁发者为DO_NOT_TRUST_FiddlerRoot->导入证书
- Chrome:设置->高级设置->管理证书->删除所有颁发者为DO_NOT_TRUST_FiddlerRoot->导入证书
![](/images/page/fiddler/4.jpg)

### 证书、设置都正确了发现还是有问题，请重启FIDDLER和浏览器，fiddler请用管理员权限运行，还不行就重启电脑
