# Vue-NeteaseCloud-WebMusic

## 简介

基于 Vue2、Vue-CLI4，仿照 windows 版网易云音乐的客户端 UI 界面进行开发设计，并作适当修改。

项目使用了自己封装设计的一套基础 UI 组件库，所有页面采用模块化设计，降低耦合度，提高复用性

## 技术栈

- 前端：***vue2 全家桶*** 通过 Vue-CLI4 初始化生成
- 后端：***[NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi)*** 提供所有后端数据

## 目录

```
·
|-- api  后台接口
|-- assets  静态资源
|-- base  基础 UI 组件
|-- components 页面模块组件
|-- config  业务配置
|-- layout  页面基础布局
|-- router  路由
|-- store  全局状态管理
|-- style  样式
|-- utils  工具方法
`-- views  具体页面
```

## 功能预览

+ 个性推荐![recommendation](./docs/recommendation.png)

+ 登录

![login](./docs/login.png)

+ 歌单![playlist](./docs/songlist.png)

+ 排行榜![rank](./docs/rank.png)

+ 歌手![singer](./docs/singer.png)

+ 播放列表![playlist](./docs/playlist.png)

+ 当前歌曲![currentsong](./docs/currentsong.png)

+ 视频播放![mv](./docs/mv.png)

## 使用方法

1. 运行后端仓库

   见 [NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi)

2. 运行本仓库

   ```bash
   npm install
   npm run serve
   ```
