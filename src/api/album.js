import { request } from "@/utils/request";

/**
 * 获取专辑内容
 * @param {Number} id
 */
export const getAlbumDetail = (params) => request.get("/album", { params });
