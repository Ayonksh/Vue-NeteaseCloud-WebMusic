import { mapState, mapMutations, mapActions, mapGetters } from "vuex";

const musicMixin = {
  computed: {
    ...mapState({
      currentTime: (state) => state.music.currentTime, // 当前播放时间
      currentSong: (state) => state.music.currentSong, // 当前歌曲
      history: (state) => state.music.history, // 历史记录
      isDetailShow: (state) => state.music.isDetailShow, // 是否展示歌曲详情
      isMute: (state) => state.music.isMute, // 是否静音
      isPlaylistShow: (state) => state.music.isPlaylistShow, // 播放列表是否显示
      mode: (state) => state.music.mode, // 播放模式
      playing: (state) => state.music.playing, // 播放状态
      playlist: (state) => state.music.playlist, // 播放列表
      playlistLoading: (state) => state.music.loading, // 歌单是否正在加载
    }),
    ...mapGetters("music", [
      "currentIndex",
      "hasCurrentSong",
      "nextSong",
      "prevSong",
    ]),
  },
  methods: {
    ...mapMutations("music", [
      "setCurrentTime",
      "setCurrentSong",
      "setDetailShow",
      "setMode",
      "setMute",
      "setPlaylist",
      "setPlaylistLoading",
      "setPlaylistShow",
      "setPlayState",
    ]),
    ...mapActions("music", [
      "addToPlaylist",
      "clearPlaylist",
      "removeTargetSong",
    ]),
  },
};

const userMixin = {
  computed: {
    ...mapState({
      userAvatarUrl: (state) => state.user.avatarUrl, // 头像
      userBackgroundUrl: (state) => state.user.backgroundUrl, // 背景图
      userEventCount: (state) => state.user.eventCount, // 动态数
      userFollows: (state) => state.user.follows, // 关注数
      userFolloweds: (state) => state.user.followeds, // 粉丝数
      userId: (state) => state.user.userId, // id
      userLevel: (state) => state.user.level, // 等级
      userLogining: (state) => state.user.loading, // 登录中
      userMobileSign: (state) => state.user.mobileSign, // 签到
      userNickname: (state) => state.user.nickname, // 名字
      userPlaylist: (state) => state.user.playlist, // 歌单
      userSignature: (state) => state.user.signature, // 个性签名
    }),
    ...mapGetters("user", ["isLogin"]),
  },
  methods: {
    ...mapMutations("user", [
      "setAvatarUrl",
      "setBackgroundUrl",
      "setEventCount",
      "setFollows",
      "setFolloweds",
      "setLevel",
      "setLoading",
      "setMobileSign",
      "setNickname",
      "setPlayState",
      "setSignature",
      "setUserPlaylist",
    ]),
  },
};

export { musicMixin, userMixin };
