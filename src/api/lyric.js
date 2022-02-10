import { request } from "@/utils/request";

/**
 * 获取歌词
 * @param {Number} id
 */
export const getLyric = (params) => request.get("/lyric", { params });
