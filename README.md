## dva + antd demo实现

### 安装dva
```
npm install dva-cli -g
```

### 安装json-server
```
npm install json-server -g
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

### 前端开发步骤
1. 创建路由，模型，组件
2. 创建编辑框
3. 创建服务service
4. 添加入口

主要修改类名，模型名，字段列表，以及请求api对应的名称。

到目前为止，CRUD之类的基本页面，都可以用脚手架完成。 然后结合文章后面lumen的脚手架，基本的应用页面就ok了，剩下的就是精工细活了。

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

### 注意事项
1. 对于POST, PATCH之类的请求方法，使用fetch方法发送异步请求的时候，需要指定headers:
```
// services下面的响应方法中添加报头
headers: {
  'Accept': 'application/json',
  'Content-Type': 'application/json' // 修复php实现的api无法解析请求body的问题，比如，无法获取到响应的POST参数，PATCH参数之类的问题。
}
```

2. 对于204响应的处理
有些restful api实现，例如DELETE之类的方法，响应码为204， 响应体为空。fetch返回，获取响应的json时就会报错。这样就会导致应用奔溃。
解决方案有两种： 1) api不使用204方式返回。 2) 对于utils/request.js中的request方法，判断response的status, 如果是204，返回空对象。

3. 关于生产环境api部署的问题
生产环境一般来说，都有大量现有代码已经在运行，新方案的替换会带来一定风险，而且还有一定的工作量。因此，可以将部分服务使用新的架构实现。这里，前端页面相对好部署，而后端api需要使用反向代理的方式实现。
```
    location ~ ^/api {
        proxy_pass http://localhost:8099;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        proxy_set_header X-NginX-Proxy true;
        proxy_pass_request_headers on; 
        proxy_redirect off;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        proxy_redirect off;
        proxy_set_header   X-Forwarded-Proto $scheme;
        #proxy_cache one;
        proxy_cache_key sfs$request_uri$scheme;
    }
```
在配置反向代理的过程中，遇到了一些请求参数代理中丢失的问题。 通过第一行的方式解决。具体原理尚未研究，留待后续研究。[todo]

4. async-validator中对于数值验证有bug, 尚未解决，git上已经有人提出这个问题，作者尚未修复此bug, 修复方法如下:
```
// node_modules/async-validator/lib/rule/type.js
typeof value === 'number' 改成typeof +value === 'number'
```


## API服务
开发过程使用mock服务代替真实服务器产生json响应。真实环境采用lumen实现的restful api。
nginx配置文件为nginx\_domain.conf。 API服务代码位于lumen\_api目录中。

### lumen脚手架命令集合
1. php artisan list： 显示所有命令列表
2. php artisan migrate： 运行数据库迁移
3. php artisan api:docs： 从备注的控制器中产生API文档
4. php artisan cache:clear：刷新应用缓存
5. php artisan db:seed：使用初始化记录初始化数据表
6. php artisan make:migration：创建迁移文件
7. php artisan queue：队列相关命令
8. php artisan schedule:run：运行调度命令
9. php artisan make:migration create\_users\_table --create=users, 创建[date]\_create\_users\_table.php文件，里边包含初始化迁移的表字段，有创建时间和更新时间之类的。

### API开发步骤
1. 创建迁移创建表的脚本文件, 即上面命令中的第9条，产生的文件位于database/migrations/[date]\_create\_users\_table.php。
2. 选择性的填充表初始化数据, 创建database/seeds/XXXTableSeeder.php文件，并修改初始化数据。然后可运行php artisan db:seed, 初始化数据表。
3. 复制controller， 修改具体代码实现。
4. 复制model, 修改具体代码实现。
5. 添加API路由， app/Http/routes.php中修改.

API开发基本就这样，后续可写通用化的脚手架工具。自动生成代码。

## 声明
本代码仅供学习研究使用。前端采用dva+antd开发，api通过lumen开发。代码均手工码出来，测试ok的。
后续上更详细的介绍文档。这里的仅作个人备忘，记录个人踩坑和解决问题的过程。

## 参考连接
1. https://github.com/dvajs/dva/blob/master/README\_zh-CN.md
2. https://github.com/sorrycc/blog/issues/18
3. 其中对ie的支持，参见:https://ant.design/docs/react/getting-started-cn
