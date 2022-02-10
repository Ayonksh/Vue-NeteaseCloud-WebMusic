import { playModeConfig, defaultMode } from "@/config";
import { isDefined } from "@/utils";

export default {
  namespaced: true,
  state: {
    currentTime: 0, // 当前播放时间
    currentSong: {}, // 当前歌曲
    history: [], // 历史记录
    isDetailShow: false, // 是否展示歌曲详情
    isMute: false, // 是否静音
    isPlaylistShow: false, // 播放列表是否显示
    loading: false, // 歌单是否正在加载
    mode: defaultMode, // 播放模式
    playing: false, // 播放状态
    playlist: [], // 播放列表
  },
  mutations: {
    setCurrentSong(state, currentSong) {
      state.currentSong = currentSong;
    },
    setCurrentTime(state, currentTime) {
      state.currentTime = currentTime;
    },
    setDetailShow(state, isDetailShow) {
      state.isDetailShow = isDetailShow;
    },
    setMode(state, mode) {
      state.mode = mode;
    },
    setMute(state, isMute) {
      state.isMute = isMute;
    },
    setPlaylist(state, playlist) {
      state.playlist = playlist;
    },
    setPlaylistLoading(state, loading) {
      state.loading = loading;
    },
    setPlaylistShow(state, show) {
      state.isPlaylistShow = show;
    },
    setPlayState(state, playing) {
      state.playing = playing;
    },
  },
  actions: {
    // 新增歌曲
    addToPlaylist({ commit, state }, song) {
      const playlist = state.playlist.slice();
      const { id } = song;
      if (!playlist.some((song) => song.id === id)) {
        playlist.unshift(song);
        commit("setPlaylist", playlist);
        commit("setCurrentSong", song);
      }
    },
    // 清除播放列表
    clearPlaylist({ commit }) {
      commit("setPlaylist", []);
      commit("setCurrentSong", {});
    },
    // 移除对应 idx 的歌曲
    removeTargetSong({ commit, state }, idx) {
      const playlist = state.playlist.slice();
      playlist.splice(idx, 1);
      commit("setPlaylist", playlist);
      commit("setCurrentSong", playlist[idx] ? playlist[idx] : {});
    },
  },
  getters: {
    currentIndex(state) {
      const { currentSong, playlist } = state;
      return playlist.findIndex(({ id }) => id === currentSong.id);
    },
    // 当前是否有歌曲在播放
    hasCurrentSong(state) {
      return isDefined(state.currentSong.id);
    },
    prevSong(state, getters) {
      const { playlist, mode } = state;
      const prevIndexMap = {
        [playModeConfig.loop.key]: getSequencePrevIndex(), // 列表循环
        [playModeConfig.order.key]: getSequencePrevIndex(), // 顺序播放
        [playModeConfig.random.key]: getRandomPrevIndex(), // 随机播放
        [playModeConfig.single.key]: getsinglePrevIndex(), // 单曲循环
      };

      return playlist[prevIndexMap[mode.key]];

      // 顺序播放
      function getSequencePrevIndex() {
        let prevIndex = getters.currentIndex - 1;
        if (prevIndex < 0) {
          prevIndex = playlist.length - 1;
        }
        return prevIndex;
      }

      // 随机播放
      function getRandomPrevIndex() {
        return getRandomIndex(playlist, getters.currentIndex);
      }

      // 单曲循环
      function getsinglePrevIndex() {
        return getters.currentIndex;
      }
    },
    nextSong(state, getters) {
      const { playlist, mode } = state;
      const nextIndexMap = {
        [playModeConfig.loop.key]: getLoopNextIndex(), // 列表循环
        [playModeConfig.order.key]: getLoopNextIndex(), // 顺序播放
        [playModeConfig.random.key]: getRandomNextIndex(), // 随机播放
        [playModeConfig.single.key]: getsingleNextIndex(), // 单曲循环
      };

      return playlist[nextIndexMap[mode.key]];

      // 列表循环 顺序播放
      function getLoopNextIndex() {
        let nextIndex = getters.currentIndex + 1;
        if (nextIndex > playlist.length - 1) {
          nextIndex = 0;
        }
        return nextIndex;
      }

      // 随机播放
      function getRandomNextIndex() {
        return getRandomIndex(playlist, getters.currentIndex);
      }

      // 单曲循环
      function getsingleNextIndex() {
        return getters.currentIndex;
      }
    },
  },
};

function getRandomIndex(playlist, currentIndex) {
  // 防止无限循环
  if (playlist.length === 1) {
    return currentIndex;
  }
  let index = Math.round(Math.random() * (playlist.length - 1));
  if (index === currentIndex) {
    index = getRandomIndex(playlist, currentIndex);
  }
  return index;
}
