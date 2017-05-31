---
title: Android WebView调试
date: 2017-02-08 16:59:21
tags: [手机调试]
---

Google DevTools支持在PC Chrome上检查、分析、调试Android设备或者模拟器上的WebView页面。

<!--more-->

## 准备工作
### 1、PC
a) 安装Chrome32以上版本。
b) 开启Chrome的USB检索功能：<br/>
   在Chrome中打开”chrome://inspect/#devices“，勾选”Discover USB devices“。
![](/images/page/android-webview/1.png)

### 2、Android手机（4.4及以上版本）/ Android4.4模拟器
a） 开启Debug:<br/>
	打开 “设置”à“开发选项”à“USB调试”。
![](/images/page/android-webview/2.png)
注：一些手机默认隐藏了”开发选项“，需要进入”设置“à”关于手机“，然后连续点击”Android版本号“栏（大于等于7次），之后“设置“中将会出现”开发选项“。

### 3、需要调试的目标Android APP
需要App中的WebView开启debug功能：
![](/images/page/android-webview/3.png)
千牛Android App可以在运行时开启WebView的Debug功能：<br/>

进入“设置”à“关于千牛”,在如下界面点击千牛图标大于等于10次开启debug模式，开启后会有提示如下图：
![](/images/page/android-webview/4.png)

## 调试WebView页面
### 1、通过USB线连接Android手机与PC。
如果出现”是否允许调试“的条框中，选择”确定“。
![](/images/page/android-webview/5.png)

### 2、调试Android App中WebView页面：
在Android App中打开某个需要调试的WebView页面。然后在PC Chrome中打开”chrome://inspect“页面：
![](/images/page/android-webview/6.png)
如图中列出的WebView实例，及其打开的页面信息。点击”inspect”打开页面调试窗口（注意：这步需要翻墙后才能打开,翻墙参考https://github.com/goagent/goagent）：
![](/images/page/android-webview/7.png)

FAQ:
1. 在PC Chrome”chrome://inspect“页面中看不到Android设备或者模拟器信息：
1. 首先检查Android手机或者模拟器是否开起“Debug调试”，如果开启了还是不能展示，则需要检查驱动是否安装成功。
2. 在PC Chrome”chrome://inspect“页面中看不到WebView页面信息：需要跟Android App人员确定获得的App是否开启WebView可调试。
3. 在PC Chrome”chrome://inspect“页面中选择一个页面，点击“inspect”后打开的调试页面始终是空白：**需要翻墙后再次打开**。
4. 更多详细资料可以参考：[https://developer.chrome.com/devtools/docs/remote-debugging#install-adbplugin](https://developer.chrome.com/devtools/docs/remote-debugging#install-adbplugin)