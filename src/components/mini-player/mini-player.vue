<template>
  <div class="mini-player" :class="hasCurrentSong ? '' : 'no-play'">
    <!-- <ay-popover trigger="manual" placement="right" :show="isTipsShow">
      <template slot="content">
        <div class="tips-wrap">{{ tipsText }}</div>
      </template>
    </ay-popover> -->
    <div class="song-wrap" v-if="hasCurrentSong">
      <div class="img-wrap" @click="toggleShowDetail">
        <img :src="getImgUrl(currentSong.img, 64, 64)" />
        <img :src="require('@/assets/mini-player/arrow-up.png')" />
      </div>
      <div class="info-wrap">
        <p :title="currentSong.name">{{ currentSong.name }}</p>
        <p :title="currentSong.artistsText">{{ currentSong.artistsText }}</p>
      </div>
    </div>
    <div class="play-wrap">
      <div class="control-wrap">
        <div class="item" @click="prev">
          <img :src="require('@/assets/mini-player/prev.png')" />
        </div>
        <div class="item" @click="pause" v-if="playing">
          <img :src="require('@/assets/mini-player/pause.png')" />
        </div>
        <div class="item" @click="play" v-if="!playing">
          <img
            class="icon-play"
            :src="require('@/assets/mini-player/play.png')"
          />
        </div>
        <div class="item" @click="next">
          <img :src="require('@/assets/mini-player/next.png')" />
        </div>
      </div>
      <div class="progress-bar-wrap">
        <p class="bar-time" v-if="currentTime">{{ formatTime(currentTime) }}</p>
        <ay-progress
          v-model="playProgress"
          :disable="disable"
          color="red"
          :showProgress="false"
          @bar-click="setAudioCurrentTime"
          @moving="onArtificialMoving"
          @moving-stop="onArtificialMoveStop"
        />
        <p class="bar-time">{{ currentSong.durationText }}</p>
      </div>
    </div>
    <div class="tools-wrap" v-if="hasCurrentSong">
      <div class="volume">
        <ay-popover
          trigger="hover"
          placement="top"
          :customStyle="{
            width: '30px',
            'border-radius': '5px',
            padding: '20px',
          }"
        >
          <div class="item" v-if="isMute" @click="toggleMute">
            <img :src="require('@/assets/mini-player/volumeMute.png')" />
          </div>
          <div class="item" v-else @click="toggleMute">
            <img
              v-if="volumeProgress < 0.5"
              :src="require('@/assets/mini-player/volumeLow.png')"
            />
            <img v-else :src="require('@/assets/mini-player/volumeHigh.png')" />
          </div>
          <template slot="content">
            <ay-progress
              v-model="volumeProgress"
              strokeWidth="5px"
              barMode="vertical"
              barLength="100px"
              color="red"
            />
          </template>
        </ay-popover>
      </div>
      <div class="mode" @click="handleModeChange" v-if="mode">
        <div class="item">
          <img :src="mode.icon" />
        </div>
      </div>
      <div class="playlist" @click="toggleShowPlaylist">
        <div class="item">
          <img :src="require('@/assets/mini-player/playlist.png')" />
        </div>
      </div>
    </div>
    <audio
      ref="audio"
      preload="auto"
      id="audio"
      :src="currentSong.url"
      @play="onPlay"
      @canplay="canPlay"
      @ended="onEnded"
      @waiting="onWaiting"
      @pause="onPause"
      @timeupdate="onTimeUpdate"
      @error="onError"
      @volumechange="onVolumeChange"
    ></audio>
  </div>
</template>

<script>
const ERROR_MAP = {
  MEDIA_ERR_ABORTED: {
    key: 1,
    desc: "用户的请求中止了关联资源的获取.",
    info: "用户的请求中止了关联资源的获取",
  },
  MEDIA_ERR_NETWORK: {
    key: 2,
    desc: "尽管以前可用，但发生了某种网络错误，阻止了媒体的成功获取.",
    info: "网络错误",
  },
  MEDIA_ERR_DECODE: {
    key: 3,
    desc: "	尽管先前已确定可用，但在尝试解码媒体资源时发生了错误，从而导致错误.",
    info: "资源出现错误，请尝试切换歌曲",
  },
  MEDIA_ERR_SRC_NOT_SUPPORTED: {
    key: 4,
    desc: "已发现关联的资源或媒体提供程序对象（例如MediaStream ）不合适.",
    info: "无法播放，可能是VIP歌曲，请切换歌曲",
  },
};
import { AyProgress, AyPopover } from "@/base";
import { playModeConfig, defaultMode } from "@/config";
import {
  isNaN,
  isDefined,
  musicMixin,
  formatTime,
  getImgUrl,
  getSongImg,
} from "@/utils";
export default {
  name: "MiniPlayer",
  mixins: [musicMixin],
  components: { AyProgress, AyPopover },
  metaInfo() {
    return {
      title: this.currentSong.id
        ? `${this.currentSong.name}--${this.currentSong.artistsText}`
        : "你好，欢迎来到☁村",
    };
  },
  data() {
    return {
      playModeConfig,
      playProgress: 0,
      volumeProgress: 0.8,
      tempVolume: 0,
      ready: false,
      error: false,
      artificialMoving: false,
      isTipsShow: false,
      tipsText: "",
    };
  },
  computed: {
    audio() {
      return this.$refs.audio;
    },
    disable() {
      return !this.hasCurrentSong;
    },
    loading() {
      return this.hasCurrentSong && !this.ready;
    },
    isOrder() {
      return this.mode.key === playModeConfig.order.key;
    },
    isSingle() {
      return this.mode.key === playModeConfig.single.key;
    },
  },
  watch: {
    isTipsShow(show) {
      if (show) {
        const self = this;
        setTimeout(() => {
          self.isTipsShow = false;
          self.tipsText = false;
        }, 3000);
      }
    },
    ready(ready) {
      if (ready && !this.playing) {
        this.play();
      }
    },
    async currentSong(newSong, oldSong) {
      if (!newSong.id) {
        // 还原状态
        this.setPlayState(false);
        this.playProgress = 0;
        this.audio.currentTime = 0;
        this.audio.src = "";
      }
      if (newSong.id === oldSong.id) {
        return;
      }
      if (newSong.id) {
        this.ready = false;
        this.setPlayState(false);
        // 当前歌曲没有设置封面的时候主动去获取
        if (!newSong.img) {
          if (newSong.albumId) {
            const song = Object.assign({}, newSong);
            song.img = await getSongImg(song.id, song.albumId);
            this.setCurrentSong(song);
          }
        }
      }
    },
    volumeProgress(progress) {
      this.audio.volume = progress;
    },
    currentTime(time) {
      if (!this.artificialMoving)
        this.playProgress = time / this.currentSong.durationSecond;
    },
    error(err) {
      if (err) {
        this.pause();
      }
    },
  },
  methods: {
    getImgUrl,
    formatTime,
    toggleShowDetail() {
      this.setDetailShow(!this.isDetailShow);
    },
    toggleShowPlaylist() {
      this.setPlaylistShow(!this.isPlaylistShow);
    },
    setAudioCurrentTime() {
      const time = this.playProgress * this.currentSong.durationSecond;
      if (isNaN(time)) return;
      this.audio.currentTime = time;
    },
    onArtificialMoveStop() {
      this.setAudioCurrentTime();
      this.artificialMoving = false;
    },
    onArtificialMoving() {
      this.artificialMoving = true;
    },
    // 静音切换
    toggleMute() {
      if (this.isMute) {
        this.volumeProgress = this.tempVolume;
        this.setMute(false);
        this.audio.muted = false;
      } else {
        this.tempVolume = this.volumeProgress;
        this.volumeProgress = 0;
        this.setMute(true);
        this.audio.muted = true;
      }
    },
    // 播放模式切换
    handleModeChange() {
      const modes = Object.values(playModeConfig);
      const index = modes.findIndex((val) => val.key === this.mode.key) + 1;
      const mode = modes[index] ? modes[index] : defaultMode;
      this.setMode(mode);
    },
    onPlay() {
      if (!this.playing) {
        this.setPlayState(true);
      }
    },
    canPlay() {
      this.ready = true;
    },
    onEnded() {
      // 顺序播放模式下，播放完最后一首歌曲就停止播放
      if (this.isOrder && this.currentIndex === this.playlist.length - 1)
        return;
      // 单曲循环
      if (this.isSingle) {
        this.audio.currentTime = 0;
        this.play();
        return;
      }
      this.next();
    },
    onWaiting() {
      // this.ready = false;
    },
    onPause() {
      if (this.playing) {
        this.setPlayState(false);
      }
    },
    onError() {
      this.error = true;
      const { error } = this.audio;
      if (error) {
        const { code, detail } = error;
        const errors = Object.values(ERROR_MAP);
        const idx = errors.findIndex(({ key }) => key === code);
        const msg = detail ? detail : errors[idx].info;
        this.showTips(`CODE：${code}，信息：${msg}`);
        this.$notify({
          duration: 6000,
          title: `CODE：${code}`,
          message: `信息：${msg}`,
        });
      }
    },
    showTips(text) {
      this.isTipsShow = true;
      this.tipsText = text;
    },
    onTimeUpdate(e) {
      this.setCurrentTime(e.target.currentTime);
    },
    onVolumeChange() {},
    async play() {
      if (!isDefined(this.currentSong.id)) return;
      try {
        this.error = false;
        await this.audio.play();
      } catch (err) {
        this.error = true;
        console.error(err);
      }
    },
    pause() {
      if (!isDefined(this.currentSong.id)) return;
      this.audio.pause();
    },
    prev() {
      if (this.prevSong) this.setCurrentSong(this.prevSong);
    },
    next() {
      if (this.nextSong) this.setCurrentSong(this.nextSong);
    },
  },
};
</script>

<style lang="scss" scoped>
// .tips-wrap {
//   font-size: $font-size-sm;
//   font-weight: bold;
//   color: $grey-dark;
//   padding: 2px 14px;
// }
.no-play {
  background-color: $grey-light;
  pointer-events: none;
}
.mini-player {
  user-select: none;
  height: 100%;
  padding: 6px 24px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  .song-wrap {
    display: flex;
    .img-wrap {
      position: relative;
      width: 48px;
      height: 48px;
      margin-right: 12px;
      border-radius: 6px;
      overflow: hidden;
      cursor: pointer;
      img:nth-child(1) {
        width: 100%;
        height: 100%;
        filter: blur(0.4px);
      }
      img:nth-child(2) {
        height: 20px;
        width: 20px;
        @include abs-center;
        opacity: 0;
      }
      &:hover {
        img:nth-child(1) {
          filter: blur(2px);
        }
        img:nth-child(2) {
          opacity: 1;
        }
      }
    }
    .info-wrap {
      width: 120px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      p {
        @include text-ellipsis();
      }
      p:nth-child(1) {
        font-size: $font-size-lg;
      }
      p:nth-child(2) {
        font-size: $font-size-sm;
        color: $grey-dark;
      }
    }
  }
  .play-wrap {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    .control-wrap {
      display: flex;
      justify-content: center;
      .item {
        width: 40px;
        height: 40px;
        margin: 0 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        img {
          height: 24px;
          width: 24px;
        }
        .icon-play {
          margin-left: 3px;
        }
        &:hover {
          border-radius: 50%;
          background-color: $grey;
        }
        &:nth-child(2) {
          border-radius: 50%;
          background-color: $grey;
        }
      }
    }
    .progress-bar-wrap {
      display: flex;
      justify-content: center;
      align-items: center;
      .bar-time {
        width: 30px;
        margin: 0 5px;
        font-size: $font-size-sm;
      }
    }
  }
  .tools-wrap {
    width: 180px;
    display: flex;
    justify-content: center;
    align-items: center;
    .volume {
      margin: 0 5px;
      .item {
        width: 40px;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        img {
          height: 20px;
          width: 20px;
        }
        &:hover {
          border-radius: 50%;
          background-color: $grey;
        }
      }
    }
    .mode {
      margin: 0 5px;
      .item {
        width: 40px;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        img {
          height: 20px;
          width: 20px;
        }
        &:hover {
          border-radius: 50%;
          background-color: $grey;
        }
      }
    }
    .playlist {
      margin: 0 5px;
      .item {
        width: 40px;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        img {
          height: 20px;
          width: 20px;
        }
        &:hover {
          border-radius: 50%;
          background-color: $grey;
        }
      }
    }
  }
}
</style>
