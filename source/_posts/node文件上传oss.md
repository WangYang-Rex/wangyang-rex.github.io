---
title: node文件上传oss
date: 2021-08-20 14:32:19
tags: [node]
---

闲话不多说，直接上代码
<!--more-->
### web端

```js
// file.tsx.js

const UploadProps: any = {
  name: 'file',
  action: "/file/upload/stream1.rjson", // "/file/upload/file.rjson",
  method: "POST",
  listType: 'picture',
  showUploadList: false,
  onChange: (info: any) => {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      // this.setState({
      //   picUrl:info.file.response.data,
      // })
      console.log(info);
      message.success(`上传成功`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.response.data} 上传失败`);
    }
  },
};

return (
  <div className="main JsErrorList">
    <div className="content-header">
      <Upload {...UploadProps} >
        <Button type="primary" >
            上传图片
        </Button>
      </Upload>
    </div>
  </div>
);
```

### node端

#### router

```js
// router.ts
router.post('/file/upload/stream.rjson', controller.file.streamUpload);
```

#### 配置config文件

config.default.js

```js
import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1626073505827_4266';
  // add your egg config in here
  config.middleware = [];

  config.security = {
    csrf: {
      enable: false,
      ignoreJSON: true,
    },
    domainWhiteList: [ '*' ],
  };
  config.cors = {
    origin: '*', // 匹配规则  域名+端口  *则为全匹配
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  };

  config.multipart = {
    // mode: 'file',
    mode: 'stream',
    fieldSize: '50mb',
    whitelist() {
      return true;
    },
  };
  // the return config will combines to EggAppConfig
  return {
    ...config,
  };
};

```

#### 文件保存本地

```js
import { Controller } from 'egg';
import fs = require('fs');
import path = require('path');
import pump = require('mz-modules/pump');
import OSS = require('ali-oss');

const aliInfo = {
  region: 'oss-cn-hangzhou',
  bucket: 'newbcdn',
  accessKeyId: '81nVk8nRRQ3bmNju',
  accessKeySecret: 'oAoHvFpwYQXAqOOBTCfaAbmH12pT7i',
};

export default class FilterController extends Controller {

  async streamUpload() {
    const stream = await this.ctx.getFileStream(); // 获取stream
    const filename = stream.filename.toLowerCase(); // 获取fieldname
    // 存储本地
    const target = path.join(this.config.baseDir, 'app/public/upload', filename); // 生成目标地址
    const writeStream = fs.createWriteStream(target); // 创建fs对象
    await pump(stream, writeStream); // 保存文件

    // const url = '/'
    this.ctx.body = {
      result: 200,
      message: '上传成功',
      data: 100,
    };
  }
}

```

#### 文件保存oss

```js
import { Controller } from 'egg';
import fs = require('fs');
import path = require('path');
import pump = require('mz-modules/pump');
import OSS = require('ali-oss');

const aliInfo = {
  region: 'oss-cn-hangzhou',
  bucket: 'newbcdn',
  accessKeyId: '81nVk8nRRQ3bmNju',
  accessKeySecret: 'oAoHvFpwYQXAqOOBTCfaAbmH12pT7i',
};

export default class FilterController extends Controller {
  // stream 上传
  async streamUpload() {
    const stream = await this.ctx.getFileStream();
    const filename = stream.filename.toLowerCase();
    const filePath = `cdn/${filename}`;

    // 上传oss
    let result:any;
    const ossClient = new OSS(aliInfo);
    try {
      // https://help.aliyun.com/document_detail/111265.html
      // 处理文件，比如上传到云端
      result = await ossClient.putStream(filePath, stream);
    } catch (e) {
      console.log(e);
    }
    // const url = '/'
    this.ctx.body = {
      result: 200,
      message: '上传成功',
      data: result.url,  //http://newbcdn.oss-cn-hangzhou.aliyuncs.com/cdn/default_avatar_big.jpg
    };
  }
}

```
