---
title: React学习笔记1-Create React App
date: 2017-01-17 14:37:57
tags: [react]
---

React学习捷径：
>深入模式: React+ES6+WebPack+React Redux+Fetch+React Router+Immutable+React Native+NodeJs
>正常模式: React+ES6+WebPack+React Redux
>简易模式: React+ES6+WebPack+React Flux(React官方Flux库)

在看了一些react的文档以及以下新手入门文档之后，就想动手写个项目练练手，虽然知道要用react、react-router等，但是项目的脚手架如果自己写的话对于新手来说基本不可能，所以网上找了一款脚手架：[Create React App](https://github.com/facebookincubator/create-react-app)

```
npm install -g create-react-app

create-react-app my-app
cd my-app/
npm start
```
然后访问 http://localhost:3000 就可以看到初始页面了哦

![](/images/page/react/1.png)

当然这个只是包含了react基础的npm包，以及静态服务，热插拔，其他如果要用的话可以自己install相关的插件。
<!--more-->
<ul>
<li><a href="https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#updating-to-new-releases">Updating to New Releases</a></li>
<li><a href="https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#folder-structure">Folder Structure</a></li>
<li><a href="https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#available-scripts">Available Scripts</a></li>
<li><a href="https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#syntax-highlighting-in-the-editor">Syntax Highlighting in the Editor</a></li>
<li><a href="https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#displaying-lint-output-in-the-editor">Displaying Lint Output in the Editor</a></li>
<li><a href="https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#changing-the-page-title">Changing the Page <code>&lt;title&gt;</code></a></li>
<li><a href="https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#installing-a-dependency">Installing a Dependency</a></li>
<li><a href="https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#importing-a-component">Importing a Component</a></li>
<li><a href="https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#adding-a-stylesheet">Adding a Stylesheet</a></li>
<li><a href="https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#post-processing-css">Post-Processing CSS</a></li>
<li><a href="https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#adding-images-and-fonts">Adding Images and Fonts</a></li>
<li><a href="https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#using-the-public-folder">Using the <code>public</code> Folder</a></li>
<li><a href="https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#using-global-variables">Using Global Variables</a></li>
<li><a href="https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#adding-bootstrap">Adding Bootstrap</a></li>
<li><a href="https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#adding-flow">Adding Flow</a></li>
<li><a href="https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#adding-custom-environment-variables">Adding Custom Environment Variables</a></li>
<li><a href="https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#can-i-use-decorators">Can I Use Decorators?</a></li>
<li><a href="https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#integrating-with-a-node-backend">Integrating with a Node Backend</a></li>
<li><a href="https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#proxying-api-requests-in-development">Proxying API Requests in Development</a></li>
<li><a href="https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#using-https-in-development">Using HTTPS in Development</a></li>
<li><a href="https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#generating-dynamic-meta-tags-on-the-server">Generating Dynamic <code>&lt;meta&gt;</code> Tags on the Server</a></li>
<li><a href="https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#running-tests">Running Tests</a></li>
<li><a href="https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#developing-components-in-isolation">Developing Components in Isolation</a></li>
<li><a href="https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#making-a-progressive-web-app">Making a Progressive Web App</a></li>
<li><a href="https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#deployment">Deployment</a></li>
<li><a href="https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#troubleshooting">Troubleshooting</a></li>
</ul>

>好了，赶紧开启我们的react之旅吧~
