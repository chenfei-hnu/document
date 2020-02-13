> 参考MinDoc功能简单实现的文档管理系统，因为MinDoc感觉部署起来太麻烦了，同时自己编码熟悉些服务端处理

### Server 
Nodejs + Express + Mongoose

### Client 
React Hooks + Typescript 

### 操作步骤
```
1.在官网下载MongoDB最新安装包，安装成功后，在命令行下进入MongoDB\bin目录，输入mongod 执行成功说明安装成功，不用添加到环境变量
2.在Studio 3T官网下载后安装，可以可视化显示本地MongoDB数据库的数据
3.两端都先 yarn install 或者 npm install
4.然后server先执行 yarn dev 或者 npm run dev，连接数据库并启动服务端localhost:3000
5.再client中再执行 yarn start 或者 npm start启动客户端localhost:3001，并自动打开浏览器显示首页
```