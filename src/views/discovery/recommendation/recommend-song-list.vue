<template>
  <ay-loading :loading="loading">
    <ul class="list-wrap">
      <li class="list-item" v-for="song in songs" :key="song.id">
        <song-card
          @click="handleGetSong(song.id)"
          :id="song.id"
          :imgUrl="song.picUrl"
          :name="song.name"
          :count="formatNumber(song.playCount).toString()"
        ></song-card>
      </li>
    </ul>
  </ay-loading>
</template>

<script>
import { getPersonalSongList, getPlayListDetail, getSongDetail } from "@/api";
import { AyLoading } from "@/base";
import { SongCard } from "@/components";
import { formatNumber, musicMixin, formatSong } from "@/utils";
export default {
  name: "RecommendSongList",
  mixins: [musicMixin],
  components: {
    AyLoading,
    SongCard,
  },
  data() {
    return {
      songs: [],
      loading: false,
    };
  },
  created() {
    this.initSongList();
  },
  methods: {
    formatNumber,
    // 初始化歌单列表
    async initSongList() {
      this.loading = true;
      const { result } = await getPersonalSongList();
      this.songs = result;
      this.loading = false;
    },
    // 点击播放获取歌单中的歌曲 id 数组
    async handleGetSong(id) {
      this.setPlaylistLoading(true);
      const { playlist } = await getPlayListDetail({ id });
      const { trackIds } = playlist;
      await this.getSongDetail(trackIds.map(({ id }) => id).join(","));
      this.setPlaylistLoading(false);
    },
    // 获取歌曲数组
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
@include list(20%);
</style>
