import Vue from "vue";
import VueRouter from "vue-router";

import NProgress from "nprogress";
import "nprogress/nprogress.css";

Vue.use(VueRouter);

// fix 跳转 url 与当前 url 相同导致的 error
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalPush.call(this, location, onResolve, onReject);
  return originalPush.call(this, location).catch((err) => err);
};

// 基础布局
const layout = () => import("../layout/index.vue");

// 发现音乐模块
const discovery = () => import("../views/discovery/index.vue");
const recommendation = () => import("../views/discovery/recommendation");
const songList = () => import("../views/discovery/song-list");
const singer = () => import("../views/discovery/singer");
const rank = () => import("../views/discovery/rank");
const newMusic = () => import("../views/discovery/new-music");

// 播客模块
const podcast = () => import("../views/podcast");

// 视频模块
const video = () => import("../views/video");
const allMv = () => import("../views/video/mv/all-mv.vue");
const mvRankList = () => import("../views/video/mv/mv-rank-list.vue");

// fm模块
const fm = () => import("../views/fm/index.vue");

// 详情模块
const albumDetail = () => import("../views/detail/album/index.vue");
const djDetail = () => import("../views/detail/dj/index.vue");
const mvDetail = () => import("../views/detail/mv/index.vue");
const singerDetail = () => import("../views/detail/singer/index.vue");
const singerListDetail = () => import("../views/detail/singer-list/index.vue");
const songListDetail = () => import("../views/detail/song-list/index.vue");

// 搜索结果
const search = () => import("../views/search/index.vue");

const routes = [
  {
    name: "Layout",
    path: "/",
    redirect: "/discovery",
    component: layout,
    children: [
      {
        name: "Discovery",
        path: "/discovery", // 发现音乐
        redirect: "/discovery/recommendation",
        component: discovery,
        children: [
          {
            name: "Recommendation",
            path: "recommendation", // 个性推荐
            component: recommendation,
          },
          {
            name: "SongList",
            path: "song-list", // 歌单
            component: songList,
          },
          {
            name: "Singer",
            path: "singer", // 歌手
            component: singer,
          },
          {
            name: "Rank",
            path: "rank", // 排行榜
            component: rank,
          },
          {
            name: "NewMusic",
            path: "new-music", // 最新音乐
            component: newMusic,
          },
        ],
      },
      {
        name: "Podcast",
        path: "/podcast",
        component: podcast,
      },
      {
        name: "Fm",
        path: "/fm",
        component: fm,
      },
      {
        name: "Video",
        path: "/video", // 视频
        component: video,
      },
      {
        name: "AllMv",
        path: "/all-mv", // 所有 MV
        component: allMv,
      },
      {
        name: "MvRankList",
        path: "/mv-rank-list", // MV 排行榜
        component: mvRankList,
      },
      {
        name: "SingerDetail",
        path: "/singer/:id", // 歌手详情
        component: singerDetail,
        props: true,
      },
      {
        name: "DjDetail",
        path: "/dj/:id", // Dj 详情
        component: djDetail,
        props: true,
      },
      {
        name: "SongListDetail",
        path: "/song-list/:id", // 歌单详情
        component: songListDetail,
        props: true,
      },
      {
        name: "AlbumDetail",
        path: "/album/:id", // 专辑详情
        component: albumDetail,
        props: true,
      },
      {
        name: "MvDetail",
        path: "/mv/:id", // mv 详情
        component: mvDetail,
        props: true,
      },
      {
        name: "singerListDetail",
        path: "/singer-list", // 歌手排行榜
        component: singerListDetail,
        props: true,
      },
      {
        name: "Search",
        path: "/search/:keywords", // 搜索结果
        component: search,
        props: true,
      },
    ],
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  NProgress.start();
  next();
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
