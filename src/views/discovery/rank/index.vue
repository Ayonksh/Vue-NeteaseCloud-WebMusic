<template>
  <div class="rank-page-wrap">
    <ay-card :shadow="'never'">
      <div slot="header">官方榜</div>
      <div class="rank-list-wrap">
        <div class="list-wrap">
          <div class="list-item">
            <rank-list
              :id="soarId"
              :list="flattenDeep(soar.tracks)"
              :banner="soar.coverImgUrl"
              :len="8"
            ></rank-list>
          </div>
          <div class="list-item">
            <rank-list
              :id="newsId"
              :list="flattenDeep(news.tracks)"
              :banner="news.coverImgUrl"
              :len="8"
            ></rank-list>
          </div>
          <div class="list-item">
            <rank-list
              :id="originalId"
              :list="flattenDeep(original.tracks)"
              :banner="original.coverImgUrl"
              :len="8"
            ></rank-list>
          </div>
          <div class="list-item">
            <rank-list
              :id="hotId"
              :list="flattenDeep(hot.tracks)"
              :banner="hot.coverImgUrl"
              :len="8"
            ></rank-list>
          </div>
          <div class="list-item">
            <rank-list
              :list="flattenDeep(singer.tracks)"
              :banner="singer.coverUrl"
              :len="8"
            ></rank-list>
          </div>
        </div>
      </div>
    </ay-card>
    <ay-card :shadow="'never'">
      <div slot="header">全球榜</div>
      <ay-loading :loading="songListLoading">
        <ul class="list-wrap">
          <li class="list-item" v-for="sheet in global" :key="sheet.id">
            <song-card
              @click="handleGetSong(sheet.id)"
              :id="sheet.id"
              :count="formatNumber(sheet.playCount).toString()"
              :imgUrl="sheet.coverImgUrl"
              :name="sheet.name"
            ></song-card>
          </li>
        </ul>
      </ay-loading>
    </ay-card>
  </div>
</template>

<script>
import {
  getTopList,
  getPlayListDetail,
  getTopArtists,
  getSongDetail,
} from "@/api";
import { AyCard, AyLoading } from "@/base";
import { SongCard } from "@/components";
import RankList from "./ranklist";
import { flattenDeep, formatNumber, musicMixin, formatSong } from "@/utils";
export default {
  name: "Rank",
  mixins: [musicMixin],
  components: { AyCard, AyLoading, SongCard, RankList },
  data() {
    return {
      totalList: [], // 榜单集合
      soar: {}, // 飙升榜
      news: {}, // 新歌榜
      original: {}, // 原创榜
      hot: {}, // 热歌榜,
      singer: {}, // 歌手榜
      songListLoading: false,
    };
  },
  created() {
    this.initTopList();
    this.initSingerList();
  },
  computed: {
    // 飙升榜 id
    soarId() {
      return this.totalList[0] && this.totalList[0].id;
    },
    // 新歌榜 id
    newsId() {
      return this.totalList[1] && this.totalList[1].id;
    },
    // 原创榜 id
    originalId() {
      return this.totalList[2] && this.totalList[2].id;
    },
    // 热歌榜 id
    hotId() {
      return this.totalList[3] && this.totalList[3].id;
    },
    // 全球榜
    global() {
      const { totalList } = this;
      return totalList.slice(4, totalList.length);
    },
  },
  watch: {
    async soarId(id) {
      const { playlist } = await getPlayListDetail({ id });
      this.soar = playlist;
    },
    async newsId(id) {
      const { playlist } = await getPlayListDetail({ id });
      this.news = playlist;
    },
    async originalId(id) {
      const { playlist } = await getPlayListDetail({ id });
      this.original = playlist;
    },
    async hotId(id) {
      const { playlist } = await getPlayListDetail({ id });
      this.hot = playlist;
    },
  },
  methods: {
    formatNumber,
    flattenDeep,
    async initTopList() {
      const { list, artistToplist } = await getTopList();
      this.totalList = list;
      this.singer = { ...this.singer, ...artistToplist };
    },
    async initSingerList() {
      this.songListLoading = true;
      const { artists } = await getTopArtists();
      this.$set(this.singer, "tracks", artists);
      this.songListLoading = false;
    },
    async handleGetSong(id) {
      this.setPlaylistLoading(true);
      const { playlist } = await getPlayListDetail({ id });
      const { trackIds } = playlist;
      await this.getSongDetail(trackIds.map(({ id }) => id).join(","));
      this.setPlaylistLoading(false);
    },
    async getSongDetail(ids) {
      const { songs } = await getSongDetail({ ids });
      const playlist = [];
      songs.map((song) => {
        playlist.push(
          formatSong({
            id: song.id,
            name: song.name,
            artists: song.ar,
            duration: song.dt,
            mvId: song.mv,
            img: song.al.picUrl,
            albumId: song.al.id,
            albumName: song.al.name,
          })
        );
      });
      this.setPlaylist(playlist);
      this.setCurrentSong(playlist[0]);
    },
  },
};
</script>

<style lang="scss" scoped>
.rank-page-wrap {
  @include list(20%);
  .rank-list-wrap {
    width: 100%;
    @include list(33%);
  }
}
</style>
