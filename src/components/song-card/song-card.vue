<template>
  <div class="song-card" @click="toDetail()">
    <div class="img-wrap">
      <img class="song-icon" v-lazy="getImgUrl(imgUrl, 300, 300)" />
      <div class="img-wrap__top txt">{{ count }}</div>
      <div class="img-wrap__bottom txt" v-if="artistName">{{ artistName }}</div>
      <div class="play" @click.stop="handlePlay">
        <img class="play-icon" :src="require('@/assets/icon/play-red.png')" />
      </div>
    </div>
    <p>{{ name }}</p>
  </div>
</template>

<script>
import { getImgUrl } from "@/utils";
export default {
  name: "SongCard",
  props: ["imgUrl", "count", "name", "artistName", "id"],
  methods: {
    getImgUrl,
    toDetail() {
      this.$router.push({ name: "SongListDetail", params: { id: this.id } });
    },
    handlePlay() {
      this.$emit("click");
    },
  },
};
</script>

<style lang="scss" scoped>
.song-card {
  font-size: $font-size-sm;
  width: 100%;
  cursor: pointer;
  .img-wrap {
    position: relative;
    overflow: hidden;
    border-radius: 8px;
    padding-top: 100%;
    margin-bottom: 8px;
    .song-icon {
      @include abs-stretch;
      width: 100%;
      height: 100%;
    }
    .play {
      @include abs-center;
      width: 20%;
      height: 20%;
      border-radius: 50%;
      border: 1px solid hsla(0, 0%, 100%, 0.08);
      background: hsla(0, 0%, 100%, 0.14);
      backdrop-filter: blur(8px);
      display: flex;
      justify-content: center;
      align-items: center;
      opacity: 0;
      transition: 0.3s;
      .play-icon {
        color: $theme-color;
        width: 40%;
        height: 40%;
        margin-left: 3px;
      }
    }
    .txt {
      color: $white;
      width: 100%;
      line-height: 1.4;
      position: absolute;
      padding: 6px;
      transition: all 0.3s;
    }
    &__top {
      top: 0;
      background-color: rgba(0, 0, 0, 0.4);
    }
    &__bottom {
      bottom: 0;
    }
    &:hover {
      .play {
        opacity: 0.8;
      }
    }
  }
}
</style>
