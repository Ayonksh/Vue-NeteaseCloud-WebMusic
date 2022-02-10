import { request } from "@/utils/request";

// 推荐电台
export const getPersonalDjProgram = () =>
  request.get("/personalized/djprogram");

// 推荐节目
export const getPersonalRecommend = () => request.get("/program/recommend");

// 独家放送(入口列表)
export const getPersonalPrivateContent = () =>
  request.get("/personalized/privatecontent");

/**
 * 独家放送列表
 * @param {Number} limit 返回数量 , 默认为 60
 * @param {Number} offset 偏移数量，用于分页 , 如 :(页数 -1) * 60, 其中 60 为 limit 的值 , 默认为 0
 */
export const getPersonalPrivateContentList = (params) =>
  request.get("/personalized/privatecontent/list", params);

// 推荐新音乐
export const getPersonalNewSong = () => request.get("/personalized/newsong");

/**
 * 推荐歌单
 * @param {Number} limit 取出数量 , 默认为 30 (不支持 offset)
 */
export const getPersonalSongList = (limit = 30) =>
  request.get(`/personalized?limit=${limit}`);

// 推荐MV
export const getPersonalMv = () => request.get("/personalized/mv");
