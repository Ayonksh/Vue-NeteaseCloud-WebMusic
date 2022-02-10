import { request } from "@/utils/request";

/**
 * 手机号登录
 * @param {String} phone
 * @param {String} password
 */
export const loginByPhone = (body) => request.post("/login/cellphone", body);

/**
 * 邮箱登录
 * @param {String} email
 * @param {String} password
 */
export const loginByEmail = (body) => request.post("/login", body);

// 检查登录状态
export const getLoginStatus = () => request.get("/login/status");

/**
 * 获取用户详情
 * @param {String} uid 用户 id
 */
export const getUserInfo = (params) => request.get("/user/detail", { params });

/**
 * 获取用户歌单
 * @param {String} uid 用户 id
 * @param {Number} limit
 * @param {Number} offset
 */
export const getUserPlaylist = (params) =>
  request.get("/user/playlist", { params });

/**
 * 每日签到
 * @param {Number} type 默认0，0为安卓端签到，1为 web/PC 签到
 * @param {Number} timestamp
 */
export const dailySignin = (params) => request.get("/daily_signin", { params });

// 退出登录
export const logout = () => {
  request.get("/logout");
};
