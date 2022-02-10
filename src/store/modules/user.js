export default {
  namespaced: true,
  state: {
    avatarUrl: "", // 头像
    backgroundUrl: "", // 背景图
    eventCount: "", // 动态数
    follows: "", // 关注数
    followeds: "", // 粉丝数
    level: "", // 等级
    loading: false, // 登录中
    nickname: "", // 名字
    playlist: "", // 歌单
    signature: "", // 个性签名
    mobileSign: "", // 签到
    userId: "", // id
  },
  mutations: {
    setAvatarUrl(state, avatarUrl) {
      state.avatarUrl = avatarUrl;
    },
    setBackgroundUrl(state, backgroundUrl) {
      state.backgroundUrl = backgroundUrl;
    },
    setEventCount(state, eventCount) {
      state.eventCount = eventCount;
    },
    setFollows(state, follows) {
      state.follows = follows;
    },
    setFolloweds(state, followeds) {
      state.followeds = followeds;
    },
    setLevel(state, level) {
      state.level = level;
    },
    setLoading(state, loading) {
      state.loading = loading;
    },
    setNickname(state, nickname) {
      state.nickname = nickname;
    },
    setSignature(state, signature) {
      state.signature = signature;
    },
    setMobileSign(state, mobileSign) {
      state.mobileSign = mobileSign;
    },
    setUserPlaylist(state, playlist) {
      state.playlist = playlist;
    },
    setUserId(state, userId) {
      state.userId = userId;
    },
  },
  actions: {},
  getters: {
    isLogin(state) {
      return !!state.userId;
    },
  },
};
