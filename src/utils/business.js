import {
  loginByPhone,
  loginByEmail,
  verifyCaptcha,
  getLoginStatus,
  getUserInfo,
  getUserPlaylist,
  logout,
  getAlbumDetail,
} from "@/api";
import { AyNotification } from "@/base";
import store from "@/store";
import { isEmail, formatTime } from "./base";

export function getImgUrl(url, w, h) {
  if (!h) {
    h = w;
  }
  return `${url}?param=${w}y${h}`;
}

export function getSongUrl(id) {
  return `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
}

export function getArtistsText(artists) {
  return (artists || []).map(({ name }) => name).join("/");
}

export async function getSongImg(id, albumId) {
  const { songs } = await getAlbumDetail({ id: albumId });
  const {
    al: { picUrl },
  } = songs.find(({ id: songId }) => songId === id) || {};
  return picUrl;
}

export function formatSong(song) {
  const {
    id,
    name,
    img,
    artists,
    duration,
    albumId,
    albumName,
    mvId,
    ...rest
  } = song;

  return {
    id,
    name,
    img,
    artists,
    duration,
    albumName,
    albumId,
    url: getSongUrl(id),
    artistsText: getArtistsText(artists),
    durationSecond: duration / 1000,
    durationText: formatTime(duration / 1000),
    mvId,
    ...rest,
  };
}

export async function accountLogin(account, password) {
  const request = {
    email: emailLogin,
    phone: phoneLogin,
  };
  return request[isEmail(account) ? "email" : "phone"](account, password);
}

// 邮箱登录
export async function emailLogin(account, password) {
  try {
    const { cookie, profile, token } = await loginByEmail({
      email: account,
      password,
    });
    console.log(profile);
    loginSuccess(profile.userId, token, cookie);
  } catch (e) {
    loginError();
    Promise.reject(e);
  }
}

// 手机号登录
export async function phoneLogin(account, password) {
  try {
    const { cookie, profile, token } = await loginByPhone({
      phone: account,
      password,
    });
    loginSuccess(profile.userId, token, cookie);
  } catch (e) {
    loginError();
    Promise.reject(e);
  }
}

// 验证码登录
export async function captchaLogin(phone, captcha, ctcode) {
  try {
    const { cookie, profile, token } = await verifyCaptcha({
      phone: phone,
      captcha: captcha,
      ctcode: ctcode,
    });
    loginSuccess(profile.userId, token, cookie);
  } catch (e) {
    loginError();
    Promise.reject(e);
  }
}

export async function qrcodeLogin(cookie) {
  try {
    const { data } = await getLoginStatus({
      cookie: cookie,
    });
    AyNotification({
      duration: 4000,
      title: "登录成功",
    });
    document.cookie = cookie;
    localStorage.setItem("userId", data.profile.userId);
    await initUserInfo(data.profile.userId);
  } catch (e) {
    loginError();
    Promise.reject(e);
  }
}

async function loginSuccess(userId, token, cookie) {
  AyNotification({
    duration: 4000,
    title: "登录成功",
  });
  document.cookie = cookie;
  localStorage.setItem("userId", userId);
  localStorage.setItem("token", token);
  await initUserInfo(userId);
}

function loginError() {
  AyNotification({
    duration: 4000,
    title: "登录失败",
  });
}

export async function userLogout() {
  try {
    await logout();
    resetUserDetail();
    AyNotification({
      duration: 4000,
      title: "成功退出登录",
    });
  } catch (e) {
    AyNotification({
      duration: 4000,
      title: "退出登录失败",
      message: "请刷新页面/清理缓存",
    });
    resetUserDetail();
  }
}

export async function initUserInfo(uid) {
  try {
    const { profile, level, mobileSign } = await getUserInfo({ uid });
    const { playlist } = await getUserPlaylist({ uid, limit: 1000 });
    const {
      avatarUrl,
      backgroundUrl,
      eventCount,
      follows,
      followeds,
      nickname,
      signature,
    } = profile;
    store.commit("user/setAvatarUrl", avatarUrl);
    store.commit("user/setBackgroundUrl", backgroundUrl);
    store.commit("user/setEventCount", eventCount);
    store.commit("user/setFollows", follows);
    store.commit("user/setFolloweds", followeds);
    store.commit("user/setLevel", level);
    store.commit("user/setNickname", nickname);
    store.commit("user/setSignature", signature);
    store.commit("user/setMobileSign", mobileSign);
    store.commit("user/setUserId", uid);
    store.commit("user/setUserPlaylist", playlist);
    AyNotification({
      duration: 4000,
      title: "成功获取用户信息",
    });
  } catch (e) {
    AyNotification({
      duration: 4000,
      title: "获取用户信息失败",
    });
  }
}

function resetUserDetail() {
  store.commit("user/setAvatarUrl", "");
  store.commit("user/setBackgroundUrl", "");
  store.commit("user/setEventCount", "");
  store.commit("user/setFollows", "");
  store.commit("user/setFolloweds", "");
  store.commit("user/setLevel", "");
  store.commit("user/setNickname", "");
  store.commit("user/setSignature", "");
  store.commit("user/setMobileSign", "");
  store.commit("user/setUserId", "");
  store.commit("user/setUserPlaylist", "");
  localStorage.removeItem("userId");
  localStorage.removeItem("token");
}
