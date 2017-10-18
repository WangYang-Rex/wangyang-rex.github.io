---
title: webpack postcss配置
date: 2017-10-18 14:30:28
tags: [webpack]
---
>折腾记：最近一直在写react项目，遇到了不少坑，比如客户端开发使用了antd-mobile库，也使用了推荐的[高清方案](https://github.com/ant-design/ant-design-mobile/wiki/HD)，但是组件都是使用px为单位的，所以需要集成postcss来进行转换rem

### 安装postcss相关npm包
```js
npm install postcss-loader postcss-pxtorem --save-dev
```

### webpack集成postcss
```js
//webpack.config.js
const pxtorem = require('postcss-pxtorem');
// ....
{
    postcss: [
        pxtorem({
            rootValue: 100,
            propWhiteList: []
        }),
        require('autoprefixer')
    ]
}
```

### 设定post-loader
改写loaders，比如要对.css文件进行过滤:
```js
loaders: [
    {
        test: /\.css$/,
        loader: 'style-loader!css-loader!postcss-loader'
    },
]
```
