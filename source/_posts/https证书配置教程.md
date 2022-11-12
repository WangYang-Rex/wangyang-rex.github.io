---
title: 手把手教你如何配置SSL证书开启https
date: 2022-10-28 11:31:31
tags:
---

## 申请 SSL 证书

![](/images/page/20221031/ssl2.png)

自2021年01月01日起，每个实名认证的阿里云主账号可以在一个自然年内，通过数字证书管理服务一次性领取20张免费DV单域名试用证书（以下简称免费证书）。获取免费证书后，您需要通过数字证书管理服务控制台提交证书申请。CA中心审核通过证书申请后，将为您签发免费证书。

### 步骤一：领取免费证书额度

每个自然年内，您都可以使用已完成实名认证的阿里云账号，通过数字证书管理服务一次性申领20张免费证书。如果一个自然年内20张免费证书的额度已用完，您可以付费购买和免费证书同类型的证书。

1. [访问免费证书购买页](https://common-buy.aliyun.com/?spm=a2c4g.11186623.0.0.40cf4724805YgY&amp;commodityCode=cas_dv_public_cn&amp;request=%7B%22product%22%3A%22free_product%22%7D)。
2. 选择您需要的购买数量，单击**立即购买**并完成支付。
阿里云账号只有在一个自然年内首次购买**数量**为**20**的**DV单域名证书（免费试用）**时，可以免费领取。
如果您的阿里云账号在当前自然年内已经领取过20张免费证书，则再次选购**DV单域名证书（免费试用）**时，需要支付对应的费用。


### 步骤二：提交免费证书申请

参考：[申请免费DV单域名试用证书](https://help.aliyun.com/document_detail/156645.htm?spm=5176.smartservice_service_robot_chat_new.0.0.46493f1bVjZpqO#section-z1b-xa0-5tj)



## 部署 SSL 证书

### SSL证书安装指南

参考文档：
[SSL证书安装指南](https://help.aliyun.com/document_detail/109827.htm?spm=a2c4g.11186623.0.0.40cf4724805YgY#concept-95505-zh)
[部署证书到阿里云产品](https://help.aliyun.com/document_detail/98575.htm?spm=a2c4g.11186623.0.0.d13b4724180SLs#task-2512206)


### 服务器配置

1、安全组添加443端口

### nginx配置添加ssl相关配置

```js
#以下属性中，以ssl开头的属性表示与证书配置有关。
server {
    listen 443 ssl;
    #配置HTTPS的默认访问端口为443。
    #如果未在此处配置HTTPS的默认访问端口，可能会造成Nginx无法启动。
    #如果您使用Nginx 1.15.0及以上版本，请使用listen 443 ssl代替listen 443和ssl on。
    server_name yourdomain;
    root html;
    index index.html index.htm;
    ssl_certificate cert/cert-file-name.pem;  
    ssl_certificate_key cert/cert-file-name.key; 
    ssl_session_timeout 5m;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
    #表示使用的加密套件的类型。
    ssl_protocols TLSv1.1 TLSv1.2 TLSv1.3; #表示使用的TLS协议的类型，您需要自行评估是否配置TLSv1.1协议。
    ssl_prefer_server_ciphers on;
    location / {
        root html;  #Web网站程序存放目录。
        index index.html index.htm;
    }
}
```

## FAQ

![](/images/page/20221031/ssl3.png)

### 配置了HTTPS之后，有可能证书链不完整 解决方案：

![](/images/page/20221031/ssl4.png)

[【缺少证书链的问题和解决办法】](https://blog.myssl.com/faq-miss-ca-certificate/)

![](/images/page/20221031/ssl5.png)

将证书放到服务器的指定位置

![](/images/page/20221031/ssl6.png)

在nginx中修改完整ssl证书的配置

![](/images/page/20221031/ssl7.png)