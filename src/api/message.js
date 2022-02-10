import { request } from "@/utils/request";

/**
 * 通知-私信
 * @param {Number} limit
 * @param {Number} offset
 */
export const getMsgPrivate = (params) => request.post("/msg/private", params);

/**
 * 通知-评论
 * @param {String} uid 用户 id
 * @param {Number} limit
 * @param {Number} offset
 */
export const getMsgComments = (params) => request.post("/msg/comments", params);

/**
 * 通知-@我
 * @param {Number} limit
 * @param {Number} offset
 */
export const getMsgForwards = (params) => request.post("/msg/forwards", params);

/**
 * 通知-通知
 * @param {Number} limit
 * @param {Number} offset
 */
export const getMsgNotices = (params) => request.post("/msg/notices", params);
