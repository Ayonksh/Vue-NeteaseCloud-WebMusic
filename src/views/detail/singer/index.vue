<template>
  <div class="wrap">
    <ay-loading :loading="loading">
      <div class="header">
        <img class="avatar" v-lazy="getImgUrl(info.picUrl, 200, 200)" />
        <div class="info">
          <div class="name">{{ info.name }}</div>
          <div class="alias">
            <span v-for="alia in info.alias" :key="alia">
              {{ alia }}
            </span>
          </div>
          <div class="music" v-if="info.musicSize">
            专辑数：{{ info.musicSize }}
          </div>
          <div class="album" v-if="info.albumSize">
            单曲数：{{ info.albumSize }}
          </div>
        </div>
      </div>
    </ay-loading>
    <div class="content">
      <ay-tab v-model="activeName">
        <ay-tab-pane label="专辑" name="1">
          <albums :albums="albums" :loading="loading"></albums>
        </ay-tab-pane>
        <ay-tab-pane label="MV" name="2">
          <mvs :id="id"></mvs>
        </ay-tab-pane>
        <ay-tab-pane label="歌手详情" name="3">
          <description :name="info.name" :id="id"></description>
        </ay-tab-pane>
      </ay-tab>
    </div>
  </div>
</template>

<script>
import { getArtistAlbum } from "@/api";
import { AyTab, AyTabPane, AyLoading } from "@/base";
import { getImgUrl } from "@/utils";
import Mvs from "./mvs";
import Description from "./description";
import Albums from "./albums";
export default {
  name: "SingerDetail",
  components: {
    AyTab,
    AyTabPane,
    AyLoading,
    Albums,
    Description,
    Mvs,
  },
  props: ["id"],
  data() {
    return {
      activeName: "1",
      info: {},
      albums: [],
      loading: false,
    };
  },
  created() {
    this.initAlbum();
  },
  watch: {
    id() {
      this.initAlbum();
    },
  },
  methods: {
    getImgUrl,
    async initAlbum() {
      this.loading = true;
      const { id } = this;
      const { hotAlbums, artist } = await getArtistAlbum({ id, limit: 1000 });
      this.albums = hotAlbums;
      this.info = artist;
      this.loading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.wrap {
  padding: 18px 0;
  .header {
    display: flex;
    justify-content: flex-start;
    padding: 0 34px;
    width: 100%;
    min-height: 200px;
    .avatar {
      height: 200px;
      width: 200px;
      background-size: cover;
      background-repeat: no-repeat;
      margin-right: 24px;
    }
    .info {
      .name {
        font-size: 26px;
      }
      .alias {
        font-size: $font-size-sm;
        margin: 18px 0;
      }
      .album {
        margin: 6px 0;
        font-size: $font-size-sm;
      }
      .music {
        margin: 6px 0;
        font-size: $font-size-sm;
      }
    }
  }
}
</style>
