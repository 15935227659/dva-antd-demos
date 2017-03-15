## dva + antd demo实现

### 安装dva
```
npm install dva-cli -g
```
### 运行本实例
1. npm install 安装依赖包
2. npm run start 启动服务，从localhost:8000可看页面效果
3. npm run mock 启动模拟服务器 从localhost:3004可看mock服务。mock服务使用json-server, mockjs实现多样化mock数据。

注意， 请先启动模拟服务器，然后再运行npm run。

### dva提供的脚手架
1. dva g route users: 创建users路由
2. dva g model users: 创建users模型
3. dva g component Users/Users: 创建组件Users/Users

### mock代理配置
```
// .roadhogrc文件中配置
  "proxy": {
    "/api": {
      "target": "http://localhost:3004/",
      "changeOrigin": true,
      "pathRewrite": { "^/api" : "" }
    }
  }

```
## 参考连接
1. https://github.com/dvajs/dva/blob/master/README\_zh-CN.md
2. https://github.com/sorrycc/blog/issues/18
