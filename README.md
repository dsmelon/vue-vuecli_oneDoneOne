### 欢迎使用 “一定一” 顶级业务思想架构，你需要按照以下步骤改造成自己的项目
####1.目录src/utils/request.js文件
> 修改各个变量配置的默认值，让其贴合自己项目，可以尝试修改其默认变量，看其表现，此请求已经封装绝大多场景所需要的各种诉求
> 第50行修改自己的token键，此例子使用的是token

####2.目录src/main.js文件
> window.getToken 方法里的获取token改为自己的token

####3.如果用到了异步sdk
> 在目录src/utils/sdk.js里将其改造
> 如果没有用到，可以删除或者不做理会

####注意
+ 所有跳转都要使用window.jump函数
+ 需要登录的地方，会自动登录，只需请求接口即可
+ src/server/api.js里有两个常用的方法，可以按需使用
+ 开发时直接请求接口即可，不必处理登录问题，loading问题，报错问题，整个系统环环相扣，一气呵成，让bug无所遁形

####启动项目
装包 推荐使用yarn,这里使用的就是yarn
```
yarn
npm run serve
```
####结语：
没有任何框架是一劳永逸的，希望大家在使用的同时能够多多思考它所要阐明的道理，剑宗凭招不仗剑，还有很多点在这里我就不出教程了，此思想不依赖任何第三方框架和插件，任何项目,都可以改造成此模式，大家可以在文章下留言，此例子解决的是大家最为头疼的bug最多的登录问题，异步问题，首屏问题，此例子都是最佳，此文章长期更新，若有bug和不明白可以留言

[原文章地址](https://zhuanlan.zhihu.com/p/339323269)