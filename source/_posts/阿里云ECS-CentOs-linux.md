---
title: 阿里云ECS-CentOs(linux)
date: 2021-09-05 21:16:35
tags: [linux]
---

### linux文件目录

```js
/       - 根
/bin    - 用户二进制文件
/sbin   - 系统二进制文件
/etc    - 配置文件，比如nginx配置文件
/dev    - 设备文件
/proc   - 进程信息
/var    - 变量文件
/tmp    - 临时文件
/usr    - 用户程序
/home   - HOME目录，所有用户用home目录来存储他们的个人档案。
/boot   - 引导加载程序文件
/lib    - 系统库
/opt    - 可选的附加应用程序
/mnt    - 挂载目录
/media  - 可移动媒体设备
/srv    - 服务数据
```

### linux搭建环境

- [linux安及配置装nginx](https://help.aliyun.com/document_detail/173042.html?spm=5176.21213303.J_6028563670.7.572a3edaz0dICA&scm=20140722.S_help%40%40%E6%96%87%E6%A1%A3%40%40173042.S_hot%2Bos0.ID_173042-RL_centos%E5%AE%89%E8%A3%85nginx-OR_helpmain-V_2-P0_0)
- [linux安装git](https://help.aliyun.com/document_detail/50775.html)
- [CentOs安装node](https://help.aliyun.com/document_detail/50775.html)

<!--more-->

### nginx配置

#### 1、运行以下命令查看Nginx配置文件的默认路径
```js
cat /etc/nginx/nginx.conf
```

#### 2、进入对应目录
```js
cd /etc/nginx/conf.d  // 进入相关目录
```
#### 3、运行一下命令打开默认配置文件
```js
vi default.conf // 编辑配置文件
```
#### 4、按`i`进入编辑模式。

#### 5、在`location`大括号内，修改以下内容。
```js
location / {
    #将该路径替换为您的网站根目录。
    root   /usr/share/nginx/html;
    #添加默认首页信息index.php。
    index  index.html index.htm index.php;
}
```
#### 6、去掉被注释的`location ~ \.php$`大括号内容前的`#`，并修改大括号的内容。
修改完成如下所示。
```js
location ~ \.php$ {
    #将该路径替换为您的网站根目录。
    root           /usr/share/nginx/html;
    #Nginx通过unix套接字与PHP-FPM建立联系，该配置与/etc/php-fpm.d/www.conf文件内的listen配置一致。
    fastcgi_pass   unix:/run/php-fpm/www.sock;
    fastcgi_index  index.php;
    #将/scripts$fastcgi_script_name修改为$document_root$fastcgi_script_name。
    fastcgi_param  SCRIPT_FILENAME  $document_root$fastcgi_script_name;
    #Nginx调用fastcgi接口处理PHP请求。
    include        fastcgi_params;
}
```
#### 7、按下`esc`，并输入`:wq`保存退出文件

#### 8、运行以下命令启动Nginx服务。
```js
systemctl start nginx
```
#### 9、运行以下命令设置Nginx服务开机自启动。
```js
systemctl enable nginx
```
