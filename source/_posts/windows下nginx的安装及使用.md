---
title: windows下nginx的安装及使用
date: 2021-09-02 16:56:15
tags: [nginx, 全栈]
---

### 下载nginx

http://nginx.org/en/download.html

下载稳定版本，以`nginx/Windows-1.12.2`为例，直接下载 `nginx-1.12.2.zip`
下载后解压，解压后如下

![](/images/page/nginx/1.png)

### nginx命令

`Windows`下`Nginx`的启动、停止等命令, 可以进入到`nginx`的安装根目录，执行`nginx.exe -h`

```js
注意不要直接双击nginx.exe，这样会导致修改配置后重启、停止nginx无效，需要手动关闭任务管理器内的所有nginx进程
在nginx.exe目录，打开命令行工具，用命令 启动/关闭/重启nginx 
start nginx : 启动nginx
nginx -s reload  ：修改配置后重新加载生效
nginx -s reopen  ：重新打开日志文件
nginx -t -c /path/to/nginx.conf 测试nginx配置文件是否正确
关闭nginx：
nginx -s stop  :快速停止nginx
nginx -s quit  ：完整有序的停止nginx
如果遇到报错：
bash: nginx: command not found
有可能是你再linux命令行环境下运行了windows命令，
如果你之前是允许 nginx -s reload报错， 试下 ./nginx.exe -s reload
或者 用windows系统自带命令行工具运行
```

<!--more-->

### 检查nginx是否启动成功

直接在浏览器地址栏输入网址 http://localhost:80，回车，出现以下页面说明启动成功

![](/images/page/nginx/2.png)

### nginx配置

nginx安装目录下 conf目录下的nginx.conf，默认配置的nginx监听的端口为80，如果80端口被占用可以修改为未被占用的端口即可

```js
静态服务器

server {

  listen      80;
  #  server_name crmmanage.superboss.cc;
  server_name blog.html-js.site;
  #  server_name crmappdev.hz.taeapp.com;
  charset utf-8;
  index index.html;

  location / {
    # root   /Users/wy/project/hexo-blog; # mac
    root   "D:/project/hexo-blog"; # windows
  }
}

反向代理
hosts 绑定 127.0.0.1 p.crm

server {

    listen       80;
    server_name p.crm;
    charset utf-8;
    index index.html;

    location ~* ^.+\.(rjson)$ {
        # 测试环境
        proxy_pass http://dingcrmapp.superboss.cc;
        #  proxy_pass http://192.168.63.41:8080;  #沛文
    }
    location / {
        proxy_pass http://localhost:8000;  # 本地服务
    }
}
```

### 使用nginx代理服务器做负载均衡

我们可以修改`nginx`的配置文件`nginx.conf` 达到访问`nginx`代理服务器时跳转到指定服务器的目的，即通过`proxy_pass` 配置请求转发地址，即当我们依然输入`http://localhost:80` 时，请求会跳转到我们配置的服务器

![](/images/page/nginx/3.png)

同理，我们可以配置多个目标服务器，当一台服务器出现故障时，nginx能将请求自动转向另一台服务器，例如配置如下：

![](/images/page/nginx/4.png)

当服务器 `localhost:8080` 挂掉时，`nginx`能将请求自动转向服务器 `192.168.101.9:8080` 。上面还加了一个`weight`属性，此属性表示各服务器被访问到的权重，`weight`
越高被访问到的几率越高。

### 测试或载入指定配置文件

注意，修改了配置文件后最好先检查一下修改过的配置文件是否正 确，以免重启后Nginx出现错误影响服务器稳定运行。判断Nginx配置是否正确命令如下：

```js
C:\server\nginx-1.0.2>nginx.exe -t -c conf/default.conf

```
>nginx: the configuration file C:\server\nginx-1.0.2/conf/default.conf syntax isok
>nginx: configuration file C:\server\nginx-1.0.2/conf/default.conf test is successful

载入指定配置文件
```js
C:\server\nginx-1.0.2>start nginx.exe -c conf/default.conf
```

