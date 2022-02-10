<template>
  <transition name="playlist">
    <div class="playlist-wrap" v-if="isPlaylistShow">
      <ay-tab v-model="activeName">
        <ay-tab-pane :name="'播放列表'" :label="'播放列表'">
          <ay-loading :loading="playlistLoading">
            <div class="list-wrap">
              <div class="header" v-if="playlist">
                <div class="count">总共有{{ playlist.length }}首</div>
                <div class="btn" @click="clearPlaylist">清空</div>
              </div>
              <table class="table">
                <tr
                  v-for="(song, idx) in playlist"
                  :key="song.id"
                  @click="setCurrentSong(song)"
                  :class="currentSong.id === song.id ? 'active' : ''"
                >
                  <td>{{ song.name }}</td>
                  <td>{{ song.artistsText }}</td>
                  <td>{{ song.durationText }}</td>
                  <td class="delete" @click.stop="removeTargetSong(idx)">
                    删除
                  </td>
                </tr>
              </table>
            </div>
          </ay-loading>
        </ay-tab-pane>
        <ay-tab-pane :name="'历史记录'" :label="'历史记录'"></ay-tab-pane>
      </ay-tab>
    </div>
  </transition>
</template>

<script>
import { AyTab, AyTabPane, AyLoading } from "@/base";
import { on, off, musicMixin } from "@/utils";
export default {
  name: "Playlist",
  mixins: [musicMixin],
  components: { AyTab, AyTabPane, AyLoading },
  data() {
    return {
      activeName: "播放列表",
      footerEl: null,
    };
  },
  mounted() {
    this.footerEl = document.getElementById("footer__ref");
    on(document, "click", this.close);
  },
  methods: {
    close(e) {
      const { target } = e;
      if (this.footerEl && this.footerEl.contains(target)) return; // 点击 footer
      if (this.$el.contains(target)) return; // 点击自身
      if (this.isPlaylistShow) this.setPlaylistShow(false);
    },
  },
  beforeDestroy() {
    off(document, "click", this.close);
  },
};
</script>

<style lang="scss" scoped>
.playlist-wrap {
  position: absolute;
  top: 0;
  right: 0;
  height: calc(100% - 64px);
  width: $playlist-width;
  background-color: $white;
  z-index: $playlist-index;
  @include box-shadow;
  overflow-y: auto;
  min-height: calc(100% - 64px);
  .list-wrap {
    font-size: $font-size-sm;
    .header {
      display: flex;
      justify-content: space-between;
      padding: 6px 24px;
      border-bottom: 1px solid $grey;
      margin-bottom: 16px;
      .btn {
        color: $blue;
        cursor: pointer;
        &:hover {
          color: $theme-color;
        }
      }
    }
    .table {
      margin-bottom: 21px;
      width: 100%;
      table-layout: fixed;
      tr {
        transition: 0.3s;
        cursor: pointer;
        &.active {
          color: $theme-color;
        }
        td {
          width: 100%;
          height: 28px;
          line-height: 28px;
          display: inline-block;
          @include text-ellipsis;
          padding: 0 10px;
          &:nth-child(1) {
            width: 40%;
            padding: 0 10px 0 20px;
          }
          &:nth-child(2) {
            width: 30%;
          }
          &:nth-child(3) {
            width: 15%;
          }
          &:nth-child(4) {
            width: 15%;
            text-align: right;
            opacity: 0;
            transition: 0.3s;
          }
        }
        &:nth-child(even) {
          background-color: $grey-light;
        }
        &:hover {
          background-color: $grey;
          td.delete {
            opacity: 1;
          }
        }
      }
    }
  }
}
</style>
